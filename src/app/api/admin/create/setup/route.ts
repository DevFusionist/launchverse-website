import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { logActivity } from '@/lib/activity-logger';
import { z } from 'zod';

const setupAdminSchema = z.object({
  token: z.string(),
  otp: z.string().length(6),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = setupAdminSchema.parse(body);

    // Find the invitation
    const invitation = await prisma.adminInvitation.findUnique({
      where: { id: validatedData.token },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      );
    }

    if (invitation.used) {
      return NextResponse.json(
        { error: 'Invitation has already been used' },
        { status: 400 }
      );
    }

    if (invitation.otpExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    if (invitation.otp !== validatedData.otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 12);

    // Create admin account and mark invitation as used in a transaction
    const [admin] = await prisma.$transaction([
      // Create admin account
      prisma.admin.create({
        data: {
          email: invitation.email,
          name: invitation.name,
          password: hashedPassword,
          role: invitation.role,
        },
      }),
      // Mark invitation as used
      prisma.adminInvitation.update({
        where: { id: invitation.id },
        data: { used: true },
      }),
    ]);

    // Log the activity
    await logActivity({
      action: 'SETUP_ADMIN',
      entity: 'admin',
      entityId: admin.id,
      details: {
        email: admin.email,
        role: admin.role,
      },
      adminId: invitation.invitedById,
    });

    return NextResponse.json({ message: 'Account set up successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error setting up admin account:', error);
    return NextResponse.json(
      { error: 'Failed to set up account' },
      { status: 500 }
    );
  }
}
