"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function NewStudentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      toast.success("Student created successfully");

      // Check if we need to refresh the data
      const shouldRefresh = searchParams.get("refresh") === "true";
      if (shouldRefresh) {
        router.push("/admin/students?refresh=true");
      } else {
        router.push("/admin/students");
      }
      router.refresh();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Failed to create student");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-neon-text-light dark:text-neon-text-dark">
            Add New Student
          </h1>
          <p className="mt-2 text-sm text-neon-text-light/60 dark:text-neon-text-dark/60">
            Create a new student account for Launch Verse Academy.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 px-4 py-2 text-sm font-semibold text-neon-text-light dark:text-neon-text-dark hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-neon-primary dark:bg-neon-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary dark:focus-visible:outline-neon-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
