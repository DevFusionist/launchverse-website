import { NextResponse } from "next/server";

import { withAuth, AuthenticatedRequest } from "@/lib/auth";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

async function handler(req: AuthenticatedRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      await connectDB();

      // Find and update user to revoke refresh token
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1, refreshTokenExpires: 1 } },
      );
    }

    // Create response
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear both tokens from cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);

    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

export const POST = withAuth(handler);
