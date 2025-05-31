"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import { ToastContainer, showToast } from "@/components/ui/Toast";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

// Create a client component for the verification form
function VerificationForm() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const searchParams = useSearchParams();

  // If verification code is in URL, use it
  const codeFromUrl = searchParams.get("code");

  if (codeFromUrl && !verificationCode) {
    setVerificationCode(codeFromUrl);
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      showToast("Please enter a verification code", "error");

      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(
        `/api/certificates/verify/${verificationCode}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify certificate");
      }

      setCertificate(data.data.certificate);
      showToast("Certificate verified successfully!", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to verify certificate", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const inputClasses = [
    // Base styles
    "w-full px-4 py-3",
    "bg-background/30 backdrop-blur-sm",
    "text-foreground placeholder:text-foreground/40",

    // Border and rounded styles
    "border border-white/10 rounded-2xl",
    "shadow-[0_2px_10px_rgba(0,0,0,0.1)]",

    // Focus styles
    "focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
    "focus:border-emerald-500/50",
    "focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]",

    // Transition effects
    "transition-all duration-300 ease-in-out",

    // Gradient effects
    "relative before:absolute before:inset-0 before:rounded-2xl",
    "before:bg-gradient-to-r before:from-emerald-500/20 before:via-blue-500/20 before:to-cyan-500/20",
    "before:opacity-0 before:transition-opacity before:duration-300",
    "focus:before:opacity-100",

    // Glow effect
    "after:absolute after:inset-0 after:rounded-2xl",
    "after:bg-gradient-to-r after:from-emerald-500/10 after:via-blue-500/10 after:to-cyan-500/10",
    "after:blur-xl after:opacity-0 after:transition-opacity after:duration-300",
    "focus:after:opacity-100",

    // Hover effect
    "hover:border-white/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]",

    // Error state
    "data-[error=true]:border-red-500/50",
    "data-[error=true]:focus:ring-red-500/30",
    "data-[error=true]:focus:border-red-500/50",
    "data-[error=true]:focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
  ].join(" ");

  const buttonClasses = [
    // Base styles
    "w-full px-6 py-3 rounded-2xl",
    "text-sm font-bold text-white",

    // Background gradient
    "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600",
    "hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500",

    // Border and shadow
    "border border-pink-500/40",
    "shadow-[0_4px_14px_rgba(236,72,153,0.2)]",
    "hover:border-pink-400/60",
    "hover:shadow-[0_6px_20px_rgba(236,72,153,0.3)]",

    // Transition effects
    "transition-all duration-300 ease-in-out",
    "hover:scale-[1.02] hover:-translate-y-0.5",

    // Gradient overlay
    "relative before:absolute before:inset-0 before:rounded-2xl",
    "before:bg-gradient-to-r before:from-pink-500/40 before:via-purple-500/40 before:to-indigo-500/40",
    "before:blur-xl before:opacity-0 before:transition-opacity before:duration-300",
    "hover:before:opacity-100",

    // Glow effect
    "after:absolute after:inset-0 after:rounded-2xl",
    "after:bg-gradient-to-r after:from-pink-400/30 after:via-purple-400/30 after:to-indigo-400/30",
    "after:blur-lg after:opacity-0 after:transition-opacity after:duration-300",
    "hover:after:opacity-100",

    // Disabled state
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "disabled:hover:scale-100 disabled:hover:shadow-none",
    "disabled:hover:border-pink-500/40",
    "disabled:hover:-translate-y-0",
  ].join(" ");

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Verify Certificate
          </h1>
          <p className="text-lg text-default-500">
            Enter the verification code to validate your certificate
          </p>
        </motion.div>

        <section className="w-full max-w-md mx-auto mt-8 px-4 relative z-10 flex items-center justify-center">
          <CardContainer className="inter-var w-full">
            <CardBody className="relative group/input w-full">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 bg-background/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] items-center justify-center
                  hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <CardItem translateX="-10" translateY="-5" translateZ="50">
                  <div className="space-y-0.5 text-center w-full">
                    <h2 className="text-xl font-semibold">
                      Certificate Verification
                    </h2>
                    <p className="text-lg text-default-500">
                      Enter your verification code to validate your
                      certificate
                    </p>
                  </div>
                </CardItem>

                <form
                  noValidate
                  className="space-y-3 w-full flex flex-col items-center"
                  onSubmit={handleVerify}
                >
                  <CardContainer className="inter-var w-full">
                    <CardBody className="relative group/input w-full space-y-4 flex flex-col items-center">
                      {/* Verification Code Input */}
                      <div className="relative w-full">
                        <CardItem
                          className="w-full"
                          translateX="-20"
                          translateY="-10"
                          translateZ="100"
                        >
                          <input
                            required
                            className={inputClasses}
                            id="verificationCode"
                            placeholder="Enter your verification code"
                            type="text"
                            value={verificationCode}
                            onChange={(e) =>
                              setVerificationCode(e.target.value)
                            }
                          />
                        </CardItem>
                      </div>

                      {/* Submit Button */}
                      <div className="relative w-full">
                        <CardItem
                          className="w-full"
                          translateX="-20"
                          translateY="-10"
                          translateZ="100"
                        >
                          <button
                            className={buttonClasses}
                            disabled={isVerifying}
                            type="submit"
                          >
                            {isVerifying
                              ? "Verifying..."
                              : "Verify Certificate"}
                          </button>
                        </CardItem>
                      </div>
                    </CardBody>
                  </CardContainer>
                </form>

                {certificate && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-background/30 backdrop-blur-md rounded-2xl border border-white/10 w-full"
                    initial={{ opacity: 0, y: 20 }}
                  >
                    <CardItem
                      translateX="-10"
                      translateY="-5"
                      translateZ="40"
                    >
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Certificate Details
                      </h2>
                      <div className="space-y-3">
                        <p>
                          <span className="font-medium">Certificate ID:</span>{" "}
                          {certificate.certificateId}
                        </p>
                        <p>
                          <span className="font-medium">Student:</span>{" "}
                          {certificate.student.firstName}{" "}
                          {certificate.student.lastName}
                        </p>
                        <p>
                          <span className="font-medium">Course:</span>{" "}
                          {certificate.course.title}
                        </p>
                        <p>
                          <span className="font-medium">Issue Date:</span>{" "}
                          {new Date(
                            certificate.issueDate,
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              certificate.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {certificate.status}
                          </span>
                        </p>
                      </div>
                    </CardItem>
                  </motion.div>
                )}
              </motion.div>
            </CardBody>
          </CardContainer>
        </section>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function VerifyCertificate() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastContainer />
      <VerificationForm />
    </Suspense>
  );
}
