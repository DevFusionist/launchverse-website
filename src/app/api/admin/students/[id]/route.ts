import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StudentStatus } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const updateStudentSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED']).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            certificates: true,
            placements: true,
          },
        },
        enrollments: {
          include: {
            course: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        certificates: {
          include: {
            course: true,
            issuedBy: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { issuedAt: 'desc' },
        },
        placements: {
          include: {
            company: true,
            createdBy: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Error fetching student:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch student' }),
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
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
    const validatedData = updateStudentSchema.parse(body);

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Prevent changing status if student is not active
    if (existingStudent.status !== 'ACTIVE' && validatedData.status) {
      return NextResponse.json(
        { error: 'Can only change status of active students' },
        { status: 400 }
      );
    }

    // If email is being updated, check if it's already taken
    if (validatedData.email && validatedData.email !== existingStudent.email) {
      const emailExists = await prisma.student.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Hash password if provided
    const hashedPassword = validatedData.password
      ? await hash(validatedData.password, 12)
      : undefined;

    // Update student
    const updatedStudent = await prisma.$transaction(async (tx) => {
      // If status is being updated, handle enrollment changes
      if (
        validatedData.status &&
        validatedData.status !== existingStudent.status
      ) {
        if (validatedData.status === 'INACTIVE') {
          // Update all non-completed enrollments to CANCELLED
          await tx.enrollment.updateMany({
            where: {
              studentId: params.id,
              status: {
                not: 'COMPLETED',
              },
            },
            data: {
              status: 'CANCELLED',
              endDate: new Date(),
            },
          });
        } else if (validatedData.status === 'GRADUATED') {
          // Check if all enrollments are completed
          const enrollments = await tx.enrollment.findMany({
            where: { studentId: params.id },
          });

          const allCompleted = enrollments.every(
            (e) => e.status === 'COMPLETED'
          );
          if (!allCompleted) {
            throw new Error(
              'Cannot mark student as graduated with incomplete enrollments'
            );
          }
        }
      }

      // Update student
      const updatedStudent = await tx.student.update({
        where: { id: params.id },
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          password: hashedPassword,
          status: validatedData.status,
        },
      });

      // Log the activity
      await tx.activityLog.create({
        data: {
          action: 'UPDATE',
          entity: 'student',
          entityId: params.id,
          details: JSON.stringify({
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            status: validatedData.status,
            passwordChanged: !!validatedData.password,
            enrollmentStatus:
              validatedData.status === 'INACTIVE' ? 'CANCELLED' : undefined,
          }),
          adminId: session.user.id,
        },
      });

      return updatedStudent;
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return new NextResponse('Only super admin can delete students', {
        status: 403,
      });
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            certificates: true,
            placements: true,
          },
        },
      },
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    // Check if student has any related records
    if (
      student._count.enrollments > 0 ||
      student._count.certificates > 0 ||
      student._count.placements > 0
    ) {
      return new NextResponse(
        JSON.stringify({
          error: 'Cannot delete student with related records',
        }),
        { status: 400 }
      );
    }

    // Delete student
    await prisma.student.delete({
      where: { id: params.id },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entity: 'student',
        entityId: params.id,
        details: JSON.stringify({ name: student.name, email: student.email }),
        adminId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting student:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete student' }),
      { status: 500 }
    );
  }
}
