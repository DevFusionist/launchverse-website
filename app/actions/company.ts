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
import { Company } from "@/models/Company";
import { companySchema, updateCompanySchema } from "@/lib/schemas/company";
import {
  Activity,
  ActivityType,
  ActivityStatus,
  ActivityTargetType,
} from "@/models/Activity";

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

// Create company (10 requests per minute)
export async function createCompany(data: z.infer<typeof companySchema>) {
  try {
    const user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    await connectDB();

    const company = await Company.create({
      ...data,
      createdBy: user._id,
      createdAt: new Date(),
    });

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type: ActivityType.COMPANY_CREATE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: company._id,
      metadata: {
        action: "create_company",
        targetType: ActivityTargetType.COMPANY,
        targetId: company._id.toString(),
        details: {
          name: company.name,
          website: company.website,
          contactPersonName: company.contactPersonName,
          contactPersonEmail: company.contactPersonEmail,
        },
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/companies");
    return {
      success: true,
      data: company.toObject(),
      message: "Company created successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.COMPANY_CREATE,
        status: ActivityStatus.FAILURE,
        user: user._id,
        targetId: new mongoose.Types.ObjectId(),
        metadata: {
          action: "create_company",
          targetType: ActivityTargetType.COMPANY,
          targetId: "unknown",
          details: { companyData: data },
          error: error.message,
        },
        ipAddress,
        userAgent,
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    console.error("Error creating company:", error);
    return { success: false, error: error.message };
  }
}

// Get companies with pagination and filters
export async function getCompanies({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  try {
    await checkAdminAccess();
    await connectDB();

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { contactPersonName: { $regex: search, $options: "i" } },
        { contactPersonEmail: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [companies, total] = await Promise.all([
      Company.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Company.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        companies: transformMongoDoc(companies),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return { success: false, error: error.message };
  }
}

// Get single company by ID
export async function getCompany(id: string) {
  try {
    await checkAdminAccess();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid company ID" };
    }

    await connectDB();
    const company = await Company.findById(id).lean();
    if (!company) {
      return { success: false, error: "Company not found" };
    }

    return { success: true, data: transformMongoDoc(company) };
  } catch (error: any) {
    console.error("Error fetching company:", error);
    return { success: false, error: error.message };
  }
}

// Update company
export async function updateCompany(
  id: string,
  data: Partial<z.infer<typeof updateCompanySchema>>
) {
  try {
    const user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid company ID" };
    }

    await connectDB();
    const company = await Company.findById(id);
    if (!company) {
      return { success: false, error: "Company not found" };
    }

    // Update company
    Object.assign(company, {
      ...data,
      updatedBy: user._id,
      updatedAt: new Date(),
    });
    await company.save();

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type: ActivityType.COMPANY_UPDATE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: company._id,
      metadata: {
        action: "update_company",
        targetType: ActivityTargetType.COMPANY,
        targetId: company._id.toString(),
        details: {
          name: company.name,
          website: company.website,
          contactPersonName: company.contactPersonName,
          contactPersonEmail: company.contactPersonEmail,
          changes: data,
        },
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/companies");
    return {
      success: true,
      data: company.toObject(),
      message: "Company updated successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.COMPANY_UPDATE,
        status: ActivityStatus.FAILURE,
        user: user._id,
        targetId: new mongoose.Types.ObjectId(id),
        metadata: {
          action: "update_company",
          targetType: ActivityTargetType.COMPANY,
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

    console.error("Error updating company:", error);
    return { success: false, error: error.message };
  }
}

// Delete company
export async function deleteCompany(id: string) {
  try {
    const user = await checkAdminAccess({ limit: 10, windowMs: 60000 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid company ID" };
    }

    await connectDB();
    const company = await Company.findById(id);
    if (!company) {
      return { success: false, error: "Company not found" };
    }

    // Delete company
    await company.deleteOne();

    // Log activity
    const { ipAddress, userAgent } = await getRequestHeaders();
    await Activity.create({
      type: ActivityType.COMPANY_DELETE,
      status: ActivityStatus.SUCCESS,
      user: user._id,
      targetId: company._id,
      metadata: {
        action: "delete_company",
        targetType: ActivityTargetType.COMPANY,
        targetId: company._id.toString(),
        details: {
          name: company.name,
          website: company.website,
          contactPersonName: company.contactPersonName,
          contactPersonEmail: company.contactPersonEmail,
        },
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/companies");
    return {
      success: true,
      message: "Company deleted successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.COMPANY_DELETE,
        status: ActivityStatus.FAILURE,
        user: user._id,
        targetId: new mongoose.Types.ObjectId(id),
        metadata: {
          action: "delete_company",
          targetType: ActivityTargetType.COMPANY,
          targetId: id,
          error: error.message,
        },
        ipAddress,
        userAgent,
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    console.error("Error deleting company:", error);
    return { success: false, error: error.message };
  }
}
