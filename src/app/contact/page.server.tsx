import { metadata } from "./metadata";
import ContactClient from "./page.client";

export { metadata };

export default function ContactPage() {
  // Since contact page doesn't need any server-side data fetching,
  // we can use Next.js's built-in loading.tsx
  return <ContactClient />;
}
