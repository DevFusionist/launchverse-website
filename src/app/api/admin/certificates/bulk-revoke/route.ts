import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  RevocationReason,
  StudentStatus,
  EnrollmentStatus,
} from '@prisma/client';
import { logActivity } from '@/lib/activity-logger';
import { z } from 'zod';

const revokeCertificatesSchema = z.object({
  certificateIds: z.array(z.string()),
  reason: z.nativeEnum(RevocationReason),
  notes: z.string().optional(),
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
    const { certificateIds, reason, notes } =
      revokeCertificatesSchema.parse(body);

    // Get all certificates with their related data
    const certificates = await prisma.certificate.findMany({
      where: {
        id: { in: certificateIds },
        status: 'ACTIVE',
      },
      include: {
        student: {
          include: {
            enrollments: {
              where: {
                studentId: { in: certificateIds.map((id) => id) }, // This will be filtered by the student relation
              },
            },
          },
        },
        course: true, // Include course data directly
      },
    });

    if (certificates.length === 0) {
      return NextResponse.json(
        { error: 'No active certificates found to revoke' },
        { status: 400 }
      );
    }

    // Process certificates sequentially instead of in parallel
    const results = [];
    for (const certificate of certificates) {
      try {
        const result = await prisma.$transaction(
          async (tx) => {
            let activeEnrollments = 0;

            if (reason !== 'ADMINISTRATIVE_ERROR') {
              // For misuse violation, update enrollment to TERMINATED_VIOLATION
              await tx.enrollment.updateMany({
                where: {
                  studentId: certificate.student.id,
                  courseId: certificate.courseId,
                },
                data: {
                  status: EnrollmentStatus.TERMINATED_VIOLATION,
                  endDate: new Date(),
                },
              });

              // Check if student has any other active enrollments
              activeEnrollments = await tx.enrollment.count({
                where: {
                  studentId: certificate.student.id,
                  status: EnrollmentStatus.ENROLLED,
                  courseId: {
                    not: certificate.courseId,
                  },
                },
              });

              // Update student status based on other enrollments
              const studentStatus =
                activeEnrollments === 0
                  ? StudentStatus.SUSPENDED_VIOLATION
                  : StudentStatus.ACTIVE;

              await tx.student.update({
                where: { id: certificate.student.id },
                data: { status: studentStatus },
              });
            } else {
              // For administrative error, keep existing logic
              await tx.enrollment.updateMany({
                where: {
                  studentId: certificate.student.id,
                  courseId: certificate.courseId,
                },
                data: {
                  status: EnrollmentStatus.ENROLLED,
                  endDate: new Date(),
                },
              });

              await tx.student.update({
                where: { id: certificate.student.id },
                data: { status: StudentStatus.ACTIVE },
              });
            }

            // Update certificate status
            const updatedCertificate = await tx.certificate.update({
              where: { id: certificate.id },
              data: {
                status: 'REVOKED',
                revokedAt: new Date(),
                revokedBy: {
                  connect: { id: session?.user?.id },
                },
                revocationReason: reason as RevocationReason,
                revocationNotes: notes,
              },
            });

            // Log the activity with revoking admin info
            await logActivity({
              action: 'REVOKE_CERTIFICATE',
              entity: 'certificate',
              entityId: certificate.id,
              details: {
                certificateId: certificate.id,
                studentId: certificate.student.id,
                courseId: certificate.courseId,
                reason,
                notes,
                revokedBy: {
                  id: session.user.id,
                  name: session.user.name,
                  email: session.user.email,
                },
                studentStatus:
                  reason === 'ADMINISTRATIVE_ERROR'
                    ? StudentStatus.ACTIVE
                    : activeEnrollments === 0
                      ? StudentStatus.SUSPENDED_VIOLATION
                      : StudentStatus.ACTIVE,
                enrollmentStatus:
                  reason === 'ADMINISTRATIVE_ERROR'
                    ? EnrollmentStatus.ENROLLED
                    : EnrollmentStatus.TERMINATED_VIOLATION,
              },
              adminId: session.user.id,
            });

            return updatedCertificate;
          },
          {
            timeout: 10000, // Increase timeout to 10 seconds
            maxWait: 15000, // Maximum time to wait for transaction to start
          }
        );
        results.push(result);
      } catch (error) {
        console.error(`Error processing certificate ${certificate.id}:`, error);
        // Continue with other certificates even if one fails
        continue;
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Failed to revoke any certificates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully revoked ${results.length} out of ${certificates.length} certificates`,
      revokedCount: results.length,
      totalCount: certificates.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error revoking certificates:', error);
    return NextResponse.json(
      { error: 'Failed to revoke certificates' },
      { status: 500 }
    );
  }
}
