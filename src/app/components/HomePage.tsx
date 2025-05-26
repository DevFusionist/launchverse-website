'use client';

import Link from 'next/link';
import {
  ArrowRight,
  GraduationCap,
  Award,
  Users,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import {
  AnimatedSection,
  ParallaxSection,
  AnimatedCard,
  AnimatedButtonWrapper,
  AnimatedIcon,
  PageTransition,
} from '@/components/ui/motion';

const features = [
  {
    name: 'Expert-Led Courses',
    description:
      'Learn from industry experts with years of practical experience in their fields.',
    icon: GraduationCap,
  },
  {
    name: 'Certified Programs',
    description:
      'Earn recognized certificates that validate your skills and knowledge.',
    icon: Award,
  },
  {
    name: 'Career Support',
    description:
      'Get placement assistance and career guidance to help you succeed.',
    icon: Briefcase,
  },
  {
    name: 'Community Learning',
    description: 'Join a vibrant community of learners and grow together.',
    icon: Users,
  },
];

export default function HomePage() {
  return (
    <PageTransition>
      <div className="flex flex-col gap-16">
        {/* Hero Section with Parallax */}
        <ParallaxSection
          speed={0.2}
          className="relative overflow-hidden bg-background py-20 sm:py-32"
        >
          <div className="container relative">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Launch Your Career with{' '}
                <span className="text-primary">Launch Verse</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Transform your future with our industry-leading training
                programs. Get certified, get placed, and get ahead in your
                career.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <AnimatedButtonWrapper>
                  <Button asChild size="lg">
                    <Link href={ROUTES.courses}>
                      Explore Courses
                      <AnimatedIcon className="ml-2">
                        <ArrowRight className="h-4 w-4" />
                      </AnimatedIcon>
                    </Link>
                  </Button>
                </AnimatedButtonWrapper>
                <AnimatedButtonWrapper>
                  <Button variant="outline" size="lg" asChild>
                    <Link href={ROUTES.contact}>Contact Us</Link>
                  </Button>
                </AnimatedButtonWrapper>
              </div>
            </AnimatedSection>
          </div>
        </ParallaxSection>

        {/* Features Section */}
        <section className="container py-20">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Launch Verse?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide comprehensive training programs designed to help you
              succeed in your career.
            </p>
          </AnimatedSection>
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <AnimatedSection
                  key={feature.name}
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedCard>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary/80" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </AnimatedCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-20">
          <AnimatedSection className="relative overflow-hidden rounded-lg bg-primary px-6 py-16 sm:px-12 sm:py-24">
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to Start Your Journey?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join thousands of successful graduates who have transformed
                their careers with Launch Verse.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <AnimatedButtonWrapper>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="relative overflow-hidden bg-background text-foreground hover:bg-background/90"
                    asChild
                  >
                    <Link href={ROUTES.courses}>
                      Get Started
                      <AnimatedIcon className="ml-2">
                        <ArrowRight className="h-4 w-4" />
                      </AnimatedIcon>
                    </Link>
                  </Button>
                </AnimatedButtonWrapper>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </div>
    </PageTransition>
  );
} 