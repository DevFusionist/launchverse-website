import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import ClientLayout from "@/components/layout/ClientLayout";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://scriptauradev.com"
  ),
  title: {
    default: "Launch Verse Academy - Computer Training Institute",
    template: "%s | Launch Verse Academy",
  },
  description:
    "Professional computer training institute offering courses in Web Development, Graphic Design, Web Design, and MS Office. Get certified and launch your career today.",
  authors: [{ name: "Launch Verse Academy" }],
  creator: "Launch Verse Academy",
  publisher: "Launch Verse Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Launch Verse Academy",
    title: "Launch Verse Academy - Computer Training Institute",
    description:
      "Professional computer training institute offering courses in Web Development, Graphic Design, Web Design, and MS Office. Get certified and launch your career today.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Launch Verse Academy - Computer Training Institute",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Verse Academy - Computer Training Institute",
    description:
      "Professional computer training institute offering courses in Web Development, Graphic Design, Web Design, and MS Office. Get certified and launch your career today.",
    images: ["/og-image.jpg"],
    creator: "@launchverseacademy",
    site: "@launchverseacademy",
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
    google: "WZLC6SKO4R6Ici18zmuIB9j6Th8cdVVweUCdojhcrSU",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Service worker registered successfully
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    });
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-[var(--background)]`}
        style={{ backgroundImage: "var(--gradient-background)" }}
        suppressHydrationWarning
      >
        <SessionProvider>
          <ThemeProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  "glass-effect dark:bg-neon-card-dark dark:text-neon-text-dark",
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
