import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Placement } from '@prisma/client';

// Helper function to check authentication
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

// Helper function to log activity
async function logActivity(
  action: string,
  entityId: string,
  details: any,
  adminId: string
) {
  await prisma.activityLog.create({
    data: {
      action,
      entity: 'placement',
      entityId,
      details: JSON.stringify(details),
      adminId,
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAuth();
    const { id } = params;
    const body = await request.json();
    const {
      studentId,
      companyId,
      position,
      package: packageAmount,
      joiningDate,
      status,
      notes,
    } = body;

    // First check if placement exists
    const existingPlacement = await prisma.placement.findUnique({
      where: { id },
    });

    if (!existingPlacement) {
      return new NextResponse('Placement not found', { status: 404 });
    }

    const placement = await prisma.placement.update({
      where: { id },
      data: {
        student: studentId ? { connect: { id: studentId } } : undefined,
        company: companyId ? { connect: { id: companyId } } : undefined,
        position,
        package: packageAmount,
        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
        status: status as Placement['status'],
        notes,
        updatedBy: {
          connect: { id: session.user.id },
        },
      },
    });

    await logActivity(
      'UPDATE',
      placement.id,
      {
        studentId,
        companyId,
        position,
        package: packageAmount,
        joiningDate,
        status,
        notes,
      },
      session.user.id
    );

    return NextResponse.json(placement);
  } catch (error) {
    console.error('Error updating placement:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAuth();
    if (session.user.role !== 'SUPER_ADMIN') {
      return new NextResponse('Only super admin can delete placements', {
        status: 403,
      });
    }
    const { id } = params;

    // First check if placement exists
    const existingPlacement = await prisma.placement.findUnique({
      where: { id },
    });

    if (!existingPlacement) {
      return new NextResponse('Placement not found', { status: 404 });
    }

    const placement = await prisma.placement.delete({
      where: { id },
    });

    await logActivity(
      'DELETE',
      placement.id,
      {
        studentId: placement.studentId,
        companyId: placement.companyId,
        position: placement.position,
        package: placement.package,
        status: placement.status,
      },
      session.user.id
    );

    return NextResponse.json({ message: 'Placement deleted successfully' });
  } catch (error) {
    console.error('Error deleting placement:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAuth();
    const { id } = params;

    const placement = await prisma.placement.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!placement) {
      return new NextResponse('Placement not found', { status: 404 });
    }

    // Fetch students and companies for the edit form
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
      placement,
      students,
      companies,
    });
  } catch (error) {
    console.error('Error fetching placement:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
