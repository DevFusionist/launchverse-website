import { Metadata } from 'next';
import ContactPage from '../components/ContactPage';

export const metadata: Metadata = {
  title: 'Contact Launch Verse Academy | Web, Graphic & Office Skills Training in Hooghly',
  description: 'Reach out to Launch Verse Academy in Hooghly for expert-led courses in Web Development, Graphic Design, and MS Office. Contact us today to start your learning journey.',
  keywords: [
    // Primary Keywords
    'Contact Launch Verse Academy',
    'Training Institute Hooghly Contact',
    'Web Development Course Inquiry Hooghly',
    'Graphic Design Training Hooghly',
    'MS Office Classes Hooghly',
    // Secondary Keywords
    'Hooghly Training Institute Contact',
    'Professional Courses Hooghly',
    'Career Development Programs Hooghly',
    'Skill Development Hooghly',
    'Educational Institute Hooghly',
    // Long-Tail Keywords
    'How to Enroll in Web Development Course in Hooghly',
    'Graphic Design Course Admission Hooghly',
    'MS Office Training Registration Hooghly',
    'Best Training Institute Contact Details Hooghly',
    'Launch Verse Academy Admission Process'
  ].join(', '),
  openGraph: {
    title: 'Contact Launch Verse Academy | Web, Graphic & Office Skills Training in Hooghly',
    description: 'Reach out to Launch Verse Academy in Hooghly for expert-led courses in Web Development, Graphic Design, and MS Office. Contact us today to start your learning journey.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Launch Verse Academy | Web, Graphic & Office Skills Training in Hooghly',
    description: 'Reach out to Launch Verse Academy in Hooghly for expert-led courses in Web Development, Graphic Design, and MS Office. Contact us today to start your learning journey.',
  },
};

export default function Contact() {
  return <ContactPage />;
}
