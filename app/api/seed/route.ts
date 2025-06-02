import { NextResponse } from "next/server";

import { User } from "@/models/User";
import connectDB from "@/lib/db";
import { UserRole, UserStatus } from "@/lib/types";

// This is a one-time setup route that should be protected in production
export async function GET(req: Request) {
  try {
    // In production, you should add additional security checks here
    // For example, checking for a secret key in the request headers

    await connectDB();

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({
      email: "sacredwebdev@gmail.com",
    });

    if (existingSuperAdmin) {
      return NextResponse.json(
        { error: "Super admin already exists" },
        { status: 400 },
      );
    }

    // Create super admin
    const superAdmin = await User.create({
      email: "sacredwebdev@gmail.com",
      password: "Arindam@1995",
      name: "Arindam",
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true, // Super admin is pre-verified
    });

    // Remove password from response
    const { password: _, ...superAdminWithoutPassword } = superAdmin.toObject();

    return NextResponse.json({
      message: "Super admin created successfully",
      user: superAdminWithoutPassword,
    });
  } catch (error: any) {
    console.error("Error creating super admin:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
