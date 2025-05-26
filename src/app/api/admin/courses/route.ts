import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CourseStatus, Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as CourseStatus | 'ALL' | null;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.CourseWhereInput = {
      AND: [
        // Search in title and description
        search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {},
        // Filter by status
        status && status !== 'ALL' ? { status } : {},
      ],
    };

    // Get total count for pagination
    const total = await prisma.course.count({ where });

    // Get courses with their counts
    const courses = await prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            enrollments: true,
            certificates: true,
          },
        },
      },
    });

    return NextResponse.json({
      courses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
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

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description || !data.duration || !data.fee) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        duration: parseInt(data.duration),
        fee: parseFloat(data.fee),
        status: data.status || 'UPCOMING',
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entity: 'course',
        entityId: course.id,
        details: JSON.stringify({
          title: course.title,
          status: course.status,
        }),
        adminId: session.user.id,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
