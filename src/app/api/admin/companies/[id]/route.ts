import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logActivity } from '@/lib/activity-logger';
import { PlacementStatus, Prisma } from '@prisma/client';

// Schema for company update
const companyUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  description: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  logo: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

// GET /api/admin/companies/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            placements: true,
          },
        },
        placements: {
          select: {
            id: true,
            position: true,
            package: true,
            joiningDate: true,
            status: true,
            createdAt: true,
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Calculate statistics
    const totalPlacements = company._count.placements;
    const activePlacements = company.placements.filter(
      (p) => p.status === 'JOINED' || p.status === 'OFFERED'
    );
    const averagePackage =
      activePlacements.length > 0
        ? activePlacements.reduce((acc, curr) => acc + curr.package, 0) /
          activePlacements.length
        : 0;
    const activeStudents = activePlacements.length;

    return NextResponse.json({
      company: {
        ...company,
        totalPlacements,
        averagePackage,
        activeStudents,
      },
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/companies/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = companyUpdateSchema.parse(body);

    const company = await prisma.company.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedBy: {
          connect: { id: session.user.id },
        },
      },
    });

    await logActivity({
      entity: 'company',
      entityId: company.id,
      action: 'UPDATE_COMPANY',
      details: {
        companyName: company.name,
      },
      adminId: session.user.id,
    });

    return NextResponse.json({ company });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid company data', details: error.errors },
        { status: 400 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/companies/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if company has any placements
    const companyWithPlacements = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            placements: true,
          },
        },
      },
    });

    if (!companyWithPlacements) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    if (companyWithPlacements._count.placements > 0) {
      return NextResponse.json(
        { error: 'Cannot delete company with existing placements' },
        { status: 400 }
      );
    }

    const company = await prisma.company.delete({
      where: { id: params.id },
    });

    await logActivity({
      entity: 'company',
      entityId: company.id,
      action: 'DELETE_COMPANY',
      details: {
        companyName: company.name,
      },
      adminId: session.user.id,
    });

    return NextResponse.json({ company });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
