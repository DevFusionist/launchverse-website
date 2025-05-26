import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

// Mock blog data - in a real app, this would come from a CMS or database
const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Software Development',
    content: `
      Artificial Intelligence is revolutionizing the software development landscape in unprecedented ways. From automated code generation to intelligent debugging, AI tools are becoming indispensable for modern developers.

      ## The Rise of AI-Powered Development Tools

      Tools like GitHub Copilot and Amazon CodeWhisperer are changing how developers write code. These AI assistants can:
      - Generate code snippets based on natural language descriptions
      - Suggest optimizations and improvements
      - Help with debugging by analyzing code patterns
      - Automate repetitive coding tasks

      ## Impact on Developer Productivity

      Studies show that AI-powered tools can increase developer productivity by up to 30%. However, it's important to note that these tools are meant to augment human developers, not replace them. The key is to use AI as a collaborative partner that helps us focus on creative problem-solving.

      ## Future Trends

      Looking ahead, we can expect:
      1. More sophisticated code generation capabilities
      2. Better integration with existing development workflows
      3. Enhanced security analysis and vulnerability detection
      4. Improved natural language understanding for code documentation

      ## Preparing for the AI-Driven Future

      As the industry evolves, developers should:
      - Stay updated with AI tools and their capabilities
      - Focus on higher-level problem-solving skills
      - Learn to effectively collaborate with AI systems
      - Understand the ethical implications of AI in software development

      The future of software development is not about competing with AI, but rather about leveraging it to build better, more efficient, and more innovative solutions.
    `,
    author: 'Dr. Sarah Johnson',
    category: 'Industry Trends',
    date: '2024-03-15',
    readTime: '5 min read',
    image: '/blog/ai-software-dev.jpg',
    tags: ['AI', 'Software Development', 'Future Tech', 'Productivity'],
  },
  // ... other blog posts
];

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === parseInt(params.id));

  if (!post) {
    notFound();
  }

  return (
    <div className="container py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href={ROUTES.blog} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
          {/* In a real app, use Next.js Image component */}
          <div className="h-full w-full bg-muted" />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('##')) {
              return (
                <h2 key={index} className="mt-8 text-2xl font-bold">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('-')) {
              return (
                <ul key={index} className="list-disc pl-6">
                  {paragraph
                    .split('\n')
                    .filter((line) => line.startsWith('-'))
                    .map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                </ul>
              );
            }
            if (paragraph.startsWith('1.')) {
              return (
                <ol key={index} className="list-decimal pl-6">
                  {paragraph
                    .split('\n')
                    .filter((line) => /^\d+\./.test(line))
                    .map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                </ol>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Author Bio */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted" />
              <div>
                <h3 className="font-semibold">{post.author}</h3>
                <p className="text-sm text-muted-foreground">
                  Director of Education at Launch Verse
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
