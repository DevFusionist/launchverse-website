import { Metadata } from "next";

import { title, subtitle } from "@/components/primitives";
import { ContactFormSection } from "@/components/contact-form-section";

export const metadata: Metadata = {
  title:
    "Contact Launch Verse Academy | Visit Our Kolkata Center or Call Today",
  description:
    "Have questions? Visit Launch Verse Academy at Tentul Tala Lane, Mankundu or call us at 7001478078 / 7508162363. Our expert team is available 9 AM – 10 PM to guide you on admissions, courses, and career paths.",
  keywords:
    "contact launch verse academy, computer institute near me, visit computer training center kolkata, computer course enquiry kolkata, launch verse location, ms office course enquiry kolkata, web designing admission kolkata",
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
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;re here to help! Whether you have questions about our
            courses, need assistance with enrollment, or want to learn more
            about our training programs, our team is ready to assist you. Fill
            out the form below, and we&apos;ll get back to you as soon as
            possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactFormSection />
    </main>
  );
}
