"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export const ContactFormSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Handle form submission here
      console.log(formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Reset form after successful submission
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
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
    <section className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
      {/* Contact Information */}
      <CardContainer className="inter-var w-full">
        <CardBody className="relative group/input w-full">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8 bg-background/30 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <CardItem translateX="-5" translateY="-3" translateZ="30">
                <h2 className="text-2xl font-semibold">Contact Information</h2>
                <p className="text-default-500 mt-2">
                  Have questions about our courses or need career guidance?
                  We&apos;re here to help! Fill out the form below and our team will
                  get back to you shortly.
                </p>
              </CardItem>
            </div>

            <div className="space-y-6">
              <CardItem translateX="-5" translateY="-3" translateZ="25">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-default-500">
                      131/26 (Holding No), Tentul Tala Lane (East), Ward-2
                      <br />
                      Mankundu, Hooghly – 712139
                      <br />
                      West Bengal, India
                    </p>
                  </div>
                </div>
              </CardItem>

              <CardItem translateX="-5" translateY="-3" translateZ="25">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🕘</div>
                  <div>
                    <h3 className="font-semibold">Opening Hours</h3>
                    <p className="text-default-500">
                      Open Daily: 9:00 AM – 10:00 PM
                    </p>
                  </div>
                </div>
              </CardItem>

              <CardItem translateX="-5" translateY="-3" translateZ="25">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📞</div>
                  <div>
                    <h3 className="font-semibold">Call/WhatsApp Us</h3>
                    <p className="text-default-500">
                      <a
                        className="hover:text-primary transition-colors"
                        href="tel:+917001478078"
                      >
                        +91 7001478078
                      </a>
                      <br />
                      <a
                        className="hover:text-primary transition-colors"
                        href="tel:+917508162363"
                      >
                        +91 7508162363
                      </a>
                    </p>
                  </div>
                </div>
              </CardItem>

              <CardItem translateX="-5" translateY="-3" translateZ="25">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">✉️</div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-default-500">
                      <a
                        className="hover:text-primary transition-colors"
                        href="mailto:sacredwebdev@gmail.com"
                      >
                        sacredwebdev@gmail.com
                      </a>
                      <br />
                    </p>
                  </div>
                </div>
              </CardItem>
            </div>

            <CardItem translateX="-5" translateY="-3" translateZ="20">
              <div className="space-y-4">
                <h3 className="font-semibold">Follow Us</h3>
                <div className="flex gap-4">
                  <button
                    aria-label="Twitter"
                    className="text-default-500 hover:text-primary transition-colors"
                    type="button"
                    onClick={() => {
                      window.open("https://twitter.com/launchverse", "_blank");
                    }}
                  >
                    Twitter
                  </button>
                  <button
                    aria-label="LinkedIn"
                    className="text-default-500 hover:text-primary transition-colors"
                    type="button"
                    onClick={() => {
                      window.open(
                        "https://linkedin.com/company/launchverse",
                        "_blank",
                      );
                    }}
                  >
                    LinkedIn
                  </button>
                  <button
                    aria-label="GitHub"
                    className="text-default-500 hover:text-primary transition-colors"
                    type="button"
                    onClick={() => {
                      window.open("https://github.com/launchverse", "_blank");
                    }}
                  >
                    GitHub
                  </button>
                  <button
                    aria-label="Discord"
                    className="text-default-500 hover:text-primary transition-colors"
                    type="button"
                    onClick={() => {
                      window.open("https://discord.gg/launchverse", "_blank");
                    }}
                  >
                    Discord
                  </button>
                </div>
              </div>
            </CardItem>
          </motion.div>
        </CardBody>
      </CardContainer>

      {/* Contact Form */}
      <CardContainer className="inter-var w-full">
        <CardBody className="relative group/input w-full">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4 bg-background/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] items-center justify-center
              hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <CardItem translateX="-5" translateY="-3" translateZ="30">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">Send us a Message</h2>
                <p className="text-default-500 text-sm">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>
            </CardItem>

            <form
              noValidate
              className="space-y-4 w-full"
              onSubmit={handleSubmit}
            >
              <CardContainer className="inter-var w-full">
                <CardBody className="relative group/input w-full space-y-6">
                  {/* Name Input */}
                  <div className="relative">
                    <CardItem
                      className="w-full"
                      translateX="-10"
                      translateY="-5"
                      translateZ="50"
                    >
                      <input
                        required
                        aria-describedby={
                          errors.name ? "name-error" : undefined
                        }
                        aria-invalid={!!errors.name}
                        className={inputClasses}
                        data-error={!!errors.name}
                        name="name"
                        placeholder="Your Name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <p
                          className="mt-2 text-sm text-red-500/90"
                          id="name-error"
                        >
                          {errors.name}
                        </p>
                      )}
                    </CardItem>
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <CardItem
                      className="w-full"
                      translateX="-10"
                      translateY="-5"
                      translateZ="50"
                    >
                      <input
                        required
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        aria-invalid={!!errors.email}
                        className={inputClasses}
                        data-error={!!errors.email}
                        name="email"
                        placeholder="Your Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <p
                          className="mt-2 text-sm text-red-500/90"
                          id="email-error"
                        >
                          {errors.email}
                        </p>
                      )}
                    </CardItem>
                  </div>

                  {/* Subject Input */}
                  <div className="relative">
                    <CardItem
                      className="w-full"
                      translateX="-10"
                      translateY="-5"
                      translateZ="50"
                    >
                      <input
                        required
                        aria-describedby={
                          errors.subject ? "subject-error" : undefined
                        }
                        aria-invalid={!!errors.subject}
                        className={inputClasses}
                        data-error={!!errors.subject}
                        name="subject"
                        placeholder="Subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                      {errors.subject && (
                        <p
                          className="mt-2 text-sm text-red-500/90"
                          id="subject-error"
                        >
                          {errors.subject}
                        </p>
                      )}
                    </CardItem>
                  </div>

                  {/* Message Input */}
                  <div className="relative">
                    <CardItem
                      className="w-full"
                      translateX="-10"
                      translateY="-5"
                      translateZ="50"
                    >
                      <textarea
                        required
                        aria-describedby={
                          errors.message ? "message-error" : undefined
                        }
                        aria-invalid={!!errors.message}
                        className={inputClasses + " min-h-[100px] resize-y"}
                        data-error={!!errors.message}
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                      />
                      {errors.message && (
                        <p
                          className="mt-2 text-sm text-red-500/90"
                          id="message-error"
                        >
                          {errors.message}
                        </p>
                      )}
                    </CardItem>
                  </div>

                  {/* Submit Button */}
                  <div className="relative">
                    <CardItem
                      className="w-full"
                      translateX="-10"
                      translateY="-5"
                      translateZ="50"
                    >
                      <button
                        className={buttonClasses}
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </form>
          </motion.div>
        </CardBody>
      </CardContainer>
    </section>
  );
};
