'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
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
  AnimatedInput,
  AnimatedBadge,
} from '@/components/ui/enhanced-motion';
import Image from 'next/image';

// Mock blog data - in a real app, this would come from a CMS or database
const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Software Development',
    excerpt:
      'Explore how artificial intelligence is transforming the software development landscape and what it means for aspiring developers.',
    category: 'Industry Trends',
    date: '2024-03-15',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Student Success Story: From Beginner to Full Stack Developer',
    excerpt:
      'Meet Sarah, who transformed her career from a non-tech background to becoming a successful full stack developer in just 6 months.',
    category: 'Success Stories',
    date: '2024-03-10',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Top 10 Skills Every Web Developer Needs in 2024',
    excerpt:
      'Discover the essential skills and technologies that are in high demand for web developers in the current job market.',
    category: 'Career Guide',
    date: '2024-03-05',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'How to Build a Strong Portfolio as a Junior Developer',
    excerpt:
      'Learn effective strategies for creating an impressive portfolio that will help you stand out in the competitive job market.',
    category: 'Career Guide',
    date: '2024-02-28',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
  },
];

const categories = [
  'All',
  'Industry Trends',
  'Success Stories',
  'Career Guide',
  'Technology',
  'Events',
];

export default function BlogPage() {
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
              Blog & News
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Stay updated with the latest industry trends, student success
              stories, and career insights.
            </p>
          </AnimatedSection>
        </div>
      </ParallaxSection>

      {/* Search and Filter Section */}
      <section className="container">
        <AnimatedSection variants={fadeIn} className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <AnimatedInput className="relative flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-9" />
              </div>
            </AnimatedInput>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <AnimatedSection
                  key={category}
                  variants={slideIn}
                  custom={index}
                  transition={{ delay: index * 0.05 }}
                >
                  <AnimatedButton
                    variant={category === 'All' ? 'default' : 'outline'}
                    size="sm"
                  >
                    {category}
                  </AnimatedButton>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Blog Posts Grid */}
      <section className="container">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <AnimatedSection
              key={post.id}
              variants={slideIn}
              custom={index}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`${ROUTES.blog}/${post.id}`}>
                <HoverCard className="h-full">
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <AnimatedBadge variant="outline" className="text-xs">
                        {post.category}
                      </AnimatedBadge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <AnimatedButton
                        variant="ghost"
                        size="sm"
                        className="group"
                      >
                        Read More
                        <AnimatedIcon className="ml-2">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </AnimatedIcon>
                      </AnimatedButton>
                    </div>
                  </CardContent>
                </HoverCard>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Pagination */}
      <section className="container">
        <AnimatedSection variants={fadeIn} className="mx-auto max-w-7xl">
          <div className="flex justify-center gap-2">
            <AnimatedButton variant="outline" disabled>
              Previous
            </AnimatedButton>
            <AnimatedButton variant="outline">1</AnimatedButton>
            <AnimatedButton variant="outline">2</AnimatedButton>
            <AnimatedButton variant="outline">3</AnimatedButton>
            <AnimatedButton variant="outline">Next</AnimatedButton>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
