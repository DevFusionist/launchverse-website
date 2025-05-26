'use client';

import {
  Award,
  Users,
  Target,
  Lightbulb,
  GraduationCap,
  Briefcase,
  BookOpen,
  ChevronRight,
  Star,
  Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  AnimatedSection,
  ParallaxSection,
  fadeIn,
  slideIn,
  scaleIn,
  buttonVariants,
  iconVariants,
  MotionDiv,
  PageTransition,
  staggerContainer,
  staggerItem,
} from '@/components/ui/motion';
import {
  HoverCard,
  AnimatedButton,
  AnimatedIcon,
  AnimatedBadge,
} from '@/components/ui/enhanced-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
    <PageTransition>
      <div className="container py-8">
        <AnimatedSection
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            Empowering the next generation of tech professionals
          </motion.p>
        </AnimatedSection>

        <AnimatedSection
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12"
        >
          <motion.div variants={staggerItem}>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                  Students
                </CardTitle>
                <MotionDiv
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-2xl font-bold"
                >
                  10,000+
                </MotionDiv>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                  Courses
                </CardTitle>
                <MotionDiv
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-2xl font-bold"
                >
                  50+
                </MotionDiv>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                  Graduates
                </CardTitle>
                <MotionDiv
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <GraduationCap className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-2xl font-bold"
                >
                  5,000+
                </MotionDiv>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                  Success Rate
                </CardTitle>
                <MotionDiv
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Award className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-2xl font-bold"
                >
                  95%
                </MotionDiv>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-2">
          <AnimatedSection
            variants={slideIn}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-sm max-w-none"
                >
                  <p>
                    We are dedicated to transforming lives through quality education and practical skills training.
                    Our mission is to bridge the gap between traditional education and industry requirements,
                    ensuring our students are job-ready from day one.
                  </p>
                </motion.div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <motion.div variants={staggerItem} className="flex items-start gap-2">
                    <MotionDiv
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Target className="h-5 w-5 text-primary" />
                    </MotionDiv>
                    <span>Industry-aligned curriculum</span>
                  </motion.div>
                  <motion.div variants={staggerItem} className="flex items-start gap-2">
                    <MotionDiv
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Star className="h-5 w-5 text-primary" />
                    </MotionDiv>
                    <span>Expert instructors</span>
                  </motion.div>
                  <motion.div variants={staggerItem} className="flex items-start gap-2">
                    <MotionDiv
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Heart className="h-5 w-5 text-primary" />
                    </MotionDiv>
                    <span>Student success focus</span>
                  </motion.div>
                  <motion.div variants={staggerItem} className="flex items-start gap-2">
                    <MotionDiv
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Award className="h-5 w-5 text-primary" />
                    </MotionDiv>
                    <span>Career support</span>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection
            variants={slideIn}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                  Our Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="grid gap-4"
                >
                  {team.map((member, index) => (
                    <motion.div
                      key={member.name}
                      variants={staggerItem}
                      className="flex items-center gap-4 rounded-lg border p-4 transition-all duration-200 hover:border-primary/50"
                    >
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <MotionDiv
                        whileHover={{ rotate: 90 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </MotionDiv>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
}
