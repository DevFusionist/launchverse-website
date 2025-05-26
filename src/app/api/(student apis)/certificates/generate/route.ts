import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'STUDENT';

type Session = {
  user?: {
    role: UserRole;
  };
};

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is either a super admin or a student
    if (
      session.user.role !== 'SUPER_ADMIN' &&
      session.user.role !== 'STUDENT'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, course, date, certificateId } = await req.json();

    if (!name || !course || !date || !certificateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape
    const { width, height } = page.getSize();

    // Load fonts
    const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Add certificate content
    const title = 'Certificate of Completion';
    const titleWidth = fontBold.widthOfTextAtSize(title, 40);
    page.drawText(title, {
      x: width / 2 - titleWidth / 2,
      y: height - 100,
      size: 40,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    const subtitle = 'This is to certify that';
    const subtitleWidth = fontRegular.widthOfTextAtSize(subtitle, 25);
    page.drawText(subtitle, {
      x: width / 2 - subtitleWidth / 2,
      y: height - 180,
      size: 25,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });

    const nameWidth = fontBold.widthOfTextAtSize(name, 30);
    page.drawText(name, {
      x: width / 2 - nameWidth / 2,
      y: height - 240,
      size: 30,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    const courseText = 'has successfully completed the course';
    const courseTextWidth = fontRegular.widthOfTextAtSize(courseText, 25);
    page.drawText(courseText, {
      x: width / 2 - courseTextWidth / 2,
      y: height - 300,
      size: 25,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });

    const courseNameWidth = fontBold.widthOfTextAtSize(course, 30);
    page.drawText(course, {
      x: width / 2 - courseNameWidth / 2,
      y: height - 360,
      size: 30,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    const dateText = `Date: ${date}`;
    const dateWidth = fontRegular.widthOfTextAtSize(dateText, 20);
    page.drawText(dateText, {
      x: width / 2 - dateWidth / 2,
      y: height - 420,
      size: 20,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });

    const certIdText = `Certificate ID: ${certificateId}`;
    const certIdWidth = fontRegular.widthOfTextAtSize(certIdText, 15);
    page.drawText(certIdText, {
      x: width / 2 - certIdWidth / 2,
      y: height - 480,
      size: 15,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    // Set response headers for PDF download
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set(
      'Content-Disposition',
      `attachment; filename="certificate-${certificateId}.pdf"`
    );

    return new NextResponse(pdfBytes, { headers });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
