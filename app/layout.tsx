import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import clsx from "clsx";
import { Inter } from "next/font/google";

import { Providers } from "./providers";

import { AuthProvider } from "@/lib/auth-context";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { ClientLayout } from "@/components/client-layout";


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
        {/* Google Tag Manager Script */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NTLHQ2F4');
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
          inter.className,
        )}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NTLHQ2F4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
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
