"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import NeonButton from "@/components/ui/NeonButton";

interface VerificationResult {
  certificateId: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  status: "active" | "revoked";
  revokedReason?: string;
}

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/verify/${certificateId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify certificate");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neon-background-light dark:bg-neon-background-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neon-text-light dark:text-neon-text-dark sm:text-4xl">
            Verify Certificate
          </h1>
          <p className="mt-2 text-lg leading-8 text-neon-text-light/80 dark:text-neon-text-dark/80">
            Enter your certificate ID to verify its authenticity.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="certificateId"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                Certificate ID
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="certificateId"
                  id="certificateId"
                  value={certificateId}
                  onChange={(e) =>
                    setCertificateId(e.target.value.toUpperCase())
                  }
                  className="block w-full rounded-md border border-neon-primary/20 dark:border-neon-primary-dark/20 px-4 py-3 text-neon-text-light dark:text-neon-text-dark bg-neon-card-light dark:bg-neon-card-dark placeholder:text-neon-text-light/40 dark:placeholder:text-neon-text-dark/40 focus:border-neon-primary dark:focus:border-neon-primary-dark focus:outline-none focus:ring-neon-primary dark:focus:ring-neon-primary-dark sm:text-sm"
                  placeholder="Enter certificate ID (e.g., LV-XXXXX-XXXXX)"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-neon-text-light/40 dark:text-neon-text-dark/40"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
            <div>
              <NeonButton
                type="submit"
                disabled={isLoading}
                fullWidth={true}
                variant="primary"
                size="md"
              >
                {isLoading ? "Verifying..." : "Verify Certificate"}
              </NeonButton>
            </div>
          </form>

          {error && (
            <div className="mt-6 rounded-md bg-red-50 dark:bg-red-900/30 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                    Verification Failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-md bg-neon-card-light dark:bg-neon-card-dark border border-neon-primary/20 dark:border-neon-primary-dark/20 p-6">
              <h3 className="text-lg font-medium text-neon-text-light dark:text-neon-text-dark">
                Certificate Details
              </h3>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
                    Certificate ID
                  </dt>
                  <dd className="mt-1 text-sm text-neon-text-light dark:text-neon-text-dark">
                    {result.certificateId}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
                    Student Name
                  </dt>
                  <dd className="mt-1 text-sm text-neon-text-light dark:text-neon-text-dark">
                    {result.studentName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
                    Course
                  </dt>
                  <dd className="mt-1 text-sm text-neon-text-light dark:text-neon-text-dark">
                    {result.courseName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
                    Issue Date
                  </dt>
                  <dd className="mt-1 text-sm text-neon-text-light dark:text-neon-text-dark">
                    {new Date(result.issueDate).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
                    Status
                  </dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        result.status === "active"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                      }`}
                    >
                      {result.status === "active" ? "Active" : "Revoked"}
                    </span>
                  </dd>
                </div>
                {result.status === "revoked" && result.revokedReason && (
                  <div>
                    <dt className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
                      Revocation Reason
                    </dt>
                    <dd className="mt-1 text-sm text-neon-text-light dark:text-neon-text-dark">
                      {result.revokedReason}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
