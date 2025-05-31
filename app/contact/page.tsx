import { Metadata } from "next";

import { title, subtitle } from "@/components/primitives";
import { ContactFormSection } from "@/components/contact-form-section";

export const metadata: Metadata = {
  title: "Contact Us | LaunchVerse Academy",
  description:
    "Get in touch with LaunchVerse Academy. We're here to help with your questions about our courses, career guidance, or enrollment process.",
  keywords: [
    "contact",
    "support",
    "help",
    "enrollment",
    "career guidance",
    "LaunchVerse Academy",
  ],
};

export default function ContactPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-8 py-8 md:py-16">
      {/* Hero Section */}
      <section className="inline-block max-w-3xl text-center justify-center">
        <h1 className={title({ size: "lg" })}>
          Get in&nbsp;
          <span className="relative inline-block">
            <span className="text-violet-600 font-bold relative z-10">
              Touch
            </span>
            <span className="absolute -inset-1 blur-lg bg-gradient-to-r from-violet-400 to-purple-400 opacity-50 -z-10" />
            <span className="absolute inset-0 bg-gradient-to-r from-violet-200 to-purple-200 opacity-30 -z-20" />
          </span>
        </h1>
        <div className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
          Have questions about our courses or need career guidance? We&apos;re
          here to help! Fill out the form below and our team will get back to
          you shortly.
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactFormSection />
    </main>
  );
}
