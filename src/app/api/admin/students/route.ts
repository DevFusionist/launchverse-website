import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StudentStatus, Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const studentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED']),
  courses: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as StudentStatus | null;

    const skip = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {
      AND: [
        search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {},
        status ? { status } : {},
      ],
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              enrollments: true,
              certificates: true,
              placements: true,
            },
          },
          enrollments: {
            include: {
              course: {
                select: {
                  title: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      students,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = studentSchema.parse(body);

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email: validatedData.email },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password if provided
    const hashedPassword = validatedData.password
      ? await hash(validatedData.password, 12)
      : undefined;

    // Create student
    const student = await prisma.student.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        status: validatedData.status,
        enrollments: validatedData.courses
          ? {
              create: validatedData.courses.map((courseId) => ({
                course: { connect: { id: courseId } },
                startDate: new Date(),
                status: 'ENROLLED',
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json({ student });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
