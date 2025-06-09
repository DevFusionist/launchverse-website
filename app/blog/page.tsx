import { Metadata } from "next";

import { generateBlogPostingSchema } from "@/components/schema-markup";
import BlogGrid from "@/components/blog-grid";
import { blogPosts } from "./data";
import { BlogPageClient } from "./blog-page-client";

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
      <BlogPageClient posts={blogPosts} />
    </>
  );
}
