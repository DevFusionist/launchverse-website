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
import {
  Activity,
  ActivityType,
  ActivityStatus,
  ActivityTargetType,
} from "@/models/Activity";
import {
  generateUniqueCertificateCode,
  generateCertificateQRCode,
  validateCertificateCode,
  formatCertificateCode,
} from "@/lib/certificate";
import { Certificate } from "@/models/Certificate";

// Certificate schema for validation
const certificateSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  certificateCode: z.string().refine(validateCertificateCode, {
    message: "Invalid certificate code format",
  }),
  qrCode: z.string().url(),
  status: z.enum(["ACTIVE", "REVOKED", "EXPIRED"]).default("ACTIVE"),
  metadata: z.record(z.unknown()).optional(),
});

// Update certificate schema
const updateCertificateSchema = certificateSchema.partial().omit({
  certificateCode: true,
  qrCode: true,
});

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

// Create certificate
export async function createCertificate(
  data: z.infer<typeof certificateSchema>
) {
  let user;
  try {
    user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    await connectDB();

    // Generate certificate code and QR code
    const certificateCode = generateUniqueCertificateCode();
    const verifyUrl =
      process.env.NEXT_PUBLIC_VERIFY_URL || "https://launchverse.academy";
    const qrCode = await generateCertificateQRCode(certificateCode, verifyUrl);

    // Create certificate with generated codes
    const certificate = await Certificate.create({
      ...data,
      certificateCode: formatCertificateCode(certificateCode),
      qrCode,
      issuedBy: user._id,
      createdAt: new Date(),
    });

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type: ActivityType.CERTIFICATE_ISSUE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: certificate._id,
      metadata: {
        action: "create_certificate",
        targetType: ActivityTargetType.CERTIFICATE,
        targetId: certificate._id.toString(),
        details: {
          certificateCode: certificate.certificateCode,
          studentId: data.studentId,
          courseId: data.courseId,
        },
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/certificates");
    return {
      success: true,
      data: transformMongoDoc(certificate),
      message: "Certificate created successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      if (!user) {
        user = await checkAdminAccess();
      }
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.CERTIFICATE_ISSUE,
        status: ActivityStatus.FAILURE,
        user: user._id,
        targetId: new mongoose.Types.ObjectId(),
        metadata: {
          action: "create_certificate",
          targetType: ActivityTargetType.CERTIFICATE,
          targetId: "unknown",
          details: { certificateData: data },
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
      error: error.message || "Failed to create certificate",
    };
  }
}

// Get certificate by code
export async function getCertificateByCode(code: string) {
  try {
    await connectDB();
    const certificate = await Certificate.findOne({
      certificateCode: formatCertificateCode(code),
    })
      .populate("studentId", "name email")
      .populate("courseId", "title")
      .populate("issuedBy", "name")
      .lean();

    if (!certificate) {
      return {
        success: false,
        error: "Certificate not found",
      };
    }

    return {
      success: true,
      data: transformMongoDoc(certificate),
      message: "Certificate found",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch certificate",
    };
  }
}

// Get certificate by ID
export async function getCertificate(id: string) {
  try {
    await checkAdminAccess();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid certificate ID" };
    }

    await connectDB();
    const certificate = await Certificate.findById(id)
      .populate("studentId", "name email")
      .populate("courseId", "title")
      .lean();

    if (!certificate) {
      return { success: false, error: "Certificate not found" };
    }

    return { success: true, data: transformMongoDoc(certificate) };
  } catch (error: any) {
    console.error("Error in getCertificate:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch certificate",
    };
  }
}

