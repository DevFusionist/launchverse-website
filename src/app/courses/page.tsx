import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data - In a real app, this would come from an API/database
const courses = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    description: 'Master modern web development with React, Node.js, and MongoDB',
    duration: '6 months',
    level: 'Beginner to Advanced',
    category: 'Web Development',
    price: '₹49,999',
    image: '/courses/web-dev.jpg',
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
    image: '/courses/data-science.jpg',
    tags: ['Python', 'ML', 'AI', 'Data Analysis'],
  },
  {
    id: 3,
    title: 'Digital Marketing Masterclass',
    description: 'Comprehensive digital marketing training with practical projects',
    duration: '4 months',
    level: 'Beginner',
    category: 'Marketing',
    price: '₹29,999',
    image: '/courses/digital-marketing.jpg',
    tags: ['SEO', 'Social Media', 'Content Marketing'],
  },
  {
    id: 4,
    title: 'UI/UX Design Fundamentals',
    description: 'Master the art of creating beautiful and functional user interfaces',
    duration: '3 months',
    level: 'Beginner',
    category: 'Design',
    price: '₹39,999',
    image: '/courses/ui-ux.jpg',
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
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Courses</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover our comprehensive training programs designed to launch your career
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all-categories">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all-levels">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level.toLowerCase().replace(' ', '-')}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col overflow-hidden">
            <div className="aspect-video w-full bg-muted" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <CardTitle className="mt-2 line-clamp-2">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 border-t bg-muted/50 p-4">
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-medium">{course.duration}</span>
                <span className="text-lg font-bold">{course.price}</span>
              </div>
              <Button className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 