import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AdminRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { logActivity } from '@/lib/activity-logger';
import { z } from 'zod';

// Schema for inviting new admins
// Note: SUPER_ADMIN role cannot be invited - it must be created directly in the database
// for security reasons
const inviteAdminSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.literal('ADMIN'),
});

export async function POST(req: Request) {
  try {
    // Check if the request is from an authenticated super admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== AdminRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = inviteAdminSchema.parse(body);

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: validatedData.email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Create admin invitation
    const adminInvitation = await prisma.adminInvitation.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        role: validatedData.role,
        otp,
        otpExpiry,
        invitedBy: {
          connect: { id: session.user.id },
        },
      },
    });

    // Send invitation email with OTP
    const emailHtml = `
      <h1>Welcome to Launch Verse Admin Panel</h1>
      <p>Dear ${validatedData.name},</p>
      <p>You have been invited to join the Launch Verse Admin Panel as a ${validatedData.role.toLowerCase()}.</p>
      <p>To complete your registration, please use the following OTP:</p>
      <h2 style="font-size: 24px; letter-spacing: 4px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px;">${otp}</h2>
      <p>This OTP will expire in 24 hours.</p>
      <p>Click the button below to set up your account:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/setup?token=${adminInvitation.id}" 
         style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Set Up Account
      </a>
      <p>If you did not request this invitation, please ignore this email.</p>
      <p>Best regards,<br>Launch Verse Team</p>
    `;

    await sendEmail({
      to: validatedData.email,
      subject: 'Invitation to Launch Verse Admin Panel',
      text: `Welcome to Launch Verse Admin Panel! You have been invited as a ${validatedData.role.toLowerCase()}. Your OTP is: ${otp}. This OTP will expire in 24 hours. Visit ${process.env.NEXT_PUBLIC_APP_URL}/admin/setup?token=${adminInvitation.id} to set up your account.`,
      html: emailHtml,
    });

    // Log the activity
    await logActivity({
      action: 'INVITE_ADMIN',
      entity: 'admin',
      entityId: adminInvitation.id,
      details: {
        email: validatedData.email,
        role: validatedData.role,
      },
      adminId: session.user.id,
    });

    return NextResponse.json({ message: 'Invitation sent successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error sending admin invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
