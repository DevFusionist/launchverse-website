import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Inter } from "next/font/google";

import { Providers } from "./providers";

import { AuthProvider } from "@/lib/auth-context";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { ClientLayout } from "@/components/client-layout";
import { GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Launch Verse Academy - Best Computer Training Institute in Kolkata | ScriptAura",
    template: "%s | Launch Verse Academy",
  },
  description: "Join Launch Verse Academy for the best computer training in Kolkata. Learn web development, graphic design, MS Office & more. Get certified & placed with 100% job assistance.",
  verification: {
    google: "sXMeHFSzIKmupqSqeQLNQbhw-JMwQLX9Kfj2Bx2vRls",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://scriptauradev.com",
    siteName: "Launch Verse Academy",
    title: "Launch Verse Academy - Best Computer Training Institute in Kolkata | ScriptAura",
    description: "Join Launch Verse Academy for the best computer training in Kolkata. Learn web development, graphic design, MS Office & more. Get certified & placed with 100% job assistance.",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Launch Verse Academy - Best Computer Training Institute in Kolkata",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Verse Academy - Best Computer Training Institute in Kolkata | ScriptAura",
    description: "Join Launch Verse Academy for the best computer training in Kolkata. Learn web development, graphic design, MS Office & more. Get certified & placed with 100% job assistance.",
    images: ["/og-home.jpg"],
    creator: "@launchverse",
  },
  metadataBase: new URL("https://scriptauradev.com"),
  alternates: {
    canonical: "/",
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LaunchVerse Academy',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="dark" lang="en">
      <head>
        <meta name="google-site-verification" content="sXMeHFSzIKmupqSqeQLNQbhw-JMwQLX9Kfj2Bx2vRls" />
      </head>
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
          inter.className,
        )}
      >
        <GoogleTagManager gtmId="GTM-WSZZMKHN" />
        <AuthProvider>
          <Providers
            themeProps={{
              attribute: "class",
              defaultTheme: "dark",
              forcedTheme: "dark",
            }}
          >
            <div className="relative min-h-screen">
                <ClientLayout>{children}</ClientLayout>
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
