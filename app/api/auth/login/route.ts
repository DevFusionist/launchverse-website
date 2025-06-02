import { NextResponse } from "next/server";

import { User } from "@/models/User";
import { generateTokens } from "@/lib/auth";
import connectDB from "@/lib/db";
import { rateLimiter } from "@/lib/auth";

async function handler(req: Request) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimiter(req as any);

    if (rateLimitResult) return rateLimitResult;

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Find user and include password field
    const user = await User.findByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if 2FA is required
    if (!user.isEmailVerified) {
      // Generate OTP
      const otp = await user.generateOTP();

      // TODO: Send OTP via email
      console.log("OTP for development:", otp);

      return NextResponse.json({
        requiresOTP: true,
        userId: user._id.toString(),
      });
    }

    // Generate access token
    const { accessToken } = await generateTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Generate refresh token
    const refreshToken = await user.generateRefreshToken();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });

    // Set tokens in cookies
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60, // 15 minutes
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export const POST = handler;
