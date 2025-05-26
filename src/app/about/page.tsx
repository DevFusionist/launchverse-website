import { Metadata } from 'next';
import AboutClient from './about-client';

export const metadata: Metadata = {
  title: 'About Launch Verse Academy | Empowering Careers in Hooghly',
  description: 'Learn about our mission to provide quality education and skill development in Hooghly. Meet our dedicated team committed to your success.',
  keywords: [
    // Primary Keywords
    'About Launch Verse Academy',
    'Training Institute Hooghly',
    'Skill Development Hooghly',
    'Educational Mission',
    'Career Development Hooghly',
    // Secondary Keywords
    'Web Development Training Hooghly',
    'Graphic Design Course Hooghly',
    'MS Office Classes Hooghly',
    'Professional Courses Hooghly',
    'Career Training Programs',
    // Long-Tail Keywords
    'Best Training Institute in Hooghly for Web Development',
    'Affordable Graphic Design Courses in Hooghly',
    'Advanced MS Office Training for Professionals in Hooghly',
    'Top-Rated Career Development Programs in Hooghly',
    'Skill Enhancement Courses in Hooghly'
  ].join(', '),
  openGraph: {
    title: 'About Launch Verse Academy | Empowering Careers in Hooghly',
    description: 'Learn about our mission to provide quality education and skill development in Hooghly. Meet our dedicated team committed to your success.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Launch Verse Academy | Empowering Careers in Hooghly',
    description: 'Learn about our mission to provide quality education and skill development in Hooghly. Meet our dedicated team committed to your success.',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
