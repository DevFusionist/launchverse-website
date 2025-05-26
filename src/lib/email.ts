import nodemailer from 'nodemailer';

type EmailAttachment = {
  filename: string;
  content: Buffer;
};

type SendEmailParams = {
  to: string;
  cc?: string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  cc,
  subject,
  text,
  html,
  attachments,
}: SendEmailParams) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      cc,
      subject,
      text,
      html,
      attachments,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
