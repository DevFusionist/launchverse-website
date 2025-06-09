"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { headers } from "next/headers";

import { User } from "@/models/User";
import connectDB from "@/lib/db";
import { UserRole } from "@/lib/types";
import { Course, CourseStatus, CourseLevel } from "@/models/Course";
import { courseSchema, updateCourseSchema } from "@/lib/schemas/course";
import {
  Activity,
  ActivityType,
  ActivityStatus,
  ActivityTargetType,
} from "@/models/Activity";

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

// JWT secret as Uint8Array for jose
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

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
      status: "ACTIVE",
    });

    if (!user) {
      throw new Error("User not found or inactive");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
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

// Create course (10 requests per minute)
export async function createCourse(data: z.infer<typeof courseSchema>) {
  try {
    const user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    await connectDB();

    const course = await Course.create({
      ...data,
      createdBy: user._id,
      createdAt: new Date(),
    });

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type: ActivityType.COURSE_CREATE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: course._id,
      metadata: {
        action: "create_course",
        targetType: ActivityTargetType.COURSE,
        targetId: course._id.toString(),
        details: {
          title: course.title,
          level: course.level,
          status: course.status,
          batchType: course.batchType,
        },
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/courses");
    return {
      success: true,
      data: course.toObject(),
      message: "Course created successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.COURSE_CREATE,
        status: ActivityStatus.FAILURE,
        user: user._id,
        targetId: new mongoose.Types.ObjectId(),
        metadata: {
          action: "create_course",
          targetType: ActivityTargetType.COURSE,
          targetId: "unknown",
          details: { courseData: data },
          error: error.message,
        },
        ipAddress,
        userAgent,
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    if (error.message === "Too many requests, please try again later") {
      return { success: false, error: error.message, status: 429 };
    }
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }
    console.error("Course creation error:", error); // Add error logging

    return {
      success: false,
      error: error.message || "Failed to create course",
    };
  }
}

// Get courses with filters and pagination
// Get courses with filters and pagination
export async function getCourses({
  page = 1,
  limit = 10,
  status,
  level,
  category,
  search,
}: {
  page?: number;
  limit?: number;
  status?: CourseStatus;
  level?: CourseLevel;
  category?: string;
  search?: string;
}) {
  try {
    await checkAdminAccess();
    await connectDB();
    const query: any = {};

    if (status) query.status = status;
    if (level) query.level = level;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      Course.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Course.countDocuments(query),
    ]);

    // Use the transformMongoDoc helper to properly transform all MongoDB objects
    const transformedCourses = transformMongoDoc(courses);

    return {
      success: true,
      courses: transformedCourses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      message: "Courses fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch courses",
    };
  }
}

// Get single course
export async function getCourse(id: string) {
  try {
    await checkAdminAccess();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid course ID" };
    }

    await connectDB();
    const course = await Course.findById(id).lean();

    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Use the transformMongoDoc helper to properly transform all MongoDB objects
    const transformedCourse = transformMongoDoc(course);

    return {
      success: true,
      course: transformedCourse,
      message: "Course fetched successfully",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch course" };
  }
}

