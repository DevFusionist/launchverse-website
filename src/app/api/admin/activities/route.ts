import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get activities with pagination
    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.activityLog.count(),
    ]);

    // Get activity counts by type
    const activityCounts = await prisma.activityLog.groupBy({
      by: ['action'],
      _count: {
        _all: true,
      },
    });

    // Get recent trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTrends = await prisma.activityLog.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({
      activities,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
      stats: {
        byType: activityCounts.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.action]: curr._count._all || 0,
          }),
          {}
        ),
        recentTrends: recentTrends.map((trend) => ({
          date: trend.createdAt,
          count: trend._count._all || 0,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch activities' }),
      { status: 500 }
    );
  }
}
