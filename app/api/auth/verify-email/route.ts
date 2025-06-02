import { NextResponse } from "next/server";

import { User } from "@/models/User";
import connectDB from "@/lib/db";
import { sendEmail, generateOTPEmail } from "@/lib/email";
import { UserStatus } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    // Find user by verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    // Update user
    user.password = password;
    user.isEmailVerified = true;
    user.status = UserStatus.ACTIVE;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    // Generate OTP for additional verification
    const otp = await user.generateOTP();

    await user.save();

    // Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Your LaunchVerse Verification Code",
      html: generateOTPEmail(user.name, otp),
    });

    return NextResponse.json({
      message:
        "Email verified successfully. Please check your email for the OTP.",
      userId: user._id,
    });
  } catch (error: any) {
    console.error("Error verifying email:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
