"use client";
import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Label } from "./ui/LabelWithEffect";
import { Input } from "./ui/InputWithEffect";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      await login(data.email, data.password);
      addToast({
        title: "Success",
        description: "Logged in successfully",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to login",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/10 hover:border-blue-500/50 hover:animate-neon-pulse dark:hover:border-blue-400/50">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to LaunchVerse
      </h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        Login to LaunchVerse to access your account
      </p>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            className={cn(
              errors.email && "border-red-500 focus:border-red-500",
            )}
            disabled={loading || isSubmitting}
            id="email"
            placeholder="Enter your email"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              className={cn(
                "pr-10",
                errors.password && "border-red-500 focus:border-red-500",
              )}
              disabled={loading || isSubmitting}
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              tabIndex={-1}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={showPassword ? "hide" : "show"}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-200 to-neutral-300 font-medium text-black shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all hover:from-neutral-300 hover:to-neutral-400 dark:from-neutral-800 dark:to-neutral-900 dark:text-white dark:hover:from-neutral-900 dark:hover:to-neutral-950 border border-transparent hover:border-blue-500/50 hover:animate-neon-pulse dark:hover:border-blue-400/50"
          disabled={loading || isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Logging in..." : "Login"} &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
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
