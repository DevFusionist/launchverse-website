"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

import { Activity, ActivityType, ActivityStatus } from "@/models/Activity";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { UserRole, UserStatus } from "@/lib/types";
import { Student } from "@/models/Student";
import { Course } from "@/models/Course";

// JWT secret as Uint8Array for jose
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Update student schema for validation
const studentSchema = z.object({
  // User fields (required for creation)
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  status: z
    .enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.PENDING])
    .default(UserStatus.PENDING),
  // Student specific fields
  education: z
    .array(
      z.object({
        institution: z.string().min(1, "Institution is required"),
        degree: z.string().min(1, "Degree is required"),
        field: z.string().min(1, "Field is required"),
        graduationYear: z.number().optional(),
      }),
    )
    .min(1, "At least one education entry is required"),
  skills: z.array(z.string()).default([]),
  githubProfile: z.string().url().optional().or(z.literal("")),
  linkedinProfile: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  enrolledCourses: z
    .array(
      z.object({
        course: z.string().min(1, "Course is required"),
        batchNumber: z.number().min(1, "Batch number is required"),
      }),
    )
    .optional(),
});

// Update student schema (without password)
const updateStudentSchema = studentSchema.omit({ password: true }).partial();

interface Enrollment {
  course: mongoose.Types.ObjectId;
  batchNumber: number;
  enrollmentDate: Date;
  status: "ACTIVE" | "COMPLETED" | "DROPPED";
  progress: number;
}

// Enrollment schema for validation
const enrollmentSchema = z.object({
  course: z.string().min(1, "Course is required"),
  batchNumber: z.number().min(1, "Batch number is required"),
});

// Rate limiting map
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
async function checkRateLimit(limit: number = 5, windowMs: number = 60000) {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "anonymous";

  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  Array.from(rateLimit.entries()).forEach(([key, value]) => {
    if (value.resetTime < windowStart) {
      rateLimit.delete(key);
    }
  });

  // Get or create rate limit entry
  const entry = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs };

  // Check if rate limit exceeded
  if (entry.count >= limit) {
    throw new Error("Too many requests, please try again later");
  }

  // Increment counter
  entry.count++;
  rateLimit.set(ip, entry);
}

