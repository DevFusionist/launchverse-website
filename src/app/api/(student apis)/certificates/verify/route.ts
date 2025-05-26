import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity-logger';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Certificate code is required' },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { code },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
            description: true,
          },
        },
        issuedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Log verification attempt
    await logActivity({
      action: 'VERIFY_CERTIFICATE',
      entity: 'certificate',
      entityId: certificate.id,
      details: {
        code,
        status: certificate.status,
        verifiedAt: new Date().toISOString(),
      },
      adminId: 'system', // System-generated activity
    });

    if (certificate.status === 'REVOKED') {
      return NextResponse.json({
        isValid: false,
        message: 'This certificate has been revoked',
        certificate: {
          code: certificate.code,
          studentName: certificate.student.name,
          courseTitle: certificate.course.title,
          issuedAt: certificate.issuedAt,
          revokedAt: certificate.revokedAt,
          status: certificate.status,
        },
      });
    }

    return NextResponse.json({
      isValid: true,
      message: 'Certificate is valid',
      certificate: {
        code: certificate.code,
        studentName: certificate.student.name,
        courseTitle: certificate.course.title,
        courseDescription: certificate.course.description,
        issuedAt: certificate.issuedAt,
        issuedBy: certificate.issuedBy.name,
        status: certificate.status,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    );
  }
}
