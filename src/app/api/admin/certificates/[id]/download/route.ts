import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity-logger';
import { generateCertificatePDF } from '@/lib/certificate-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const certificate = await prisma.certificate.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        course: true,
        issuedBy: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Add revocation status to the certificate data
    const certificateData = {
      ...certificate,
      isRevoked: certificate.status === 'REVOKED',
      revocationInfo:
        certificate.status === 'REVOKED'
          ? {
              reason: certificate.revocationReason,
              notes: certificate.revocationNotes,
              revokedAt: certificate.revokedAt,
            }
          : null,
    };

    const pdfBuffer = await generateCertificatePDF(certificateData);

    // Log the download activity
    await logActivity({
      action: 'DOWNLOAD_CERTIFICATE',
      entity: 'certificate',
      entityId: certificate.id,
      details: {
        certificateId: certificate.id,
        studentId: certificate.student.id,
        courseId: certificate.courseId,
        status: certificate.status,
        certificateCode: certificate.code,
      },
      adminId: session.user.id,
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificate.code}${
          certificate.status === 'REVOKED' ? '-REVOKED' : ''
        }.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error downloading certificate:', error);
    return NextResponse.json(
      { error: 'Failed to download certificate' },
      { status: 500 }
    );
  }
}
