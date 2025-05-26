import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EnrollmentStatus, StudentStatus } from '@prisma/client';
import { z } from 'zod';
import { logActivity } from '@/lib/activity-logger';

const createEnrollmentSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  startDate: z.string().optional(), // ISO date string
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
    const validatedData = createEnrollmentSchema.parse(body);

    // Check if student exists and is active
    const student = await prisma.student.findUnique({
      where: { id: validatedData.studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // if (student.status === 'GRADUATED') {
    //   return NextResponse.json(
    //     { error: 'Cannot enroll a graduated student' },
    //     { status: 400 }
    //   );
    // }

    // Check if course exists and is active
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Cannot enroll in an inactive course' },
        { status: 400 }
      );
    }

    // Check if student is already enrolled in this course
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: validatedData.studentId,
        courseId: validatedData.courseId,
        status: {
          not: 'CANCELLED',
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Student is already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment in a transaction
    const enrollment = await prisma.$transaction(async (tx) => {
      // Create enrollment
      const newEnrollment = await tx.enrollment.create({
        data: {
          studentId: validatedData.studentId,
          courseId: validatedData.courseId,
          startDate: validatedData.startDate
            ? new Date(validatedData.startDate)
            : new Date(),
          status: 'ENROLLED',
        },
        include: {
          student: true,
          course: true,
        },
      });

      // Update student status to ACTIVE if not already
      if (student.status !== 'ACTIVE') {
        await tx.student.update({
          where: { id: validatedData.studentId },
          data: { status: 'ACTIVE' },
        });
      }

      // Log the activity
      await logActivity({
        action: 'CREATE_ENROLLMENT',
        entity: 'enrollment',
        entityId: newEnrollment.id,
        adminId: session.user.id,
        details: {
          enrollmentId: newEnrollment.id,
          studentId: newEnrollment.studentId,
          courseId: newEnrollment.courseId,
          studentName: newEnrollment.student.name,
          courseName: newEnrollment.course.title,
          startDate: newEnrollment.startDate,
        },
      });

      return newEnrollment;
    });

    return NextResponse.json({ enrollment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to create enrollment' },
      { status: 500 }
    );
  }
}
