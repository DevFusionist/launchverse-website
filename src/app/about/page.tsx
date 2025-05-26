'use client';

import {
  Award,
  Users,
  Target,
  Lightbulb,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  AnimatedSection,
  ParallaxSection,
  fadeIn,
  slideIn,
  scaleIn,
} from '@/components/ui/motion';
import {
  HoverCard,
  AnimatedButton,
  AnimatedIcon,
  AnimatedBadge,
} from '@/components/ui/enhanced-motion';

const values = [
  {
    title: 'Excellence in Education',
    description:
      'We are committed to delivering the highest quality education through industry-aligned curriculum and expert instructors.',
    icon: Award,
  },
  {
    title: 'Student Success',
    description:
      'Our primary focus is on student success, ensuring every learner achieves their career goals through personalized support.',
    icon: Users,
  },
  {
    title: 'Industry Relevance',
    description:
      'We continuously update our programs to match industry demands, preparing students for current and future job markets.',
    icon: Target,
  },
  {
    title: 'Innovation',
    description:
      'We embrace innovative teaching methods and technologies to provide an engaging and effective learning experience.',
    icon: Lightbulb,
  },
];

const achievements = [
  {
    number: '5000+',
    label: 'Graduates',
    icon: GraduationCap,
  },
  {
    number: '95%',
    label: 'Placement Rate',
    icon: Briefcase,
  },
  {
    number: '50+',
    label: 'Industry Partners',
    icon: Users,
  },
  {
    number: '15+',
    label: 'Years Experience',
    icon: Award,
  },
];

const team = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Founder & Director',
    bio: 'With over 20 years of experience in education and technology, Dr. Johnson leads our vision and strategy.',
    image: '/team/sarah.jpg',
  },
  {
    name: 'Michael Chen',
    role: 'Head of Academics',
    bio: 'A former tech industry leader, Michael ensures our curriculum stays current with industry trends.',
    image: '/team/michael.jpg',
  },
  {
    name: 'Priya Sharma',
    role: 'Placement Director',
    bio: 'Priya has helped thousands of students launch successful careers through her extensive industry network.',
    image: '/team/priya.jpg',
  },
  {
    name: 'David Kim',
    role: 'Technical Lead',
    bio: 'David brings 15 years of software development experience to our technical training programs.',
    image: '/team/david.jpg',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <ParallaxSection
        speed={0.2}
        className="relative overflow-hidden bg-background py-20 sm:py-32"
      >
        <div className="container relative">
          <AnimatedSection
            variants={fadeIn}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              About Launch Verse
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Empowering careers through quality education and industry-aligned
              training programs.
            </p>
          </AnimatedSection>
        </div>
      </ParallaxSection>

      {/* Values Section */}
      <section className="container">
        <AnimatedSection
          variants={fadeIn}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Values
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The core principles that guide our mission and drive our success.
          </p>
        </AnimatedSection>
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <AnimatedSection
                key={value.title}
                variants={slideIn}
                custom={index}
                transition={{ delay: index * 0.1 }}
              >
                <HoverCard className="text-center">
                  <AnimatedIcon className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </AnimatedIcon>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </HoverCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="container">
        <AnimatedSection
          variants={fadeIn}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Impact
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Numbers that reflect our commitment to student success and industry
            excellence.
          </p>
        </AnimatedSection>
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement, index) => (
              <AnimatedSection
                key={achievement.label}
                variants={slideIn}
                custom={index}
                transition={{ delay: index * 0.1 }}
              >
                <HoverCard className="text-center">
                  <AnimatedIcon className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <achievement.icon className="h-6 w-6 text-primary" />
                  </AnimatedIcon>
                  <div className="text-3xl font-bold text-primary">
                    {achievement.number}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {achievement.label}
                  </p>
                </HoverCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <AnimatedSection
          variants={scaleIn}
          className="relative overflow-hidden rounded-lg bg-primary px-6 py-16 sm:px-12 sm:py-24"
        >
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Join Our Community
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Take the first step towards a successful career with Launch Verse.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <AnimatedButton
                variant="secondary"
                size="lg"
                className="relative overflow-hidden bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <Link href={ROUTES.courses}>
                  Explore Courses
                  <AnimatedIcon className="ml-2">
                    <GraduationCap className="h-4 w-4" />
                  </AnimatedIcon>
                </Link>
              </AnimatedButton>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href={ROUTES.contact}>Contact Us</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
