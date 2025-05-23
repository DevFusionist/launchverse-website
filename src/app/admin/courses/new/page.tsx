"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface CourseFormData {
  title: string;
  description: string;
  priceRange: {
    min: number;
    max: number;
  };
  duration: {
    min: number;
    max: number;
  };
  durationUnit: "weeks" | "months";
  isActive: boolean;
}

export default function NewCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    priceRange: {
      min: 0,
      max: 0,
    },
    duration: {
      min: 0,
      max: 0,
    },
    durationUnit: "weeks",
    isActive: true,
  });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-primary"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  if (
    !session?.user?.role ||
    !["admin", "super_admin"].includes(session.user.role)
  ) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      toast.success("Course created successfully");

      // Check if we need to refresh the data
      const shouldRefresh = searchParams.get("refresh") === "true";
      if (shouldRefresh) {
        router.push("/admin/courses?refresh=true");
      } else {
        router.push("/admin/courses");
      }
      router.refresh();
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CourseFormData] as Record<string, any>),
          [child]: type === "number" ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-neon-text-light dark:text-neon-text-dark mb-6">
          Add New Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-neon-text-light dark:text-neon-text-dark shadow-sm focus:border-neon-primary dark:focus:border-neon-primary-dark focus:outline-none focus:ring-1 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-neon-text-light dark:text-neon-text-dark shadow-sm focus:border-neon-primary dark:focus:border-neon-primary-dark focus:outline-none focus:ring-1 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="priceRange.min"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                Minimum Price (₹)
              </label>
              <input
                type="number"
                id="priceRange.min"
                name="priceRange.min"
                required
                min="0"
                value={formData.priceRange.min}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-neon-text-light dark:text-neon-text-dark shadow-sm focus:border-neon-primary dark:focus:border-neon-primary-dark focus:outline-none focus:ring-1 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>

            <div>
              <label
                htmlFor="priceRange.max"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                Maximum Price (₹)
              </label>
              <input
                type="number"
                id="priceRange.max"
                name="priceRange.max"
                required
                min="0"
                value={formData.priceRange.max}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-neon-text-light dark:text-neon-text-dark shadow-sm focus:border-neon-primary dark:focus:border-neon-primary-dark focus:outline-none focus:ring-1 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="duration.min"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                Minimum Duration
              </label>
              <input
                type="number"
                id="duration.min"
                name="duration.min"
                required
                min="0"
                value={formData.duration.min}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-neon-text-light dark:text-neon-text-dark shadow-sm focus:border-neon-primary dark:focus:border-neon-primary-dark focus:outline-none focus:ring-1 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>

            <div>
              <label
                htmlFor="duration.max"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                Maximum Duration
              </label>
              <input
                type="number"
                id="duration.max"
                name="duration.max"
                required
                min="0"
                value={formData.duration.max}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-neon-text-light dark:text-neon-text-dark shadow-sm focus:border-neon-primary dark:focus:border-neon-primary-dark focus:outline-none focus:ring-1 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="durationUnit"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Duration Unit
            </label>
            <select
              id="durationUnit"
              name="durationUnit"
              required
              value={formData.durationUnit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-neon-text-light dark:text-neon-text-dark shadow-sm focus:border-neon-primary dark:focus:border-neon-primary-dark focus:outline-none focus:ring-1 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            >
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-neon-primary dark:text-neon-primary-dark focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-neon-text-light dark:text-neon-text-dark"
            >
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-neon-text-light dark:text-neon-text-dark hover:text-neon-primary dark:hover:text-neon-primary-dark focus:outline-none focus:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-neon-primary dark:bg-neon-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary dark:focus-visible:outline-neon-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
