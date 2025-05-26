import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Missing invitation token' },
        { status: 400 }
      );
    }

    // Find the invitation
    const invitation = await prisma.adminInvitation.findUnique({
      where: { id: token },
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

    // Return invitation details (excluding sensitive data)
    return NextResponse.json({
      invitation: {
        name: invitation.name,
        email: invitation.email,
        role: invitation.role,
      },
    });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return NextResponse.json(
      { error: 'Failed to verify invitation' },
      { status: 500 }
    );
  }
}
