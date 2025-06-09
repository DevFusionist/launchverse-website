import { Metadata } from "next";
import { ContactPageClient } from "./contact-page-client";

export const metadata: Metadata = {
  title:
    "Contact Launch Verse Academy | Visit Our Kolkata Center or Call Today",
  description:
    "Have questions? Visit Launch Verse Academy at Tentul Tala Lane, Mankundu or call us at 7001478078 / 7508162363. Our expert team is available 9 AM – 10 PM to guide you on admissions, courses, and career paths.",
  keywords:
    "contact launch verse academy, computer institute near me, visit computer training center kolkata, computer course enquiry kolkata, launch verse location, ms office course enquiry kolkata, web designing admission kolkata",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
