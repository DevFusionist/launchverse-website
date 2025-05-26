import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity-logger';
import JSZip from 'jszip';
import { generateCertificatePDF } from '@/lib/certificate-generator';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const certificates = await prisma.certificate.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        issuedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, certificateIds } = await request.json();

    if (!action || !certificateIds || !Array.isArray(certificateIds)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'bulk-revoke': {
        const certificates = await prisma.certificate.updateMany({
          where: {
            id: { in: certificateIds },
            status: 'ACTIVE',
          },
          data: {
            status: 'REVOKED',
            revokedAt: new Date(),
          },
        });

        await logActivity({
          action: 'BULK_REVOKE_CERTIFICATES',
          entity: 'certificate',
          entityId: certificateIds.join(','),
          details: {
            count: certificates.count,
            message: `Revoked ${certificates.count} certificates`,
          },
          adminId: session.user.id,
        });

        return NextResponse.json({
          message: `Successfully revoked ${certificates.count} certificates`,
        });
      }

      case 'bulk-download': {
        const certificates = await prisma.certificate.findMany({
          where: {
            id: { in: certificateIds },
          },
          include: {
            student: true,
            course: true,
            issuedBy: true,
          },
        });

        const zip = new JSZip();

        // Generate PDFs for each certificate
        for (const certificate of certificates) {
          const pdfBuffer = await generateCertificatePDF(certificate);
          zip.file(`certificate-${certificate.code}.pdf`, pdfBuffer);
        }

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        return new NextResponse(zipBuffer, {
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="certificates.zip"',
          },
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing bulk certificate operation:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk operation' },
      { status: 500 }
    );
  }
}
