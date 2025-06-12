"use client";

import Image from "next/image";
import Link from "next/link";

interface BlogPostClientProps {
  post: any;
  relatedPosts: any[];
}

export function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter submission logic here
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{post.title}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {post.category}
            </span>
            <span className="mx-2">•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-gray-600">{post.description}</p>
          <div className="mt-4 flex items-center">
            <Image
              alt={post.author.name}
              className="rounded-full"
              height={40}
              src="/logo.png"
              width={40}
            />
            <div className="ml-3">
              <p className="font-medium">{post.author.name}</p>
              <a
                className="text-sm text-blue-600 hover:underline"
                href={post.author.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit Website
              </a>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <Image
            alt={post.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={post.image}
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {/* In a real app, this would be the actual blog content */}
          <p>
            This is a placeholder for the actual blog content. In a real
            application, this would be fetched from a CMS or database and would
            include the full article text, images, and other content.
          </p>
          <h2>Why Choose This Course?</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <h2>What You&apos;ll Learn</h2>
          <ul>
            <li>Comprehensive curriculum</li>
            <li>Hands-on practical training</li>
            <li>Industry-standard tools and software</li>
            <li>Real-world project experience</li>
          </ul>
          <h2>Career Opportunities</h2>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  className="group"
                  href={`/blog/${relatedPost.id}`}
                >
                  <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        alt={relatedPost.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        src={relatedPost.image}
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                        {relatedPost.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedPost.description}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Stay Updated with Our Latest Articles
          </h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for weekly updates on computer training,
            career guidance, and industry insights.
          </p>
          <form className="max-w-md mx-auto flex gap-4" onSubmit={handleNewsletterSubmit}>
            <input
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              type="email"
            />
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </section>
      </article>
    </main>
  );
} 