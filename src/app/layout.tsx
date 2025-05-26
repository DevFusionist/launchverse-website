import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import '@/styles/globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://scriptauradev.com'
  ),
  title: {
    default: 'Launch Verse - Training Institute',
    template: '%s | Launch Verse',
  },
  description:
    'Modern training institute platform for managing student enrollment, certificates, and placements',
  keywords: [
    'training institute',
    'online courses',
    'certificates',
    'student management',
    'placement tracking',
  ],
  authors: [{ name: 'Launch Verse Team' }],
  creator: 'Launch Verse',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://scriptauradev.com',
    title: 'Launch Verse - Training Institute',
    description:
      'Modern training institute platform for managing student enrollment, certificates, and placements',
    siteName: 'Launch Verse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Launch Verse - Training Institute',
    description:
      'Modern training institute platform for managing student enrollment, certificates, and placements',
    creator: '@launchverse',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
