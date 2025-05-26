import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logActivity } from '@/lib/activity-logger';
import { Company, Placement, PlacementStatus, Prisma } from '@prisma/client';

// Schema for company creation
const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
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

type CompanyWithStats = Company & {
  _count: {
    placements: number;
  };
  placements: Pick<Placement, 'package'>[];
  industry: string | null;
  location: string | null;
};

// GET /api/admin/companies
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build the where clause for search
    const where: Prisma.CompanyWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { industry: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const companies = (await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: {
            placements: true,
          },
        },
        placements: {
          where: {
            status: PlacementStatus.JOINED,
          },
          select: {
            package: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })) as CompanyWithStats[];

    // Calculate statistics for each company
    const companiesWithStats = companies.map((company) => {
      const totalPlacements = company._count.placements;
      const averagePackage =
        company.placements.length > 0
          ? company.placements.reduce(
              (acc: number, curr: Pick<Placement, 'package'>) =>
                acc + curr.package,
              0
            ) / company.placements.length
          : 0;

      return {
        id: company.id,
        name: company.name,
        logo: company.logo,
        website: company.website,
        description: company.description,
        industry: company.industry,
        location: company.location,
        totalPlacements,
        averagePackage,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      };
    });

    // Calculate overall stats
    const stats = {
      total: companies.length,
      totalPlacements: companies.reduce(
        (acc, company) => acc + company._count.placements,
        0
      ),
      averagePackage:
        companiesWithStats.reduce(
          (acc, company) => acc + company.averagePackage,
          0
        ) / (companies.length || 1),
      activeStudents: companies.reduce(
        (acc, company) => acc + company.placements.length,
        0
      ),
    };

    return NextResponse.json({ companies: companiesWithStats, stats });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST /api/admin/companies
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = companySchema.parse(body);

    const company = await prisma.company.create({
      data: {
        name: validatedData.name,
        website: validatedData.website || null,
        description: validatedData.description || null,
        industry: validatedData.industry || null,
        location: validatedData.location || null,
        logo: validatedData.logo || null,
        createdBy: {
          connect: { id: session.user.id },
        },
        updatedBy: {
          connect: { id: session.user.id },
        },
      },
    });

    await logActivity({
      entity: 'company',
      entityId: company.id,
      action: 'CREATE_COMPANY',
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

    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
