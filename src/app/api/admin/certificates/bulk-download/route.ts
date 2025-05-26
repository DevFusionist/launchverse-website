import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity-logger';
import JSZip from 'jszip';
import { generateCertificatePDF } from '@/lib/certificate-generator';
import { z } from 'zod';

const downloadCertificatesSchema = z.object({
  certificateIds: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { certificateIds } = downloadCertificatesSchema.parse(body);

    // Get all certificates with their related data
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

    if (certificates.length === 0) {
      return NextResponse.json(
        { error: 'No certificates found to download' },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    // Generate PDFs for each certificate
    for (const certificate of certificates) {
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
      const fileName = `certificate-${certificate.code}${certificate.status === 'REVOKED' ? '-REVOKED' : ''}.pdf`;
      zip.file(fileName, pdfBuffer);
    }

    // Add a manifest file with certificate details
    const manifest = certificates.map((cert) => ({
      code: cert.code,
      studentName: cert.student.name,
      courseTitle: cert.course.title,
      status: cert.status,
      issuedAt: cert.issuedAt,
      revokedAt: cert.revokedAt,
      revocationReason: cert.revocationReason,
      revocationNotes: cert.revocationNotes,
    }));

    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Log the download activity
    await logActivity({
      action: 'BULK_DOWNLOAD_CERTIFICATES',
      entity: 'certificate',
      entityId: certificateIds.join(','),
      details: {
        count: certificates.length,
        revokedCount: certificates.filter((c) => c.status === 'REVOKED').length,
      },
      adminId: session.user.id,
    });

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="certificates.zip"',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error downloading certificates:', error);
    return NextResponse.json(
      { error: 'Failed to download certificates' },
      { status: 500 }
    );
  }
}
