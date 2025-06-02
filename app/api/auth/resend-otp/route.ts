import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generateOTP } from "@/lib/utils";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Find the user
    const user = await User.findById(userId).select("email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        otp,
        otpExpires,
      },
      { new: true },
    );

    // Send email with new OTP
    await sendEmail({
      to: user.email,
      subject: "Your New Verification Code - LaunchVerse",
      html: `
        <h1>New Verification Code</h1>
        <p>Your new verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ message: "OTP resent successfully" });
  } catch (error: any) {
    console.error("Resend OTP error:", error);

    return NextResponse.json(
      { error: "Failed to resend OTP" },
      { status: 500 },
    );
  }
}
