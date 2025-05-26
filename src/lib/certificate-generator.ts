import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { Certificate, Student, Course, Admin } from '@prisma/client';
import { SITE_CONFIG } from './constants';

type CertificateWithRelations = Certificate & {
  student: Student;
  course: Course;
  issuedBy: Admin;
};

export async function generateCertificatePDF(
  certificate: CertificateWithRelations
): Promise<Buffer> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  // Load fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add background (optional)
  // You can add a background image or pattern here

  // Add certificate border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.1, 0.1, 0.1),
    borderWidth: 2,
  });

  // Add certificate title
  page.drawText('Certificate of Completion', {
    x: width / 2 - 150,
    y: height - 100,
    size: 32,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Add certificate content
  const content = [
    'This is to certify that',
    certificate.student.name,
    'has successfully completed the course',
    certificate.course.title,
    'on',
    new Date(certificate.issuedAt).toLocaleDateString(),
  ];

  let y = height - 200;
  const lineHeight = 30;

  content.forEach((line, index) => {
    const fontSize = index === 1 ? 24 : 16;
    const font = index === 1 ? fontBold : fontRegular;
    const textWidth = font.widthOfTextAtSize(line, fontSize);
    page.drawText(line, {
      x: width / 2 - textWidth / 2,
      y,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= lineHeight;
  });

  // Add certificate code
  const codeText = `Certificate Code: ${certificate.code}`;
  const codeWidth = fontRegular.widthOfTextAtSize(codeText, 12);
  page.drawText(codeText, {
    x: width / 2 - codeWidth / 2,
    y: 100,
    size: 12,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Generate and add QR code
  const verificationUrl = `${SITE_CONFIG.url}/verify/${certificate.code}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 100,
  });

  const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
  page.drawImage(qrCodeImage, {
    x: width - 150,
    y: 50,
    width: 100,
    height: 100,
  });

  // Add issuer details
  const issuerText = `Issued by: ${certificate.issuedBy.name}`;
  const issuerWidth = fontRegular.widthOfTextAtSize(issuerText, 12);
  page.drawText(issuerText, {
    x: width / 2 - issuerWidth / 2,
    y: 50,
    size: 12,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
