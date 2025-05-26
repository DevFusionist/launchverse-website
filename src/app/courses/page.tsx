import { Metadata } from 'next';
import CoursesPage from '../components/CoursesPage';

export const metadata: Metadata = {
  title: 'Professional Courses in Web Development, Graphic Design & MS Office | Launch Verse Academy Hooghly',
  description: 'Advance your career with expert-led courses in Web Development, Graphic Design, and MS Office at Launch Verse Academy, Hooghly\'s premier training institute. Enroll now for hands-on training and placement support.',
  keywords: [
    // Primary Keywords
    'Web Development Course Hooghly',
    'Graphic Design Training Hooghly',
    'MS Office Classes Hooghly',
    'Best Training Institute in Hooghly',
    'Career Development Courses Hooghly',
    // Secondary Keywords
    'HTML CSS Training Hooghly',
    'Adobe Photoshop Course Hooghly',
    'Microsoft Excel Training Hooghly',
    'Responsive Web Design Hooghly',
    'UI/UX Design Course Hooghly',
    // Long-Tail Keywords
    'Best Web Development Institute in Hooghly with Placement',
    'Affordable Graphic Design Courses in Hooghly',
    'Advanced MS Office Training for Professionals in Hooghly',
    'Top-Rated Web Design Classes Near Me in Hooghly',
    'Professional Development Programs in Hooghly'
  ].join(', '),
  openGraph: {
    title: 'Professional Courses in Web Development, Graphic Design & MS Office | Launch Verse Academy Hooghly',
    description: 'Advance your career with expert-led courses in Web Development, Graphic Design, and MS Office at Launch Verse Academy, Hooghly\'s premier training institute. Enroll now for hands-on training and placement support.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Courses in Web Development, Graphic Design & MS Office | Launch Verse Academy Hooghly',
    description: 'Advance your career with expert-led courses in Web Development, Graphic Design, and MS Office at Launch Verse Academy, Hooghly\'s premier training institute. Enroll now for hands-on training and placement support.',
  },
};

export default function Courses() {
  return <CoursesPage />;
}