// Update course
export async function updateCourse(
  id: string,
  data: Partial<z.infer<typeof updateCourseSchema>>
) {
  try {
    const user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    await connectDB();

    const course = await Course.findById(id);
    if (!course) {
      return {
        success: false,
        error: "Course not found",
      };
    }

    // Update course
    Object.assign(course, {
      ...data,
      updatedBy: user._id,
      updatedAt: new Date(),
    });
    await course.save();

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type: ActivityType.COURSE_UPDATE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: course._id,
      metadata: {
        action: "update_course",
        targetType: ActivityTargetType.COURSE,
        targetId: course._id.toString(),
        details: {
          title: course.title,
          level: course.level,
          status: course.status,
          batchType: course.batchType,
          changes: data,
        },
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/courses");
    return {
      success: true,
      data: course.toObject(),
      message: "Course updated successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.COURSE_UPDATE,
        status: ActivityStatus.FAILURE,
        user: user._id,
        targetId: new mongoose.Types.ObjectId(id),
        metadata: {
          action: "update_course",
          targetType: ActivityTargetType.COURSE,
          targetId: id,
          details: { updateData: data },
          error: error.message,
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
      error: error.message || "Failed to update course",
    };
  }
}

// Delete course
export async function deleteCourse(id: string) {
  try {
    const user = await checkAdminAccess();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid course ID" };
    }

    await connectDB();
    const course = await Course.findById(id);

    if (!course) {
      return { success: false, error: "Course not found" };
    }

    if (course.enrolledStudents > 0) {
      return {
        success: false,
        error: "Cannot delete course with enrolled students",
      };
    }

    await Course.findByIdAndDelete(id);

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();

    await Activity.create({
      type: ActivityType.COURSE_DELETE,
      status: ActivityStatus.SUCCESS,
      user: user.id,
      targetCourse: new mongoose.Types.ObjectId(id),
      metadata: {
        courseTitle: course.title,
        courseStatus: course.status,
        enrolledStudents: course.enrolledStudents,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/courses");

    return { success: true, message: "Course deleted successfully" };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();

      await Activity.create({
        type: ActivityType.COURSE_DELETE,
        status: ActivityStatus.FAILURE,
        user: user.id,
        targetCourse: new mongoose.Types.ObjectId(id),
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
      error: error.message || "Failed to delete course",
    };
  }
}

// Update course status
export async function updateCourseStatus(id: string, status: CourseStatus) {
  try {
    const user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    await connectDB();

    const course = await Course.findById(id);
    if (!course) {
      return {
        success: false,
        error: "Course not found",
      };
    }

    // Update status
    course.status = status;
    course.updatedBy = user._id;
    course.updatedAt = new Date();
    await course.save();

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type:
        status === CourseStatus.PUBLISHED
          ? ActivityType.COURSE_PUBLISH
          : status === CourseStatus.ARCHIVED
            ? ActivityType.COURSE_ARCHIVE
            : ActivityType.COURSE_UPDATE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: course._id,
      metadata: {
        action: "update_course_status",
        targetType: ActivityTargetType.COURSE,
        targetId: course._id.toString(),
        details: {
          title: course.title,
          previousStatus: course.status,
          newStatus: status,
        },
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/courses");
    return {
      success: true,
      data: course.toObject(),
      message: "Course status updated successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type:
          status === CourseStatus.PUBLISHED
            ? ActivityType.COURSE_PUBLISH
            : status === CourseStatus.ARCHIVED
              ? ActivityType.COURSE_ARCHIVE
              : ActivityType.COURSE_UPDATE,
        status: ActivityStatus.FAILURE,
        user: user._id,
        targetId: new mongoose.Types.ObjectId(id),
        metadata: {
          action: "update_course_status",
          targetType: ActivityTargetType.COURSE,
          targetId: id,
          details: { attemptedStatus: status },
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
      error: error.message || "Failed to update course status",
    };
  }
}

// Get active batches (public)
export async function getActiveBatches({
  category,
  level,
  city,
}: {
  category?: string;
  level?: CourseLevel;
  city?: string;
} = {}) {
  try {
    await connectDB();

    const query: any = {
      status: CourseStatus.PUBLISHED,
      "currentBatch.isActive": true,
      "currentBatch.startDate": { $gte: new Date() },
    };

    if (category) query.category = category;
    if (level) query.level = level;
    if (city) query["location.city"] = city;

    const courses = await Course.find(query)
      .select(
        "title slug shortDescription price duration level category thumbnail schedule location currentBatch"
      )
      .sort({ "currentBatch.startDate": 1 })
      .lean();

    // Use the transformMongoDoc helper to ensure all MongoDB types are properly converted
    const transformedCourses = transformMongoDoc(courses);

    return {
      success: true,
      courses: transformedCourses,
    };
  } catch (error: any) {
    console.error("Error in getActiveBatches:", error); // Add error logging

    return {
      success: false,
      error: error.message || "Failed to fetch active batches",
    };
  }
}
