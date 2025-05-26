import { Metadata } from 'next';
import BlogClient from './blog-client';

export const metadata: Metadata = {
  title: 'Insights & Tips | Launch Verse Academy Blog',
  description: 'Stay updated with the latest trends, tips, and insights in technology, design, and professional development through our expert-written blogs.',
  keywords: [
    // Primary Keywords
    'Education Blog Hooghly',
    'Tech Trends',
    'Design Tips',
    'Career Advice',
    'Professional Development Articles',
    // Secondary Keywords
    'Web Development Insights',
    'Graphic Design Trends',
    'MS Office Tips',
    'Digital Skills Enhancement',
    'Learning Resources Hooghly',
    // Long-Tail Keywords
    'Latest Web Development Trends in Hooghly',
    'Effective Graphic Design Techniques for Beginners',
    'Comprehensive MS Office Tutorials for Professionals',
    'Strategies for Career Advancement in Tech Industry',
    'Professional Development Workshops in Hooghly'
  ].join(', '),
  openGraph: {
    title: 'Insights & Tips | Launch Verse Academy Blog',
    description: 'Stay updated with the latest trends, tips, and insights in technology, design, and professional development through our expert-written blogs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights & Tips | Launch Verse Academy Blog',
    description: 'Stay updated with the latest trends, tips, and insights in technology, design, and professional development through our expert-written blogs.',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
