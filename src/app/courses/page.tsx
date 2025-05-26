'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, Loader2, ChevronRight, Clock, Users, GraduationCap } from 'lucide-react';
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
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  AnimatedBadge,
  AnimatedInput,
} from '@/components/ui/enhanced-motion';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Update the course type to match the actual data structure
type Course = {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  category: string;
  fee: number;
  status: 'ACTIVE' | 'UPCOMING' | 'INACTIVE';
  _count: {
    enrollments: number;
    certificates: number;
  };
};

// Update the mock data to match the new type
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Web Development Bootcamp',
    description: 'Learn modern web development from scratch',
    duration: 12,
    level: 'Beginner',
    category: 'Web Development',
    fee: 29999,
    status: 'ACTIVE',
    _count: {
      enrollments: 150,
      certificates: 45
    }
  },
  // ... update other mock courses similarly ...
];

const categories = [
  'All Categories',
  'Web Development',
  'Data Science',
  'Marketing',
  'Design',
];

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

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

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const router = useRouter();

  // Filter courses based on search query and filters
  const filteredCourses: Course[] = useMemo(() => {
    return mockCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === 'all' || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

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
            Explore Courses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Discover our comprehensive range of courses designed to help you succeed
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
                  Find Your Course
                </CardTitle>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                          "pl-9 transition-all duration-200",
                          "focus:ring-2 focus:ring-primary/20",
                          "hover:border-primary/50"
                        )}
                      />
                    </MotionDiv>
                  </MotionDiv>
                  <MotionDiv
                    variants={fadeIn}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className={cn(
                        "w-[180px] transition-all duration-200",
                        "hover:border-primary/50",
                        "focus:ring-2 focus:ring-primary/20"
                      )}>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Marketing">Digital Marketing</SelectItem>
                        <SelectItem value="Design">UI/UX Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </MotionDiv>
                </div>
              </div>
            </CardHeader>
          </Card>
        </AnimatedSection>

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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
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
                        <CardTitle className="line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration} weeks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{course._count.enrollments} students</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span>{course._count.certificates} graduates</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="secondary"
                              className={cn(
                                course.status === 'ACTIVE' && 'bg-green-500/10 text-green-500',
                                course.status === 'UPCOMING' && 'bg-blue-500/10 text-blue-500',
                                'transition-all duration-200 group-hover:scale-105'
                              )}
                            >
                              {course.status}
                            </Badge>
                            <MotionDiv
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Button
                                variant="ghost"
                                className="group-hover:text-primary"
                                onClick={() => router.push(`/courses/${course.id}`)}
                              >
                                View Details
                                <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                              </Button>
                            </MotionDiv>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
