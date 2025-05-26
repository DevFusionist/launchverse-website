'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Calendar, Clock, Tag, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  AnimatedSection,
  ParallaxSection,
  fadeIn,
  slideIn,
  scaleIn,
  staggerContainer,
  staggerItem,
  buttonVariants,
  iconVariants,
  MotionDiv,
  PageTransition,
} from '@/components/ui/motion';
import {
  HoverCard,
  AnimatedButton,
  AnimatedIcon,
  AnimatedInput,
  AnimatedBadge,
} from '@/components/ui/enhanced-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

// Add these variants at the top level of the file
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.3
    }
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    image: string;
  };
  publishedAt: string;
  readTime: number;
  image: string;
  tags: string[];
};

export default function BlogPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/blog?page=${page}&search=${encodeURIComponent(debouncedSearch)}`
        );
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError('Failed to load blog posts');
        toast({
          title: 'Error',
          description: 'Failed to load blog posts',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [page, debouncedSearch]);

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
            className="text-3xl font-bold"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Latest insights, tutorials, and updates from our team
          </motion.p>
        </AnimatedSection>

        <AnimatedSection
          variants={slideIn}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                  Search Articles
                </CardTitle>
                <MotionDiv
                  variants={fadeIn}
                  className="relative flex-1 sm:w-64 z-30"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <MotionDiv
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <MotionDiv
                      initial={{ opacity: 0.5 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </MotionDiv>
                    <Input
                      placeholder="Search articles..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={cn(
                        "pl-9 transition-all duration-200",
                        "focus:ring-2 focus:ring-primary/20",
                        "hover:border-primary/50"
                      )}
                    />
                  </MotionDiv>
                </MotionDiv>
              </div>
            </CardHeader>
          </Card>
        </AnimatedSection>

        {isLoading ? (
          <AnimatedSection
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex justify-center py-8"
          >
            <MotionDiv
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-8 w-8 text-muted-foreground" />
            </MotionDiv>
          </AnimatedSection>
        ) : error ? (
          <AnimatedSection
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-red-500"
          >
            Failed to load blog posts
          </AnimatedSection>
        ) : !posts?.length ? (
          <AnimatedSection
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-muted-foreground"
          >
            No articles found
          </AnimatedSection>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Card className="h-full transition-all duration-300">
                    <CardHeader>
                      <div className="relative aspect-video overflow-hidden rounded-lg">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardTitle className="mt-4 line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime} min read</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="transition-all duration-200 group-hover:scale-105"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <MotionDiv
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-between group-hover:text-primary"
                            onClick={() => router.push(`/blog/${post.slug}`)}
                          >
                            Read More
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </Button>
                        </MotionDiv>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {totalPages > 1 && (
          <AnimatedSection
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <div className="flex justify-center gap-2">
              <MotionDiv
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={cn(
                    'transition-all duration-200',
                    'hover:bg-primary/10 hover:text-primary',
                    'active:scale-95'
                  )}
                >
                  Previous
                </Button>
              </MotionDiv>
              <MotionDiv
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={cn(
                    'transition-all duration-200',
                    'hover:bg-primary/10 hover:text-primary',
                    'active:scale-95'
                  )}
                >
                  Next
                </Button>
              </MotionDiv>
            </div>
          </AnimatedSection>
        )}
      </div>
    </PageTransition>
  );
}
