"use server";

import { cloudinaryInstance, uploadImage } from "@/lib/cloudinary";
import { cookies, headers } from "next/headers";
import { jwtVerify } from "jose";
import { UserRole } from "@/lib/types";
import { v2 as cloudinary } from "cloudinary";
import {
  Activity,
  ActivityType,
  ActivityStatus,
  ActivityTargetType,
} from "@/models/Activity";
import mongoose from "mongoose";

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

// JWT secret as Uint8Array for jose
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Helper function to check admin access
async function checkAdminAccess() {
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

    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

// Upload image to Cloudinary
export async function uploadCompanyLogo(base64Image: string) {
  try {
    const user = await checkAdminAccess();
    const { ipAddress, userAgent } = await getRequestHeaders();
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "company_logos",
    });

    // Log activity
    await Activity.create({
      type: ActivityType.FILE_UPLOAD,
      status: ActivityStatus.SUCCESS,
      user: user.id,
      targetId: new mongoose.Types.ObjectId(), // Company ID will be set when the company is created
      metadata: {
        action: "upload_company_logo",
        targetType: ActivityTargetType.FILE,
        targetId: uploadResponse.public_id,
        details: {
          format: uploadResponse.format,
          size: uploadResponse.bytes,
          url: uploadResponse.secure_url,
        },
      },
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.FILE_UPLOAD,
        status: ActivityStatus.FAILURE,
        user: user.id,
        targetId: new mongoose.Types.ObjectId(),
        metadata: {
          action: "upload_company_logo",
          targetType: ActivityTargetType.FILE,
          targetId: "unknown",
          details: { base64Image: base64Image.substring(0, 100) + "..." },
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
      error: error.message || "Failed to upload image",
    };
  }
}

// Delete image from Cloudinary
export async function deleteCompanyLogo(publicId: string) {
  try {
    const user = await checkAdminAccess();
    const { ipAddress, userAgent } = await getRequestHeaders();
    await cloudinary.uploader.destroy(publicId);

    // Log activity
    await Activity.create({
      type: ActivityType.FILE_DELETE,
      status: ActivityStatus.SUCCESS,
      user: user.id,
      targetId: new mongoose.Types.ObjectId(), // Company ID will be set when the company is updated
      metadata: {
        action: "delete_company_logo",
        targetType: ActivityTargetType.FILE,
        targetId: publicId,
        details: { publicId },
      },
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error: any) {
    // Log failed activity
    try {
      const user = await checkAdminAccess();
      const { ipAddress, userAgent } = await getRequestHeaders();
      await Activity.create({
        type: ActivityType.FILE_DELETE,
        status: ActivityStatus.FAILURE,
        user: user.id,
        targetId: new mongoose.Types.ObjectId(),
        metadata: {
          action: "delete_company_logo",
          targetType: ActivityTargetType.FILE,
          targetId: publicId,
          details: { publicId },
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
      error: error.message || "Failed to delete image",
    };
  }
}

// Extract public ID from Cloudinary URL
export async function getPublicIdFromUrl(url: string): Promise<string | null> {
  try {
    const matches = url.match(/\/v\d+\/([^/]+)\./);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
}
