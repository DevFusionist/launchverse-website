"use client";

import React from "react";

import { LoginForm } from "@/components/loginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
      <LoginForm />
    </div>
  );
}
