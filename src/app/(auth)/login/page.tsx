"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import NeonButton from "@/components/ui/NeonButton";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "object" && error !== null) {
        const err = error as { error?: string; message?: string };
        toast.error(
          err.error || err.message || "An error occurred during login"
        );
      } else {
        toast.error("An error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neon-background-light dark:bg-neon-background-dark"
      suppressHydrationWarning
    >
      <div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        suppressHydrationWarning
      >
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-neon-text-light dark:text-neon-text-dark">
          Admin Login
        </h2>
      </div>

      <div
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]"
        suppressHydrationWarning
      >
        <div
          className="bg-neon-card-light dark:bg-neon-card-dark px-6 py-12 shadow-neon-sm sm:rounded-lg sm:px-12"
          suppressHydrationWarning
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div suppressHydrationWarning>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-neon-text-light dark:text-neon-text-dark"
              >
                Email address
              </label>
              <div className="mt-2" suppressHydrationWarning>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-neon-text-light dark:text-neon-text-dark bg-white dark:bg-neon-background-dark shadow-sm ring-1 ring-inset ring-neon-primary/20 dark:ring-neon-primary-dark/20 placeholder:text-neon-text-light/40 dark:placeholder:text-neon-text-dark/40 focus:ring-2 focus:ring-inset focus:ring-neon-primary dark:focus:ring-neon-primary-dark sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div suppressHydrationWarning>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-neon-text-light dark:text-neon-text-dark"
              >
                Password
              </label>
              <div className="mt-2" suppressHydrationWarning>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-neon-text-light dark:text-neon-text-dark bg-white dark:bg-neon-background-dark shadow-sm ring-1 ring-inset ring-neon-primary/20 dark:ring-neon-primary-dark/20 placeholder:text-neon-text-light/40 dark:placeholder:text-neon-text-dark/40 focus:ring-2 focus:ring-inset focus:ring-neon-primary dark:focus:ring-neon-primary-dark sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div suppressHydrationWarning>
              <NeonButton
                type="submit"
                disabled={isLoading}
                fullWidth
                variant="primary"
                size="md"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </NeonButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
