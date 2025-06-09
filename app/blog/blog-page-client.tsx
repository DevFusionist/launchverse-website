"use client";

import { useEffect } from "react";
import BlogGrid from "@/components/blog-grid";
import { trackPageView, trackButtonClick, trackFormSubmission } from "@/lib/analytics";

interface BlogPageClientProps {
  posts: any[];
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  // Track page view
  useEffect(() => {
    trackPageView("/blog", "Computer Training Blog | Latest Articles on Web Development, Design & Office Skills");
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackFormSubmission("blog_newsletter", "/blog");
    // Add your newsletter submission logic here
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Computer Training Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Expert insights, career guidance, and industry trends to help you
          succeed in the digital world.
        </p>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <div className="flex flex-wrap gap-4 justify-center">
          {Array.from(new Set(posts.map((post) => post.category))).map(
            (category) => (
              <span
                key={category}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <BlogGrid posts={posts} />

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
            onClick={() => trackButtonClick("newsletter_subscribe", "/blog")}
          >
            Subscribe
          </button>
        </form>
      </section>
    </main>
  );
} 