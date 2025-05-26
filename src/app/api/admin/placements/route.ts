import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma, Placement, Company } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const PLACEMENT_STATUSES = ['OFFERED', 'JOINED', 'DECLINED'] as const;
type PlacementStatus = (typeof PLACEMENT_STATUSES)[number];

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

export async function GET(request: Request) {
  try {
    await checkAuth();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as Placement['status'] | 'ALL';
    const company = searchParams.get('company') || 'ALL';

    // Build the where clause
    const where: Prisma.PlacementWhereInput = {};
    if (search) {
      where.OR = [
        {
          student: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
        {
          student: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
        {
          company: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
        { position: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status !== 'ALL') {
      where.status = status;
    }
    if (company !== 'ALL') {
      where.company = {
        id: company,
      };
    }

    // Fetch placements with filters
    const [placements, companies, stats] = await Promise.all([
      prisma.placement.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.company.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      }),
      prisma.placement.aggregate({
        where,
        _count: true,
        _avg: {
          package: true,
        },
      }),
    ]);

    // Calculate status counts
    const statusCounts = await Promise.all(
      PLACEMENT_STATUSES.map(async (status) => {
        const count = await prisma.placement.count({
          where: {
            ...where,
            status: status as Placement['status'],
          },
        });
        return [status, count] as const;
      })
    );

    // Calculate company counts
    const companyCounts = await Promise.all(
      companies.map(async (company) => {
        const count = await prisma.placement.count({
          where: {
            ...where,
            company: {
              id: company.id,
            },
          },
        });
        return [company.id, count] as const;
      })
    );

    const byStatus = Object.fromEntries(statusCounts) as Record<
      Placement['status'],
      number
    >;
    const byCompany = Object.fromEntries(companyCounts);

    return NextResponse.json({
      placements,
      companies,
      stats: {
        total: stats._count,
        byStatus,
        averagePackage: stats._avg.package || 0,
        byCompany,
      },
    });
  } catch (error) {
    console.error('Error fetching placements:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const {
      studentId,
      companyId,
      position,
      package: pkg,
      offerDate,
      joiningDate,
      notes,
    } = body;

    // Get student and company details for email
    const [student, company] = await Promise.all([
      prisma.student.findUnique({
        where: { id: studentId },
        select: { name: true, email: true },
      }),
      prisma.company.findUnique({
        where: { id: companyId },
        select: {
          name: true,
          contactPersonEmail: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          createdById: true,
          updatedById: true,
          website: true,
          description: true,
          industry: true,
          location: true,
          logo: true,
        },
      }),
    ]);

    if (!student || !company) {
      return new NextResponse('Student or company not found', { status: 404 });
    }

    // Create placement record
    const placement = await prisma.placement.create({
      data: {
        student: {
          connect: { id: studentId },
        },
        company: {
          connect: { id: companyId },
        },
        position,
        package: pkg,
        offerDate: new Date(offerDate),
        joiningDate: new Date(joiningDate),
        status: 'OFFERED',
        notes,
        createdBy: {
          connect: { id: session.user.id },
        },
        updatedBy: {
          connect: { id: session.user.id },
        },
      },
      include: {
        student: true,
        company: true,
        createdBy: true,
        updatedBy: true,
      },
    });

    // Send congratulatory email
    const emailHtml = `
      <h1>Congratulations on Your Placement!</h1>
      <p>Dear ${student.name},</p>
      <p>We are thrilled to inform you that you have been placed at ${company.name}!</p>
      <p>Here are your placement details:</p>
      <ul>
        <li><strong>Company:</strong> ${company.name}</li>
        <li><strong>Position:</strong> ${position}</li>
        <li><strong>Package:</strong> ${pkg} LPA</li>
        <li><strong>Offer Date:</strong> ${new Date(offerDate).toLocaleDateString()}</li>
        <li><strong>Joining Date:</strong> ${new Date(joiningDate).toLocaleDateString()}</li>
      </ul>
      <p>We wish you all the best in your new role!</p>
      <p>Best regards,<br>Launch Verse Team</p>
    `;

    await sendEmail({
      to: student.email,
      cc: company.contactPersonEmail ? [company.contactPersonEmail] : undefined,
      subject: `Congratulations! Placement at ${company.name}`,
      text: `Congratulations ${student.name}! You have been placed at ${company.name} as ${position} with a package of ${pkg} LPA.`,
      html: emailHtml,
    });

    return NextResponse.json(placement);
  } catch (error) {
    console.error('Error creating placement:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
