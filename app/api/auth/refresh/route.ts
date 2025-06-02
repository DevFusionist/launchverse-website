import { NextResponse } from "next/server";

import { withAuth, AuthenticatedRequest } from "@/lib/auth";
import { User } from "@/models/User";
import { generateTokens } from "@/lib/auth";
import connectDB from "@/lib/db";

async function handler(req: AuthenticatedRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: 401 },
      );
    }

    await connectDB();

    // Find user with valid refresh token
    const user = await User.findOne({
      refreshToken,
      refreshTokenExpires: { $gt: new Date() },
      status: "ACTIVE",
    });

    console.log("user", user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
    }

    // Generate new access token
    const { accessToken } = await generateTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Generate new refresh token
    console.log("Generating new refresh token from refresh route");
    const newRefreshToken = await user.generateRefreshToken();

    // Create response with new tokens
    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });

    // Set new tokens in cookies
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Refresh token error:", error);

    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 },
    );
  }
}

export const POST = withAuth(handler);
