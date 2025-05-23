import { NextResponse } from "next/server";
import { ContactFormData } from "@/types";
import nodemailer from "nodemailer";
import { config } from "dotenv";

// Load environment variables if not in Next.js context
if (process.env.NODE_ENV !== "production" && !process.env.NEXT_RUNTIME) {
  config({ path: ".env.local" });
}

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();
    const { name, email, phone, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }
    console.log(
      "userName",
      process.env.EMAIL_USER,
      " password ",
      process.env.EMAIL_PASSWORD
    );
    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "sacredwebdev@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
