import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EnrollmentStatus, StudentStatus } from '@prisma/client';
import { z } from 'zod';
import { logActivity } from '@/lib/activity-logger';

const updateEnrollmentSchema = z.object({
  status: z.enum(['ENROLLED', 'COMPLETED', 'CANCELLED'] as const),
  endDate: z.string().optional(), // ISO date string
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateEnrollmentSchema.parse(body);

    // Get the current enrollment with related data
    const currentEnrollment = await prisma.enrollment.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        course: true,
      },
    });

    if (!currentEnrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Validate status transition - only allow changes if enrollment is ENROLLED
    if (currentEnrollment.status !== 'ENROLLED') {
      return NextResponse.json(
        { error: 'Can only change status of enrolled enrollments' },
        { status: 400 }
      );
    }

    // Update the enrollment
    const updatedEnrollment = await prisma.$transaction(async (tx) => {
      // Update enrollment
      const updatedEnrollment = await tx.enrollment.update({
        where: { id: params.id },
        data: {
          status: validatedData.status as EnrollmentStatus,
          endDate: validatedData.endDate
            ? new Date(validatedData.endDate)
            : undefined,
        },
        include: {
          student: true,
          course: true,
        },
      });

      // Handle student status changes based on enrollment status
      if (validatedData.status !== currentEnrollment.status) {
        if (validatedData.status === 'CANCELLED') {
          // Check if student has any other active enrollments
          const activeEnrollments = await tx.enrollment.count({
            where: {
              studentId: currentEnrollment.studentId,
              status: 'ENROLLED',
            },
          });

          // If no active enrollments, mark student as inactive
          if (activeEnrollments === 0) {
            await tx.student.update({
              where: { id: currentEnrollment.studentId },
              data: { status: 'INACTIVE' },
            });
          }
        } else if (validatedData.status === 'COMPLETED') {
          // Check if all enrollments are completed
          const allEnrollments = await tx.enrollment.findMany({
            where: { studentId: currentEnrollment.studentId },
          });

          const allCompleted = allEnrollments.every(
            (e) => e.status === 'COMPLETED'
          );

          // If all enrollments are completed, mark student as graduated
          if (allCompleted) {
            await tx.student.update({
              where: { id: currentEnrollment.studentId },
              data: { status: 'GRADUATED' },
            });
          }
        } else if (validatedData.status === 'ENROLLED') {
          // If enrollment is being marked as enrolled, ensure student is active
          await tx.student.update({
            where: { id: currentEnrollment.studentId },
            data: { status: 'ACTIVE' },
          });
        }
      }

      // Log the activity
      await logActivity({
        action: 'UPDATE_ENROLLMENT',
        entity: 'enrollment',
        entityId: params.id,
        adminId: session.user.id,
        details: {
          enrollmentId: updatedEnrollment.id,
          studentId: updatedEnrollment.studentId,
          courseId: updatedEnrollment.courseId,
          oldStatus: currentEnrollment.status,
          newStatus: updatedEnrollment.status,
          studentName: currentEnrollment.student.name,
          courseName: currentEnrollment.course.title,
          studentStatus: updatedEnrollment.student.status,
        },
      });

      return updatedEnrollment;
    });

    return NextResponse.json({ enrollment: updatedEnrollment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}
