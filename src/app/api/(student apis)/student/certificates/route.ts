import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        studentId: session.user.id,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        code: true,
        issuedAt: true,
        status: true,
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
