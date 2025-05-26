import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CourseStatus } from '@prisma/client';

export async function GET(
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

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        certificates: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            issuedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { issuedAt: 'desc' },
        },
        _count: {
          select: {
            enrollments: true,
            certificates: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

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

    const data = await request.json();

    // Get current course data for activity log
    const currentCourse = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!currentCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // If status is being changed to INACTIVE, check for active enrollments first
    if (data.status === 'INACTIVE' && currentCourse.status !== 'INACTIVE') {
      console.log(
        'Checking for active enrollments before deactivating course:',
        params.id
      );

      // First, let's get all enrollments for this course to see what we have
      const allEnrollments = await prisma.enrollment.findMany({
        where: {
          courseId: params.id,
        },
        include: {
          student: true,
        },
      });

      console.log(
        'All enrollments for course:',
        allEnrollments.map((e) => ({
          id: e.id,
          status: e.status,
          studentId: e.studentId,
          studentStatus: e.student.status,
        }))
      );

      const activeEnrollments = await prisma.enrollment.count({
        where: {
          courseId: params.id,
          status: 'ENROLLED',
          student: {
            status: 'ACTIVE',
          },
        },
      });

      console.log('Found active enrollments:', activeEnrollments);

      // Let's also check enrollments with just ENROLLED status
      const enrolledCount = await prisma.enrollment.count({
        where: {
          courseId: params.id,
          status: 'ENROLLED',
        },
      });
      console.log('Total ENROLLED status enrollments:', enrolledCount);

      // And check enrollments with ACTIVE students
      const activeStudentEnrollments = await prisma.enrollment.count({
        where: {
          courseId: params.id,
          student: {
            status: 'ACTIVE',
          },
        },
      });
      console.log(
        'Total enrollments with ACTIVE students:',
        activeStudentEnrollments
      );

      if (activeEnrollments > 0) {
        return NextResponse.json(
          { error: 'Cannot deactivate course with active enrollments' },
          { status: 400 }
        );
      }
    }

    // Update course
    const course = await prisma.$transaction(async (tx) => {
      // Prepare update data with only the fields that are being updated
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.duration !== undefined)
        updateData.duration = parseInt(data.duration);
      if (data.fee !== undefined) updateData.fee = parseFloat(data.fee);
      if (data.status !== undefined)
        updateData.status = data.status as CourseStatus;

      // Update course
      const updatedCourse = await tx.course.update({
        where: { id: params.id },
        data: updateData,
      });

      // Log the activity
      await tx.activityLog.create({
        data: {
          action: 'UPDATE',
          entity: 'course',
          entityId: updatedCourse.id,
          details: JSON.stringify({
            previous: {
              title: currentCourse.title,
              status: currentCourse.status,
            },
            current: {
              title: updatedCourse.title,
              status: updatedCourse.status,
            },
          }),
          adminId: session.user.id,
        },
      });

      return updatedCourse;
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update course',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Only super admin can delete courses' },
        { status: 403 }
      );
    }

    // Get course data for activity log
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            certificates: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if course has any enrollments or certificates
    if (course._count.enrollments > 0 || course._count.certificates > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete course with existing enrollments or certificates',
        },
        { status: 400 }
      );
    }

    // Delete course
    await prisma.course.delete({
      where: { id: params.id },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entity: 'course',
        entityId: params.id,
        details: JSON.stringify({
          title: course.title,
          status: course.status,
        }),
        adminId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
