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
    "Computer Courses in Chandannagar – Web Development, Graphic Design & MS Office | Launch Verse Academy",
  description:
    "Expert-led training in Web Development, Graphic Design, MS Office & more. Get certified and job-ready with Launch Verse Academy's comprehensive courses.",
  keywords: [
    "computer courses",
    "web development course",
    "graphic design course",
    "MS Office training",
    "computer training in Chandannagar",
    "Launch Verse Academy courses",
  ],
  openGraph: {
    title: "Computer Courses in Chandannagar – Launch Verse Academy",
    description:
      "Expert-led training in Web Development, Graphic Design, MS Office & more. Get certified and job-ready with Launch Verse Academy's comprehensive courses.",
    url: `${baseUrl}/courses`,
    siteName: "Launch Verse Academy",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Launch Verse Academy Courses – Computer Training Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Computer Courses in Chandannagar – Launch Verse Academy",
    description:
      "Expert-led training in Web Development, Graphic Design, MS Office & more. Get certified and job-ready with Launch Verse Academy's comprehensive courses.",
    images: [`${baseUrl}/twitter-image.jpg`],
    creator: "@launchverseacademy",
    site: "@launchverseacademy",
  },
  alternates: {
    canonical: `${baseUrl}/courses`,
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Launch Verse Academy" }],
};
