import { Metadata } from "next";

import { generateBlogPostingSchema } from "@/components/schema-markup";
import BlogGrid from "@/components/blog-grid";
import { blogPosts } from "./data";

export const metadata: Metadata = {
  title:
    "Computer Training Blog | Latest Articles on Web Development, Design & Office Skills",
  description:
    "Explore our expert articles on computer training, career guidance, and industry insights. Learn about Web Development, WordPress, Graphic Design, MS Office, and more. Get tips for career growth and freelancing.",
  keywords:
    "computer training blog, web development articles, wordpress tutorials, graphic design tips, ms office training, career guidance, freelancing tips, computer courses kolkata, launch verse academy blog",
  openGraph: {
    title:
      "Computer Training Blog | Latest Articles on Web Development, Design & Office Skills",
    description:
      "Explore our expert articles on computer training, career guidance, and industry insights. Learn about Web Development, WordPress, Graphic Design, MS Office, and more.",
    type: "website",
    url: "https://www.launchverseacademy.com/blog",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "LaunchVerse Academy Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Computer Training Blog | Latest Articles on Web Development, Design & Office Skills",
    description:
      "Explore our expert articles on computer training, career guidance, and industry insights. Learn about Web Development, WordPress, Graphic Design, MS Office, and more.",
    images: ["/og-blog.jpg"],
  },
};

export default function BlogPage() {
  // Generate schemas for all blog posts
  const blogSchemaScripts = blogPosts.map((post) =>
    generateBlogPostingSchema({
      headline: post.title,
      description: post.description,
      image: post.image,
      datePublished: post.date,
      author: post.author,
      publisher: {
        name: "Launch Verse Academy",
        url: "https://www.launchverseacademy.com",
      },
    }),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchemaScripts) }}
      />
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
            {Array.from(new Set(blogPosts.map((post) => post.category))).map(
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
        <BlogGrid posts={blogPosts} />

        {/* Newsletter Section */}
        <section className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Stay Updated with Our Latest Articles
          </h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for weekly updates on computer training,
            career guidance, and industry insights.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
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
      </main>
    </>
  );
}
