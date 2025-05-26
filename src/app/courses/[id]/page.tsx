'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AnimatedSection,
  ParallaxSection,
  fadeIn,
  slideIn,
} from '@/components/ui/motion';
import {
  AnimatedButton,
  AnimatedIcon,
  AnimatedBadge,
} from '@/components/ui/enhanced-motion';
import { ROUTES } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';

// Using the same mock data for now - in a real app, this would come from an API/database
const courses = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    description:
      'Master modern web development with React, Node.js, and MongoDB',
    duration: '6 months',
    level: 'Beginner to Advanced',
    category: 'Web Development',
    price: '₹49,999',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    tags: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    syllabus: [
      'HTML5, CSS3, and Modern JavaScript',
      'React.js and Component Architecture',
      'Node.js and Express.js Backend Development',
      'MongoDB Database Design and Integration',
      'RESTful API Development',
      'Authentication and Authorization',
      'Deployment and DevOps Basics',
    ],
    requirements: [
      'Basic computer knowledge',
      'Familiarity with any programming language',
      'Dedication to learn and practice',
    ],
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning',
    description: 'Learn data analysis, machine learning, and AI fundamentals',
    duration: '8 months',
    level: 'Intermediate',
    category: 'Data Science',
    price: '₹69,999',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    tags: ['Python', 'ML', 'AI', 'Data Analysis'],
    syllabus: [
      'Python Programming Fundamentals',
      'Data Analysis with Pandas and NumPy',
      'Data Visualization with Matplotlib and Seaborn',
      'Machine Learning Algorithms',
      'Deep Learning with TensorFlow',
      'Natural Language Processing',
      'Computer Vision Basics',
    ],
    requirements: [
      'Basic programming knowledge',
      'Understanding of mathematics and statistics',
      'Analytical thinking',
    ],
  },
  {
    id: 3,
    title: 'Digital Marketing Masterclass',
    description:
      'Comprehensive digital marketing training with practical projects',
    duration: '4 months',
    level: 'Beginner',
    category: 'Marketing',
    price: '₹29,999',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    tags: ['SEO', 'Social Media', 'Content Marketing'],
    syllabus: [
      'Digital Marketing Fundamentals',
      'Search Engine Optimization (SEO)',
      'Social Media Marketing',
      'Content Marketing Strategy',
      'Email Marketing',
      'Google Analytics and Data Analysis',
      'Digital Advertising',
    ],
    requirements: [
      'Basic computer skills',
      'Good communication skills',
      'Interest in marketing and social media',
    ],
  },
  {
    id: 4,
    title: 'UI/UX Design Fundamentals',
    description:
      'Master the art of creating beautiful and functional user interfaces',
    duration: '3 months',
    level: 'Beginner',
    category: 'Design',
    price: '₹39,999',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2064&auto=format&fit=crop',
    tags: ['Figma', 'UI Design', 'UX Research'],
    syllabus: [
      'Design Principles and Elements',
      'User Research and Personas',
      'Wireframing and Prototyping',
      'UI Design with Figma',
      'User Experience Design',
      'Design Systems',
      'Portfolio Development',
    ],
    requirements: [
      'Basic computer skills',
      'Creativity and attention to detail',
      'Interest in design and user experience',
    ],
  },
];

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const course = courses.find((c) => c.id === parseInt(params.id));

  if (!course) {
    notFound();
  }

  const handleEnrollClick = () => {
    router.push(`${ROUTES.contact}?course=${encodeURIComponent(course.title)}`);
  };

  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <ParallaxSection
        speed={0.2}
        className="relative overflow-hidden bg-background py-20 sm:py-32"
      >
        <div className="container relative">
          <AnimatedSection variants={fadeIn}>
            <AnimatedButton variant="ghost" asChild className="mb-8">
              <Link href={ROUTES.courses} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </Link>
            </AnimatedButton>
          </AnimatedSection>
          <div className="grid gap-8 md:grid-cols-2">
            <AnimatedSection
              variants={slideIn}
              className="relative aspect-video"
            >
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="rounded-lg object-cover"
                priority
              />
            </AnimatedSection>
            <AnimatedSection
              variants={fadeIn}
              className="flex flex-col justify-center"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {course.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <AnimatedBadge key={tag} variant="secondary">
                    {tag}
                  </AnimatedBadge>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4">
                <AnimatedBadge variant="outline" className="text-lg">
                  {course.price}
                </AnimatedBadge>
                <AnimatedBadge variant="outline" className="text-lg">
                  {course.duration}
                </AnimatedBadge>
                <AnimatedBadge variant="outline" className="text-lg">
                  {course.level}
                </AnimatedBadge>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </ParallaxSection>

      {/* Course Details */}
      <section className="container pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          <AnimatedSection variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Course Syllabus</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.syllabus.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        <AnimatedSection variants={fadeIn} className="mt-8 text-center">
          <AnimatedButton
            size="lg"
            className="px-8"
            onClick={handleEnrollClick}
          >
            Contact for Enrollment
          </AnimatedButton>
        </AnimatedSection>
      </section>
    </div>
  );
}
