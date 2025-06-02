import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import mongoose from "mongoose";

import { User } from "@/models/User";
import connectDB from "@/lib/db";

// JWT secret as Uint8Array for jose
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { userId, otp } = await req.json();

    if (!userId || !otp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    // Find user and verify OTP
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
      otp,
      otpExpires: { $gt: Date.now() },
    });

    console.log("Database query result:", {
      userFound: !!user,
      userOtp: user?.otp,
      userOtpExpires: user?.otpExpires,
      userOtpType: typeof user?.otp,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token using jose
    const token = await new SignJWT({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      type: "access" as const,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(ACCESS_TOKEN_SECRET);

    const refreshToken = await user.generateRefreshToken();

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: "OTP verified successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Error verifying OTP:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
