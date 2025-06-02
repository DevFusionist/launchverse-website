"use client";

import { useState, KeyboardEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/InputWithEffect";
import { Label } from "@/components/ui/LabelWithEffect";
import { cn } from "@/lib/utils";
import { otpSchema, type OtpFormData } from "@/lib/validations/auth";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

// Create a client component for the form
function VerifyOTPForm() {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const onSubmit = async (data: OtpFormData) => {
    if (loading) return;
    if (!userId) {
      addToast({
        title: "Error",
        description: "Missing user ID.",
        color: "danger",
      });

      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: data.otp }),
      });
      const responseData = await res.json();

      if (!res.ok) throw new Error(responseData.error || "Verification failed");
      addToast({
        title: "Success",
        description: "OTP verified! Redirecting...",
        color: "success",
      });
      router.push("/admin");
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message || "Failed to verify OTP",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendLoading || cooldown > 0) return;
    if (!userId) {
      addToast({
        title: "Error",
        description: "Missing user ID.",
        color: "danger",
      });

      return;
    }
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to resend OTP");
      addToast({
        title: "Success",
        description: "OTP resent successfully!",
        color: "success",
      });
      setCooldown(60); // Start 60 second cooldown
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message || "Failed to resend OTP",
        color: "danger",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      e.key === "Enter" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      return;
    }
    // Prevent any non-numeric input
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/10 hover:border-blue-500/50 hover:animate-neon-pulse dark:hover:border-blue-400/50 mt-16">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
        Verify OTP
      </h2>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
        Enter the verification code sent to your email.
      </p>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="otp">OTP Code</Label>
          <Input
            className={cn(
              "w-full",
              errors.otp && "border-red-500 focus:border-red-500",
            )}
            disabled={loading || isSubmitting}
            id="otp"
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]*"
            placeholder="Enter 6-digit OTP"
            type="tel"
            onKeyPress={handleKeyPress}
            {...register("otp", {
              onChange: (e) => {
                // Remove any non-numeric characters on paste
                e.target.value = e.target.value.replace(/\D/g, "");
              },
            })}
          />
          {errors.otp && (
            <p className="text-sm text-red-500 mt-1">{errors.otp.message}</p>
          )}
        </LabelInputContainer>
        <div className="space-y-4">
          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-200 to-neutral-300 font-medium text-black shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all hover:from-neutral-300 hover:to-neutral-400 dark:from-neutral-800 dark:to-neutral-900 dark:text-white dark:hover:from-neutral-900 dark:hover:to-neutral-950 border border-transparent hover:border-blue-500/50 hover:animate-neon-pulse dark:hover:border-blue-400/50"
            disabled={loading || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Verifying..." : "Verify"} &rarr;
            <BottomGradient />
          </button>

          <button
            className="w-full text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-blue-500/50 hover:animate-neon-pulse dark:hover:border-blue-400/50 rounded-md p-2"
            disabled={cooldown > 0 || resendLoading}
            type="button"
            onClick={handleResendOtp}
          >
            {resendLoading
              ? "Sending..."
              : cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : "Didn't receive the code? Resend OTP"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Main page component
export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPForm />
    </Suspense>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100 dark:via-neutral-700" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-neutral-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100 dark:via-neutral-600" />
    </>
  );
};
