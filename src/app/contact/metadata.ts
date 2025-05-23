import { Metadata, Viewport } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scriptauradev.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title:
    "Contact Launch Verse Academy – Computer Training Institute in Chandannagar",
  description:
    "Get in touch with Launch Verse Academy for computer courses in Chandannagar. Contact us via WhatsApp, phone, or email for course inquiries and enrollment.",
  keywords: [
    "Contact Launch Verse Academy",
    "Computer Training Academy Chandannagar",
    "Course Enquiry",
    "Computer Course Admission",
    "Training Center Contact",
    "Launch Verse Academy Contact Number",
  ],
  openGraph: {
    title:
      "Contact Launch Verse Academy – Computer Training Institute in Chandannagar",
    description:
      "Get in touch with Launch Verse Academy for computer courses in Chandannagar. Contact us via WhatsApp, phone, or email for course inquiries and enrollment.",
    url: `${baseUrl}/contact`,
    siteName: "Launch Verse Academy",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Contact Launch Verse Academy – Computer Training Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Launch Verse Academy – Computer Training Institute",
    description:
      "Get in touch with Launch Verse Academy for computer courses in Chandannagar. Contact us via WhatsApp, phone, or email for course inquiries and enrollment.",
    images: [`${baseUrl}/twitter-image.jpg`],
    creator: "@launchverseacademy",
    site: "@launchverseacademy",
  },
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Launch Verse Academy" }],
};
