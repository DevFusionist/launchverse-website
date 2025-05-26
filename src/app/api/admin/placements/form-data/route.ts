import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Fetch active students and companies
    const [students, companies] = await Promise.all([
      prisma.student.findMany({
        where: {
          status: {
            in: ['ACTIVE', 'GRADUATED'],
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.company.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    return NextResponse.json({
      students,
      companies,
    });
  } catch (error) {
    console.error('Error fetching form data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