// Update certificate status
export async function updateCertificateStatus(
  certificateId: string,
  status: "ACTIVE" | "REVOKED" | "EXPIRED"
) {
  try {
    const user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    if (!mongoose.Types.ObjectId.isValid(certificateId)) {
      return { success: false, error: "Invalid certificate ID" };
    }

    await connectDB();
    const certificate = await Certificate.findById(certificateId);
    if (!certificate) {
      return { success: false, error: "Certificate not found" };
    }

    // Update status
    certificate.status = status;
    certificate.updatedBy = user._id;
    certificate.updatedAt = new Date();
    await certificate.save();

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type: ActivityType.CERTIFICATE_UPDATE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: certificate._id,
      metadata: {
        action: "update_certificate_status",
        targetType: ActivityTargetType.CERTIFICATE,
        targetId: certificate._id.toString(),
        details: {
          certificateCode: certificate.certificateCode,
          previousStatus: certificate.status,
          newStatus: status,
        },
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/certificates");
    return {
      success: true,
      data: transformMongoDoc(certificate),
      message: "Certificate status updated successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.CERTIFICATE_UPDATE,
        status: ActivityStatus.FAILURE,
        user: user._id,
        targetId: new mongoose.Types.ObjectId(certificateId),
        metadata: {
          action: "update_certificate_status",
          targetType: ActivityTargetType.CERTIFICATE,
          targetId: certificateId,
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
      error: error.message || "Failed to update certificate status",
    };
  }
}

// Get all certificates (with pagination)
export async function getCertificates(page: number = 1, limit: number = 10) {
  try {
    await checkAdminAccess();
    await connectDB();

    const skip = (page - 1) * limit;
    const [certificates, total] = await Promise.all([
      Certificate.find()
        .populate("studentId", "name email")
        .populate("courseId", "title")
        .populate("issuedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Certificate.countDocuments(),
    ]);

    return {
      success: true,
      data: transformMongoDoc(certificates),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch certificates",
    };
  }
}

// Delete certificate
export async function deleteCertificate(id: string) {
  try {
    const user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid certificate ID" };
    }

    await connectDB();
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return { success: false, error: "Certificate not found" };
    }

    await certificate.deleteOne();

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type: ActivityType.CERTIFICATE_UPDATE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: certificate._id,
      metadata: {
        action: "delete_certificate",
        targetType: ActivityTargetType.CERTIFICATE,
        targetId: certificate._id.toString(),
        details: {
          certificateCode: certificate.certificateCode,
          action: "deleted",
        },
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/certificates");
    return {
      success: true,
      message: "Certificate deleted successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.CERTIFICATE_UPDATE,
        status: ActivityStatus.FAILURE,
        user: user._id,
        targetId: new mongoose.Types.ObjectId(id),
        metadata: {
          action: "delete_certificate",
          targetType: ActivityTargetType.CERTIFICATE,
          targetId: id,
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
      error: error.message || "Failed to delete certificate",
    };
  }
}

export async function updateCertificate(
  id: string,
  data: {
    studentId: string;
    courseId: string;
    issueDate: string;
    expiryDate?: string;
    status: "ACTIVE" | "REVOKED" | "EXPIRED";
  }
) {
  try {
    const user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid certificate ID" };
    }

    await connectDB();
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return { success: false, error: "Certificate not found" };
    }

    // Update certificate fields
    certificate.studentId = data.studentId;
    certificate.courseId = data.courseId;
    certificate.issueDate = new Date(data.issueDate);
    certificate.expiryDate = data.expiryDate
      ? new Date(data.expiryDate)
      : undefined;
    certificate.status = data.status;

    await certificate.save();

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type: ActivityType.CERTIFICATE_UPDATE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: certificate._id,
      metadata: {
        action: "update_certificate",
        targetType: ActivityTargetType.CERTIFICATE,
        targetId: certificate._id.toString(),
        details: {
          certificateCode: certificate.certificateCode,
          changes: data,
        },
      },
      ipAddress,
      userAgent,
    });

    return { success: true, data: transformMongoDoc(certificate) };
  } catch (error: any) {
    console.error("Error in updateCertificate:", error);
    return {
      success: false,
      error: error.message || "Failed to update certificate",
    };
  }
}
