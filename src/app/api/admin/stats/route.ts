import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminRole } from '@prisma/client';

export async function GET() {
  try {
    // Check if the request is from an authenticated admin
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total students count
    const totalStudents = await prisma.student.count({
      where: {
        OR: [{ status: 'ACTIVE' }, { status: 'GRADUATED' }],
      },
    });

    // Get active courses count
    const activeCourses = await prisma.course.count({
      where: { status: 'ACTIVE' },
    });

    // Get total certificates issued
    const totalCertificates = await prisma.certificate.count({
      where: { status: 'ACTIVE' },
    });

    // Get total placements
    const totalPlacements = await prisma.placement.count();

    // Get recent enrollments (last 7 days)
    const recentEnrollments = await prisma.enrollment.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get recent certificates (last 7 days)
    const recentCertificates = await prisma.certificate.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get recent placements (last 7 days)
    const recentPlacements = await prisma.placement.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get enrollment trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const enrollmentTrends = await prisma.enrollment.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: true,
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Get certificate trends (last 6 months)
    const certificateTrends = await prisma.certificate.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: true,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({
      overview: {
        totalStudents,
        activeCourses,
        totalCertificates,
        totalPlacements,
      },
      recent: {
        enrollments: recentEnrollments,
        certificates: recentCertificates,
        placements: recentPlacements,
      },
      trends: {
        enrollments: enrollmentTrends,
        certificates: certificateTrends,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
