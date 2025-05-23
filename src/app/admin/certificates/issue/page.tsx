"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface FormData {
  studentId: string;
  courseId: string;
  issueDate: string;
}

export default function IssueCertificatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    studentId: "",
    courseId: "",
    issueDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to issue certificate");
      }

      toast.success("Certificate issued successfully");

      // Check if we need to refresh the data
      const shouldRefresh = searchParams.get("refresh") === "true";
      if (shouldRefresh) {
        router.push("/admin/certificates?refresh=true");
      } else {
        router.push("/admin/certificates");
      }
      router.refresh();
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error("Failed to issue certificate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-neon-text-light dark:text-neon-text-dark">
            Issue Certificate
          </h1>
          <p className="mt-2 text-sm text-neon-text-light/60 dark:text-neon-text-dark/60">
            Issue a new certificate to a student for completing a course.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Student
            </label>
            <select
              id="studentId"
              required
              value={formData.studentId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, studentId: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            >
              <option value="">Select a student</option>
              {/* TODO: Add student options */}
            </select>
          </div>

          <div>
            <label
              htmlFor="courseId"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Course
            </label>
            <select
              id="courseId"
              required
              value={formData.courseId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, courseId: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            >
              <option value="">Select a course</option>
              {/* TODO: Add course options */}
            </select>
          </div>

          <div>
            <label
              htmlFor="issueDate"
              className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
            >
              Issue Date
            </label>
            <input
              type="date"
              id="issueDate"
              required
              value={formData.issueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, issueDate: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 px-4 py-2 text-sm font-semibold text-neon-text-light dark:text-neon-text-dark hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary dark:focus-visible:outline-neon-primary-dark"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-neon-primary dark:bg-neon-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary dark:focus-visible:outline-neon-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Issuing..." : "Issue Certificate"}
          </button>
        </div>
      </form>
    </div>
  );
}
