'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  AnimatedInput,
} from '@/components/ui/enhanced-motion';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Mock data - In a real app, this would come from an API/database
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
  },
];

const categories = [
  'All Categories',
  'Web Development',
  'Data Science',
  'Marketing',
  'Design',
];

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Filter courses based on search query and filters
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === 'all' ||
        course.level.toLowerCase().includes(selectedLevel.toLowerCase());

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

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
              Explore Our Courses
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Discover our comprehensive range of industry-aligned courses
              designed to launch your career.
            </p>
          </AnimatedSection>
        </div>
      </ParallaxSection>

      {/* Search and Filter Section */}
      <section className="container">
        <AnimatedSection variants={fadeIn} className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row">
            <AnimatedInput className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </AnimatedInput>
            <div className="flex gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Design">UI/UX Design</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Courses Grid */}
      <section className="container">
        {filteredCourses.length === 0 ? (
          <AnimatedSection variants={fadeIn} className="py-12 text-center">
            <h3 className="text-lg font-medium text-muted-foreground">
              No courses found matching your criteria
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </AnimatedSection>
        ) : (
          <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <AnimatedSection
                key={course.id}
                variants={slideIn}
                custom={index}
                transition={{ delay: index * 0.1 }}
              >
                <HoverCard className="flex h-full flex-col">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1">
                        {course.title}
                      </CardTitle>
                      <AnimatedBadge variant="secondary">
                        {course.price}
                      </AnimatedBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <AnimatedBadge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </AnimatedBadge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-4">
                    <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                      <span>{course.duration}</span>
                      <span>{course.level}</span>
                    </div>
                    <AnimatedButton asChild className="w-full">
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex items-center justify-center"
                      >
                        Learn More
                        <AnimatedIcon className="ml-2">
                          <ArrowRight className="h-4 w-4" />
                        </AnimatedIcon>
                      </Link>
                    </AnimatedButton>
                  </CardFooter>
                </HoverCard>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