// Helper function to check admin access with rate limiting
async function checkAdminAccess(rateLimitOptions?: {
  limit: number;
  windowMs: number;
}) {
  // Apply rate limiting if options provided
  if (rateLimitOptions) {
    await checkRateLimit(rateLimitOptions.limit, rateLimitOptions.windowMs);
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (!token?.value) {
    throw new Error("Authentication required");
  }

  try {
    const { payload } = await jwtVerify(token.value, ACCESS_TOKEN_SECRET);
    const decoded = payload as {
      id: string;
      email: string;
      role: UserRole;
      name: string;
      type: "access";
    };

    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }

    if (![UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(decoded.role)) {
      throw new Error("Unauthorized access");
    }

    await connectDB();
    const user = await User.findOne({
      _id: decoded.id,
      status: UserStatus.ACTIVE,
    });

    if (!user) {
      throw new Error("User not found or inactive");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

// Helper function to get headers
async function getRequestHeaders() {
  const headersList = await headers();

  return {
    ipAddress:
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip"),
    userAgent: headersList.get("user-agent"),
  };
}

// Helper function to transform MongoDB document to plain object
function transformMongoDoc(doc: any): any {
  if (!doc) return doc;

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map((item) => transformMongoDoc(item));
  }

  // Handle objects
  if (doc && typeof doc === "object") {
    // Special handling for documents with _id
    if (doc._id) {
      const transformed = { ...doc };

      transformed._id = doc._id.toString();
      // Transform remaining properties
      for (const [key, value] of Object.entries(doc)) {
        if (key !== "_id") {
          transformed[key] = transformMongoDoc(value);
        }
      }

      return transformed;
    }

    // Handle standalone ObjectId
    if (
      doc._bsontype === "ObjectID" ||
      doc instanceof mongoose.Types.ObjectId
    ) {
      return doc.toString();
    }

    // Handle Date objects
    if (doc instanceof Date) {
      return doc.toISOString();
    }

    // Handle Buffer
    if (Buffer.isBuffer(doc)) {
      return doc.toString("hex");
    }

    // Transform all properties of the object
    const transformed: any = {};

    for (const [key, value] of Object.entries(doc)) {
      transformed[key] = transformMongoDoc(value);
    }

    return transformed;
  }

  // Return primitive values as is
  return doc;
}

// Create student (10 requests per minute)
export async function createStudent(data: z.infer<typeof studentSchema>) {
  try {
    const admin = await checkAdminAccess({ limit: 10, windowMs: 60000 });

    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      return {
        success: false,
        error: "Email already registered",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user first
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: UserRole.STUDENT,
      status: data.status,
      invitedBy: admin._id,
    });

    // Create student profile with required fields
    const student = await Student.create({
      user: user._id,
      education: data.education,
      skills: data.skills,
      githubProfile: data.githubProfile || undefined,
      linkedinProfile: data.linkedinProfile || undefined,
      portfolio: data.portfolio || undefined,
      enrolledCourses: [], // Initialize empty enrolled courses
    });

    // Get populated student data
    const populatedStudent = await Student.findById(student._id)
      .populate(
        "user",
        "-password -verificationToken -verificationTokenExpires -otp -otpExpires -refreshToken -refreshTokenExpires",
      )
      .lean();

    const transformedStudent = transformMongoDoc(populatedStudent);

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();

    await Activity.create({
      type: ActivityType.ADMIN_CREATE_USER,
      status: ActivityStatus.SUCCESS,
      user: admin._id,
      targetUser: user._id,
      metadata: {
        studentName: user.name,
        studentEmail: user.email,
        studentStatus: user.status,
        enrollmentNumber: student.enrollmentNumber,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/students");

    return {
      success: true,
      student: transformedStudent,
      message: "Student created successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const admin = await checkAdminAccess({ limit: 10, windowMs: 60000 });
      const { ipAddress, userAgent } = await getRequestHeaders();

      await Activity.create({
        type: ActivityType.ADMIN_CREATE_USER,
        status: ActivityStatus.FAILURE,
        user: admin._id,
        metadata: {
          error: error.message,
          studentData: data,
        },
        ipAddress,
        userAgent,
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }

    return {
      success: false,
      error: error.message || "Failed to create student",
    };
  }
}

// Get students with filters and pagination
export async function getStudents({
  page = 1,
  limit = 10,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: UserStatus;
  search?: string;
}) {
  try {
    await checkAdminAccess();
    await connectDB();

    const query: any = { "user.role": UserRole.STUDENT };

    if (status) query["user.status"] = status;
    if (search) {
      query.$or = [
        { "user.name": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
        { enrollmentNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [students, total] = await Promise.all([
      Student.find(query)
        .populate(
          "user",
          "-password -verificationToken -verificationTokenExpires -otp -otpExpires -refreshToken -refreshTokenExpires",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(query),
    ]);

    const transformedStudents = transformMongoDoc(students);

    return {
      success: true,
      students: transformedStudents,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      message: "Students fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch students",
    };
  }
}

// Get single student
export async function getStudent(id: string) {
  try {
    await checkAdminAccess();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid student ID" };
    }

    await connectDB();
    const student = await Student.findById(id)
      .populate(
        "user",
        "-password -verificationToken -verificationTokenExpires -otp -otpExpires -refreshToken -refreshTokenExpires",
      )
      .populate({
        path: "enrolledCourses.course",
        select: "title",
      })
      .lean();

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    const transformedStudent = transformMongoDoc(student);

    return {
      success: true,
      student: transformedStudent,
      message: "Student fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch student",
    };
  }
}

// Update student
export async function updateStudent(
  id: string,
  data: Partial<z.infer<typeof updateStudentSchema>>,
) {
  try {
    const admin = await checkAdminAccess({ limit: 10, windowMs: 60000 });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid student ID" };
    }

    await connectDB();
    const student = await Student.findById(id).populate("user");

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    // Split data into user and student fields
    const { name, email, status, ...studentData } = data;

    // Update user if user fields are provided
    if (name || email || status) {
      if (email && email !== student.user.email) {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return {
            success: false,
            error: "Email already registered",
          };
        }
      }

      await User.findByIdAndUpdate(student.user._id, {
        ...(name && { name }),
        ...(email && { email }),
        ...(status && { status }),
        updatedBy: admin._id,
      });
    }

    // Update student profile, ensuring required fields are present
    const updateData: any = {};

    if (studentData.education) {
      updateData.education = studentData.education;
    }
    if (studentData.skills) {
      updateData.skills = studentData.skills;
    }
    if (studentData.githubProfile !== undefined) {
      updateData.githubProfile = studentData.githubProfile || undefined;
    }
    if (studentData.linkedinProfile !== undefined) {
      updateData.linkedinProfile = studentData.linkedinProfile || undefined;
    }
    if (studentData.portfolio !== undefined) {
      updateData.portfolio = studentData.portfolio || undefined;
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate(
        "user",
        "-password -verificationToken -verificationTokenExpires -otp -otpExpires -refreshToken -refreshTokenExpires",
      )
      .lean();

    const transformedStudent = transformMongoDoc(updatedStudent);

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();

    await Activity.create({
      type: ActivityType.ADMIN_UPDATE_USER,
      status: ActivityStatus.SUCCESS,
      user: admin._id,
      targetUser: student.user._id,
      metadata: {
        studentName: student.user.name,
        studentEmail: student.user.email,
        updatedFields: Object.keys(data),
        previousStatus: student.user.status,
        newStatus: status || student.user.status,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${id}`);

    return { success: true, student: transformedStudent };
  } catch (error: any) {
    // Log failed activity
    try {
      const admin = await checkAdminAccess({ limit: 10, windowMs: 60000 });
      const { ipAddress, userAgent } = await getRequestHeaders();

      await Activity.create({
        type: ActivityType.ADMIN_UPDATE_USER,
        status: ActivityStatus.FAILURE,
        user: admin._id,
        targetUser: new mongoose.Types.ObjectId(id),
        metadata: {
          error: error.message,
          updateData: data,
        },
        ipAddress,
        userAgent,
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }

    return {
      success: false,
      error: error.message || "Failed to update student",
    };
  }
}

// Delete student
export async function deleteStudent(id: string) {
  try {
    const admin = await checkAdminAccess({ limit: 5, windowMs: 60000 });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid student ID" };
    }

    await connectDB();
    const student = await Student.findById(id).populate("user");

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    // Check if student has active enrollments
    if (
      student.enrolledCourses.some(
        (enrollment: { status: string }) => enrollment.status === "ACTIVE",
      )
    ) {
      return {
        success: false,
        error: "Cannot delete student with active enrollments",
      };
    }

    // Delete both student profile and user account
    await Promise.all([
      Student.findByIdAndDelete(id),
      User.findByIdAndDelete(student.user._id),
    ]);

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();

    await Activity.create({
      type: ActivityType.ADMIN_DELETE_USER,
      status: ActivityStatus.SUCCESS,
      user: admin._id,
      targetUser: student.user._id,
      metadata: {
        studentName: student.user.name,
        studentEmail: student.user.email,
        studentStatus: student.user.status,
        enrollmentNumber: student.enrollmentNumber,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/students");

    return { success: true, message: "Student deleted successfully" };
  } catch (error: any) {
    // Log failed activity
    try {
      const admin = await checkAdminAccess({ limit: 5, windowMs: 60000 });
      const { ipAddress, userAgent } = await getRequestHeaders();

      await Activity.create({
        type: ActivityType.ADMIN_DELETE_USER,
        status: ActivityStatus.FAILURE,
        user: admin._id,
        targetUser: new mongoose.Types.ObjectId(id),
        metadata: {
          error: error.message,
        },
        ipAddress,
        userAgent,
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    return {
      success: false,
      error: error.message || "Failed to delete student",
    };
  }
}

// Update student status
export async function updateStudentStatus(id: string, status: UserStatus) {
  try {
    const admin = await checkAdminAccess({ limit: 5, windowMs: 60000 });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid student ID" };
    }

    await connectDB();
    const student = await Student.findById(id).populate("user");

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    // Update user status
    const updatedUser = await User.findByIdAndUpdate(
      student.user._id,
      { status, updatedBy: admin._id },
      { new: true },
    )
      .select(
        "-password -verificationToken -verificationTokenExpires -otp -otpExpires -refreshToken -refreshTokenExpires",
      )
      .lean();

    const updatedStudent = await Student.findById(id)
      .populate(
        "user",
        "-password -verificationToken -verificationTokenExpires -otp -otpExpires -refreshToken -refreshTokenExpires",
      )
      .lean();

    const transformedStudent = transformMongoDoc(updatedStudent);

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();

    await Activity.create({
      type: ActivityType.ADMIN_CHANGE_USER_STATUS,
      status: ActivityStatus.SUCCESS,
      user: admin._id,
      targetUser: student.user._id,
      metadata: {
        studentName: student.user.name,
        studentEmail: student.user.email,
        previousStatus: student.user.status,
        newStatus: status,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${id}`);

    return { success: true, student: transformedStudent };
  } catch (error: any) {
    // Log failed activity
    try {
      const admin = await checkAdminAccess({ limit: 5, windowMs: 60000 });
      const { ipAddress, userAgent } = await getRequestHeaders();

      await Activity.create({
        type: ActivityType.ADMIN_CHANGE_USER_STATUS,
        status: ActivityStatus.FAILURE,
        user: admin._id,
        targetUser: new mongoose.Types.ObjectId(id),
        metadata: {
          error: error.message,
          attemptedStatus: status,
        },
        ipAddress,
        userAgent,
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    return {
      success: false,
      error: error.message || "Failed to update student status",
    };
  }
}

// Add enrollment function
export async function enrollStudentInCourse(
  studentId: string,
  data: z.infer<typeof enrollmentSchema>,
) {
  try {
    const admin = await checkAdminAccess({ limit: 10, windowMs: 60000 });

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return { success: false, error: "Invalid student ID" };
    }

    await connectDB();
    const student = await Student.findById(studentId);

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    const course = await Course.findById(data.course);

    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Validate batch number
    if (data.batchNumber > course.currentBatch.batchNumber) {
      return { success: false, error: "Invalid batch number" };
    }

    // Check if already enrolled
    const existingEnrollment = student.enrolledCourses.find(
      (enrollment: Enrollment) =>
        enrollment.course.toString() === data.course &&
        enrollment.status === "ACTIVE",
    );

    if (existingEnrollment) {
      return {
        success: false,
        error: "Student is already enrolled in this course",
      };
    }

    // Add enrollment
    student.enrolledCourses.push({
      course: new mongoose.Types.ObjectId(data.course),
      batchNumber: data.batchNumber,
      enrollmentDate: new Date(),
      status: "ACTIVE",
      progress: 0,
    });

    await student.save();

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    const user = await User.findById(student.user);

    if (!user) {
      throw new Error("User not found");
    }
    await Activity.create({
      type: ActivityType.STUDENT_ENROLLMENT,
      status: ActivityStatus.SUCCESS,
      user: admin._id,
      targetUser: student.user,
      targetCourse: new mongoose.Types.ObjectId(data.course),
      metadata: {
        studentName: user.name,
        courseTitle: course.title,
        batchNumber: data.batchNumber,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${studentId}`);

    return {
      success: true,
      message: "Student enrolled successfully",
      enrollment: student.enrolledCourses[student.enrolledCourses.length - 1],
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const admin = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();

      await Activity.create({
        type: ActivityType.STUDENT_ENROLLMENT,
        status: ActivityStatus.FAILURE,
        user: admin._id,
        targetUser: new mongoose.Types.ObjectId(studentId),
        targetCourse: new mongoose.Types.ObjectId(data.course),
        metadata: {
          error: error.message,
          enrollmentData: data,
        },
        ipAddress,
        userAgent,
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    return {
      success: false,
      error: error.message || "Failed to enroll student",
    };
  }
}

// Add function to get available courses for enrollment
export async function getAvailableCourses() {
  try {
    await checkAdminAccess();
    await connectDB();

    const courses = await Course.find({
      status: "PUBLISHED",
      "currentBatch.isActive": true,
      "currentBatch.startDate": { $gte: new Date() },
    })
      .select(
        "title currentBatch.batchNumber currentBatch.maxStudents currentBatch.enrolledStudents",
      )
      .lean();

    const transformedCourses = transformMongoDoc(courses);

    return {
      success: true,
      courses: transformedCourses,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch available courses",
    };
  }
}

// Add function to update enrollment status
export async function updateEnrollmentStatus(
  studentId: string,
  courseId: string,
  status: "ACTIVE" | "COMPLETED" | "DROPPED",
) {
  try {
    const admin = await checkAdminAccess();

    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return { success: false, error: "Invalid ID" };
    }

    await connectDB();
    const student = await Student.findById(studentId);

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    const enrollment = student.enrolledCourses.find(
      (e: Enrollment) => e.course.toString() === courseId,
    );

    if (!enrollment) {
      return { success: false, error: "Enrollment not found" };
    }

    enrollment.status = status;
    await student.save();

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    const user = await User.findById(student.user);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      throw new Error("User or course not found");
    }
    await Activity.create({
      type: ActivityType.STUDENT_ENROLLMENT_UPDATE,
      status: ActivityStatus.SUCCESS,
      user: admin._id,
      targetUser: student.user,
      targetCourse: new mongoose.Types.ObjectId(courseId),
      metadata: {
        studentName: user.name,
        courseTitle: course.title,
        previousStatus: enrollment.status,
        newStatus: status,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${studentId}`);

    return { success: true, message: "Enrollment status updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update enrollment status",
    };
  }
}
