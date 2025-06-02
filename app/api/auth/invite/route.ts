import { NextResponse } from "next/server";

import { User } from "@/models/User";
import connectDB from "@/lib/db";
import { sendEmail, generateInvitationEmail } from "@/lib/email";
import { withRateLimitAndAuth, AuthenticatedRequest } from "@/lib/auth";
import { UserRole, UserStatus } from "@/lib/types";

// Web Crypto API utility function
async function generateRandomBytes(length: number): Promise<string> {
  const array = new Uint8Array(length);

  crypto.getRandomValues(array);

  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function inviteHandler(req: AuthenticatedRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Create pending admin user
    const admin = await User.create({
      email,
      name,
      password: await generateRandomBytes(32), // Temporary password
      role: UserRole.ADMIN,
      status: UserStatus.PENDING,
      invitedBy: req.user!.id,
    });

    // Generate verification token
    const verificationToken = await admin.generateVerificationToken();
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

    // Send invitation email
    await sendEmail({
      to: email,
      subject: "Invitation to Join LaunchVerse",
      html: generateInvitationEmail(name, verificationLink),
    });

    return NextResponse.json({
      message: "Invitation sent successfully",
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error: any) {
    console.error("Error sending invitation:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// Export the protected route handler
export const POST = withRateLimitAndAuth(
  inviteHandler,
  [UserRole.SUPER_ADMIN],
  { limit: 10, windowMs: 60000 }, // 10 requests per minute
);
