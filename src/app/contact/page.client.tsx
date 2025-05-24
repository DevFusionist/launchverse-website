"use client";

import { motion } from "framer-motion";
import { textReveal } from "@/lib/animations";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { AnimatedFormField } from "@/components/ui/AnimatedForm";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ContactFormData } from "@/types";

function ContactJsonLd() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Launch Verse Academy Contact",
    description:
      "Contact Launch Verse Academy for computer courses in Chandannagar. Get in touch via WhatsApp, phone, or email for course inquiries and enrollment.",
    url: "https://scriptauradev.com/contact",
    mainEntity: {
      "@type": "Organization",
      name: "Launch Verse Academy",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-7001478078",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Bengali", "Hindi"],
          contactOption: "WhatsApp",
        },
        {
          "@type": "ContactPoint",
          telephone: "+91-7508162363",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Bengali", "Hindi"],
          contactOption: ["WhatsApp", "VoiceCall"],
        },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chandannagar",
        addressRegion: "West Bengal",
        postalCode: "712136",
        addressCountry: "IN",
      },
      openingHours: "Mo-Su 09:00-22:00",
    },
  };

  return (
    <Script
      id="contact-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
    />
  );
}

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactClientProps = Record<never, never>;

const whatsappMessage = encodeURIComponent(
  "Hi Launch Verse Academy! I am interested to know more."
);
const businessWhatsAppNumber = "7001478078";
const personalWhatsAppNumber = "7508162363";

export default function ContactClient({}: ContactClientProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  };

  return (
    <>
      <ContactJsonLd />
      <AnimatedLayout>
        <div className="bg-neon-background-light dark:bg-neon-background-dark py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={textReveal}
            >
              <h1 className="text-3xl font-bold tracking-tight text-neon-text-light dark:text-neon-text-dark sm:text-4xl">
                Contact Us
              </h1>
              <p className="mt-2 text-lg leading-8 text-neon-text-light/80 dark:text-neon-text-dark/80">
                Have questions? We&apos;d love to hear from you. Send us a
                message and we&apos;ll respond as soon as possible.
              </p>
            </motion.div>

            <motion.div
              className="mx-auto mt-16 max-w-xl"
              variants={textReveal}
            >
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="rounded-lg border border-neon-primary/20 dark:border-neon-primary-dark/20 bg-neon-card-light dark:bg-neon-card-dark p-6">
                  <h3 className="text-base font-semibold leading-7 text-neon-text-light dark:text-neon-text-dark">
                    Business WhatsApp
                  </h3>
                  <p className="mt-2 text-base leading-7 text-neon-text-light/80 dark:text-neon-text-dark/80">
                    <a
                      href={`https://wa.me/${businessWhatsAppNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-primary dark:text-neon-primary-dark underline hover:text-neon-primary-dark dark:hover:text-neon-primary transition-colors inline-flex items-center gap-2"
                      aria-label={`Contact us on WhatsApp at ${businessWhatsAppNumber}`}
                    >
                      <span>{businessWhatsAppNumber}</span>
                      <span className="sr-only">(Opens in new tab)</span>
                    </a>
                  </p>
                </div>
                <div className="rounded-lg border border-neon-primary/20 dark:border-neon-primary-dark/20 bg-neon-card-light dark:bg-neon-card-dark p-6">
                  <h3 className="text-base font-semibold leading-7 text-neon-text-light dark:text-neon-text-dark">
                    WhatsApp/Calls
                  </h3>
                  <p className="mt-2 text-base leading-7 text-neon-text-light/80 dark:text-neon-text-dark/80">
                    <a
                      href={`tel:${personalWhatsAppNumber}`}
                      className="text-neon-primary dark:text-neon-primary-dark underline hover:text-neon-primary-dark dark:hover:text-neon-primary transition-colors inline-flex items-center gap-2"
                      aria-label={`Call us at ${personalWhatsAppNumber}`}
                    >
                      <span>{personalWhatsAppNumber}</span>
                      <span className="sr-only">(Opens phone dialer)</span>
                    </a>
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 space-y-6"
              >
                <AnimatedFormField>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-neon-text-light dark:text-neon-text-dark"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-neon-text-light dark:text-neon-text-dark shadow-sm ring-1 ring-inset ring-neon-primary/20 dark:ring-neon-primary-dark/20 bg-neon-card-light dark:bg-neon-card-dark focus:ring-2 focus:ring-inset focus:ring-neon-primary dark:focus:ring-neon-primary-dark sm:text-sm sm:leading-6"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </AnimatedFormField>

                <AnimatedFormField>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-neon-text-light dark:text-neon-text-dark"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-neon-text-light dark:text-neon-text-dark shadow-sm ring-1 ring-inset ring-neon-primary/20 dark:ring-neon-primary-dark/20 bg-neon-card-light dark:bg-neon-card-dark focus:ring-2 focus:ring-inset focus:ring-neon-primary dark:focus:ring-neon-primary-dark sm:text-sm sm:leading-6"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </AnimatedFormField>

                <AnimatedFormField>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-neon-text-light dark:text-neon-text-dark"
                  >
                    Phone
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-neon-text-light dark:text-neon-text-dark shadow-sm ring-1 ring-inset ring-neon-primary/20 dark:ring-neon-primary-dark/20 bg-neon-card-light dark:bg-neon-card-dark focus:ring-2 focus:ring-inset focus:ring-neon-primary dark:focus:ring-neon-primary-dark sm:text-sm sm:leading-6"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </AnimatedFormField>

                <AnimatedFormField>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium leading-6 text-neon-text-light dark:text-neon-text-dark"
                  >
                    Message
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="message"
                      rows={4}
                      {...register("message")}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-neon-text-light dark:text-neon-text-dark shadow-sm ring-1 ring-inset ring-neon-primary/20 dark:ring-neon-primary-dark/20 bg-neon-card-light dark:bg-neon-card-dark focus:ring-2 focus:ring-inset focus:ring-neon-primary dark:focus:ring-neon-primary-dark sm:text-sm sm:leading-6"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                </AnimatedFormField>

                <AnimatedFormField>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-neon-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-neon-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </AnimatedFormField>
              </form>
            </motion.div>
          </div>
        </div>
      </AnimatedLayout>
    </>
  );
}
