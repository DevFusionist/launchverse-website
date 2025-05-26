import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity-logger';
import { generateCertificateCode } from '@/lib/utils';
import { generateCertificatePDF } from '@/lib/certificate-generator';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentId, courseId } = await request.json();

    // Validate input
    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'Student and course are required' },
        { status: 400 }
      );
    }

    // Check if student exists and is active
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (student.status === 'GRADUATED') {
      return NextResponse.json(
        { error: 'Student is already graduated' },
        { status: 400 }
      );
    }

    if (student.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Student is not active' },
        { status: 400 }
      );
    }

    // Check if course exists and is active
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Course is not active' },
        { status: 400 }
      );
    }

    // Check if student is enrolled in the course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId,
        courseId,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Student is not enrolled in this course' },
        { status: 400 }
      );
    }

    if (enrollment.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Student has already completed this course' },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        studentId,
        courseId,
        status: 'ACTIVE',
      },
    });

    if (existingCertificate) {
      return NextResponse.json(
        { error: 'Certificate already exists for this student and course' },
        { status: 400 }
      );
    }

    // Generate certificate and update statuses in a transaction
    const [certificate] = await prisma.$transaction([
      // Create certificate
      prisma.certificate.create({
        data: {
          code: generateCertificateCode(),
          student: {
            connect: { id: studentId },
          },
          course: {
            connect: { id: courseId },
          },
          issuedBy: {
            connect: { id: session.user.id },
          },
        },
        include: {
          student: true,
          course: true,
          issuedBy: true,
        },
      }),
      // Update enrollment status to COMPLETED
      prisma.enrollment.update({
        where: {
          id: enrollment.id,
        },
        data: {
          status: 'COMPLETED',
        },
      }),
      // Update student status to GRADUATED
      prisma.student.update({
        where: {
          id: studentId,
        },
        data: {
          status: 'GRADUATED',
        },
      }),
    ]);

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF(certificate);

    // Send email to student
    await sendEmail({
      to: student.email,
      subject: 'Your Certificate of Completion',
      text: `Dear ${student.name},\n\nCongratulations! Your certificate for ${course.title} has been generated. You can download it from your student dashboard or verify it using the code: ${certificate.code}\n\nBest regards,\nThe Team`,
      attachments: [
        {
          filename: `certificate-${certificate.code}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    // Log activity
    await logActivity({
      action: 'GENERATE_CERTIFICATE',
      entity: 'certificate',
      entityId: certificate.id,
      details: {
        studentId,
        courseId,
        certificateCode: certificate.code,
      },
      adminId: session.user.id,
    });

    return NextResponse.json({ certificate });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
