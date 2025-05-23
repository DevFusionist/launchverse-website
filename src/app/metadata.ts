import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scriptauradev.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default:
      "Launch Verse Academy - Best Computer Training Institute in India | Chandannagar",
    template:
      "%s | Launch Verse Academy - Professional Computer Training Institute",
  },
  description:
    "India's leading computer training academy offering professional courses in Web Development, Web Design, Graphic Design, and MS Office. Expert-led training with 100% job placement assistance. Learn from industry professionals at Launch Verse Academy in Chandannagar, West Bengal.",
  keywords: [
    "Launch Verse Academy",
    "computer training academy",
    "web development course",
    "web design training",
    "graphic design course",
    "MS Office training",
    "computer courses in India",
    "best IT training academy",
    "job-oriented computer courses",
    "professional web development",
    "digital marketing course",
    "computer training in West Bengal",
    "Chandannagar computer academy",
    "IT training center",
    "software training academy",
    "computer education",
    "online computer courses",
    "certified computer training",
    "affordable computer courses",
    "industry-standard training",
    "career-focused education",
  ],
  authors: [{ name: "Launch Verse Academy", url: baseUrl }],
  creator: "Launch Verse Academy",
  publisher: "Launch Verse Academy",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "Launch Verse Academy",
    title:
      "Launch Verse Academy - Best Computer Training Institute in India | Chandannagar",
    description:
      "India's leading computer training academy offering professional courses in Web Development, Web Design, Graphic Design, and MS Office. Expert-led training with 100% job placement assistance.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Launch Verse Academy - Professional Computer Training Institute",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Verse Academy - Best Computer Training Institute in India",
    description:
      "India's leading computer training academy offering professional courses in Web Development, Web Design, Graphic Design, and MS Office. Expert-led training with 100% job placement assistance.",
    images: [`${baseUrl}/twitter-image.jpg`],
    creator: "@launchverseacademy",
    site: "@launchverseacademy",
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-IN": baseUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
    yandex: "your-yandex-verification",
  },
  category: "education",
  classification: "Computer Training Academy",
  referrer: "origin-when-cross-origin",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  other: {
    "geo.region": "IN-WB",
    "geo.placename": "Chandannagar",
    "geo.position": "22.8667;88.3833",
    ICBM: "22.8667, 88.3833",
    "og:price:amount": "5000",
    "og:price:currency": "INR",
    "business:contact_data:street_address": "Your Street Address",
    "business:contact_data:locality": "Chandannagar",
    "business:contact_data:postal_code": "712136",
    "business:contact_data:country_name": "India",
    "business:contact_data:phone_number": "+91-7001478078",
    "business:contact_data:email": "contact@scriptauradev.com",
    "business:contact_data:website": baseUrl,
    "business:contact_data:name": "Launch Verse Academy",
  },
};
