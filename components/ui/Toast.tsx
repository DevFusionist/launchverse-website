"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export const Toast = ({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) => {
  const _icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  useEffect(() => {
    const timer = setTimeout(onClose, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-900",
        {
          "border-l-4 border-green-500": type === "success",
          "border-l-4 border-red-500": type === "error",
          "border-l-4 border-yellow-500": type === "warning",
          "border-l-4 border-blue-500": type === "info",
        },
      )}
      exit={{ opacity: 0, y: 20 }}
      initial={{ opacity: 0, y: 20 }}
    >
      {_icons[type]}
      <p className="text-sm font-medium text-neutral-900 dark:text-white">
        {message}
      </p>
    </motion.div>
  );
};

// Toast Container to manage multiple toasts
export function ToastContainer() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);
  const [counter, setCounter] = useState(0);

  const addToast = (message: string, type: ToastType) => {
    // Generate a unique ID using timestamp and counter
    const id = `${Date.now()}-${counter}`;

    setCounter((prev) => prev + 1);

    setToasts((prev) => {
      // Remove any existing toasts with the same message
      const filteredToasts = prev.filter((toast) => toast.message !== message);

      return [...filteredToasts, { id, message, type }];
    });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Expose addToast to window for global access
  useEffect(() => {
    (window as any).showToast = addToast;

    return () => {
      delete (window as any).showToast;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Helper function to show toast
export const showToast = (message: string, type: ToastType = "info") => {
  if (typeof window !== "undefined" && (window as any).showToast) {
    (window as any).showToast(message, type);
  }
};
