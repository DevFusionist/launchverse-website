import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

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
    image: '/blog/ai-software-dev.jpg',
  },
  {
    id: 2,
    title: 'Student Success Story: From Beginner to Full Stack Developer',
    excerpt:
      'Meet Sarah, who transformed her career from a non-tech background to becoming a successful full stack developer in just 6 months.',
    category: 'Success Stories',
    date: '2024-03-10',
    readTime: '4 min read',
    image: '/blog/student-success.jpg',
  },
  {
    id: 3,
    title: 'Top 10 Skills Every Web Developer Needs in 2024',
    excerpt:
      'Discover the essential skills and technologies that are in high demand for web developers in the current job market.',
    category: 'Career Guide',
    date: '2024-03-05',
    readTime: '6 min read',
    image: '/blog/web-dev-skills.jpg',
  },
  {
    id: 4,
    title: 'How to Build a Strong Portfolio as a Junior Developer',
    excerpt:
      'Learn effective strategies for creating an impressive portfolio that will help you stand out in the competitive job market.',
    category: 'Career Guide',
    date: '2024-02-28',
    readTime: '5 min read',
    image: '/blog/portfolio-tips.jpg',
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
    <div className="container py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Blog & News</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Stay updated with the latest industry trends, student success stories,
          and career insights.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search articles..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.id} href={`${ROUTES.blog}/${post.id}`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <div className="aspect-[16/9] w-full bg-muted" />
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center gap-2">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button variant="outline">1</Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
}
