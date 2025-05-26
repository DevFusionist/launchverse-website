'use client';

import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  AnimatedSection,
  ParallaxSection,
  fadeIn,
  slideIn,
  scaleIn,
  staggerContainer,
  staggerItem,
} from '@/components/ui/motion';
import {
  AnimatedButton,
  AnimatedBadge,
  AnimatedIcon,
} from '@/components/ui/enhanced-motion';
import { ROUTES } from '@/lib/constants';
import { Calendar, Clock, Tag, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Using the same mock data as the blog listing page
const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Software Development',
    excerpt:
      'Explore how artificial intelligence is transforming the software development landscape and what it means for aspiring developers.',
    content: `Artificial Intelligence (AI) is revolutionizing the software development landscape in unprecedented ways. From automated code generation to intelligent debugging, AI tools are becoming indispensable for modern developers.

Key areas where AI is making an impact:

1. Code Generation and Completion
- AI-powered tools like GitHub Copilot are helping developers write code faster
- Intelligent code suggestions based on context and best practices
- Automated boilerplate code generation

2. Testing and Quality Assurance
- Automated test case generation
- Intelligent bug detection and fixing
- Performance optimization suggestions

3. Documentation and Knowledge Management
- Automated documentation generation
- Smart code commenting
- Intelligent knowledge base creation

The future of software development will increasingly rely on AI as a collaborative partner, enhancing developer productivity while maintaining code quality.`,
    category: 'Industry Trends',
    date: '2024-03-15',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    tags: ['AI', 'Software Development', 'Future Tech', 'Programming'],
  },
  {
    id: 2,
    title: 'Student Success Story: From Beginner to Full Stack Developer',
    excerpt:
      'Meet Sarah, who transformed her career from a non-tech background to becoming a successful full stack developer in just 6 months.',
    content: `Sarah's journey from a non-technical background to becoming a full-stack developer is nothing short of inspiring. Starting with zero coding experience, she dedicated herself to learning and practicing every day.

Her Learning Path:

1. Foundation Building
- Started with HTML, CSS, and JavaScript basics
- Focused on understanding core programming concepts
- Built simple projects to reinforce learning

2. Full Stack Development
- Mastered React for frontend development
- Learned Node.js and Express for backend
- Implemented MongoDB for database management

3. Real-world Projects
- Built a complete e-commerce platform
- Created a social media dashboard
- Developed a task management application

Today, Sarah works as a full-stack developer at a leading tech company, proving that with dedication and the right guidance, anyone can transition into tech.`,
    category: 'Success Stories',
    date: '2024-03-10',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
    tags: ['Success Story', 'Career Change', 'Web Development', 'Learning'],
  },
  // ... other blog posts
];

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [isSharing, setIsSharing] = useState(false);
  const post = blogPosts.find((p) => p.id === parseInt(params.id));

  if (!post) {
    notFound();
  }

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } catch (err) {
      toast({
        title: "Couldn't share",
        description: 'Sharing is not supported on this browser.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
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
            <div className="flex items-center justify-between">
              <AnimatedButton variant="ghost" asChild className="mb-8">
                <Link href={ROUTES.blog} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
              </AnimatedButton>
              <AnimatedButton
                variant="ghost"
                size="icon"
                onClick={handleShare}
                disabled={isSharing}
              >
                <AnimatedIcon>
                  <Share2 className="h-4 w-4" />
                </AnimatedIcon>
              </AnimatedButton>
            </div>
          </AnimatedSection>
          <div className="grid gap-8 md:grid-cols-2">
            <AnimatedSection
              variants={scaleIn}
              className="relative aspect-video overflow-hidden rounded-lg"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </AnimatedSection>
            <AnimatedSection
              variants={staggerContainer}
              className="flex flex-col justify-center"
            >
              <AnimatedSection variants={staggerItem}>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <AnimatedBadge variant="outline">
                    {post.category}
                  </AnimatedBadge>
                  <span className="flex items-center gap-1">
                    <AnimatedIcon>
                      <Calendar className="h-4 w-4" />
                    </AnimatedIcon>
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <AnimatedIcon>
                      <Clock className="h-4 w-4" />
                    </AnimatedIcon>
                    {post.readTime}
                  </span>
                </div>
              </AnimatedSection>
              <AnimatedSection variants={staggerItem}>
                <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  {post.title}
                </h1>
              </AnimatedSection>
              <AnimatedSection variants={staggerItem}>
                <p className="mt-4 text-lg text-muted-foreground">
                  {post.excerpt}
                </p>
              </AnimatedSection>
              <AnimatedSection variants={staggerItem}>
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <AnimatedBadge
                      key={tag}
                      variant="secondary"
                      custom={index}
                      variants={slideIn}
                    >
                      {tag}
                    </AnimatedBadge>
                  ))}
                </div>
              </AnimatedSection>
            </AnimatedSection>
          </div>
        </div>
      </ParallaxSection>

      {/* Content Section */}
      <section className="container">
        <div className="mx-auto max-w-3xl">
          <AnimatedSection variants={fadeIn}>
            <Card className="overflow-hidden">
              <CardContent className="prose prose-lg dark:prose-invert max-w-none py-8">
                {post.content.split('\n\n').map((paragraph, index) => {
                  // Handle different types of content
                  if (paragraph.startsWith('1.')) {
                    return (
                      <AnimatedSection
                        key={index}
                        variants={slideIn}
                        custom={index}
                        className="mt-4"
                      >
                        <ol className="list-decimal pl-6">
                          {paragraph
                            .split('\n')
                            .filter((line) => /^\d+\./.test(line))
                            .map((item, i) => (
                              <li key={i} className="mt-2">
                                {item.replace(/^\d+\.\s*/, '')}
                              </li>
                            ))}
                        </ol>
                      </AnimatedSection>
                    );
                  }
                  if (paragraph.startsWith('-')) {
                    return (
                      <AnimatedSection
                        key={index}
                        variants={slideIn}
                        custom={index}
                        className="mt-4"
                      >
                        <ul className="list-disc pl-6">
                          {paragraph
                            .split('\n')
                            .filter((line) => line.startsWith('-'))
                            .map((item, i) => (
                              <li key={i} className="mt-2">
                                {item.replace('- ', '')}
                              </li>
                            ))}
                        </ul>
                      </AnimatedSection>
                    );
                  }
                  return (
                    <AnimatedSection
                      key={index}
                      variants={fadeIn}
                      custom={index}
                      className="mt-4"
                    >
                      <p>{paragraph}</p>
                    </AnimatedSection>
                  );
                })}
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
