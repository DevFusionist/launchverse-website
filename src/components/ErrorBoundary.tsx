"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by error boundary:", error);
    // Handle authentication errors by redirecting to login
    if (
      error.message.includes("Unauthorized") ||
      error.message.includes("auth")
    ) {
      router.push("/admin/login");
    }
  }, [error, router]);

  if (
    error.message.includes("Unauthorized") ||
    error.message.includes("auth")
  ) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-background-light dark:bg-neon-background-dark">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-neon-card-light dark:bg-neon-card-dark rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-neon-text-light dark:text-neon-text-dark mb-4">
            {error.name === "NotFoundError"
              ? "Not Found"
              : "Something went wrong"}
          </h2>
          <p className="text-neon-text-light/80 dark:text-neon-text-dark/80 mb-6">
            {error.message || "An unexpected error occurred"}
          </p>
          <div className="flex gap-4">
            <button
              onClick={reset}
              className="flex-1 bg-neon-primary dark:bg-neon-primary-dark text-white px-4 py-2 rounded-md hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-neon-secondary dark:bg-neon-secondary-dark text-white px-4 py-2 rounded-md hover:bg-neon-secondary/90 dark:hover:bg-neon-secondary-dark/90 transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
