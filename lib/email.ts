import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"LaunchVerse" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export function generateInvitationEmail(
  name: string,
  verificationLink: string,
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to LaunchVerse!</h2>
      <p>Hello ${name},</p>
      <p>You have been invited to join LaunchVerse as an admin. Click the button below to verify your email and set up your account:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this invitation, please ignore this email.</p>
      <p>Best regards,<br>The LaunchVerse Team</p>
    </div>
  `;
}

export function generateOTPEmail(name: string, otp: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your LaunchVerse Verification Code</h2>
      <p>Hello ${name},</p>
      <p>Your verification code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
          ${otp}
        </div>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <p>Best regards,<br>The LaunchVerse Team</p>
    </div>
  `;
}
