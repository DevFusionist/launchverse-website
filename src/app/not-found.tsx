import { Metadata, Viewport } from "next";

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
  title: "Page Not Found - Launch Verse Academy",
  description: "The page you&apos;re looking for doesn&apos;t exist.",
};

export default function NotFound() {
  return (
    <div className="bg-neon-background-light dark:bg-neon-background-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neon-text-light dark:text-neon-text-dark sm:text-5xl">
            Page Not Found
          </h1>
          <p className="mt-4 text-lg text-neon-text-light/80 dark:text-neon-text-dark/80">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    </div>
  );
}
