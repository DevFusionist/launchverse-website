import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { generateBlogPostingSchema } from "@/components/schema-markup";
import { BlogPostClient } from "./blog-post-client";

// Import blog posts data (in a real app, this would come from a database)
import { blogPosts } from "../data";

export async function generateMetadata(props: {
  params: Promise<{ blogId: string }>;
}): Promise<Metadata> {
  const { blogId } = await props.params;
  const post = blogPosts.find((p) => p.id === blogId);

  if (!post) {
    return {
      title: "Blog Post Not Found | Launch Verse Academy",
      description: "The requested blog post could not be found.",
    };
  }

  const metadata: Metadata = {
    title: `${post.title} | Launch Verse Academy`,
    description: post.description,
    keywords: `${post.category.toLowerCase()}, ${post.title.toLowerCase()}, computer training, career guidance, ${
      post.category === "Web Development" ? "web development, programming" : ""
    }${post.category === "Graphic Design" ? "graphic design, design tools" : ""}${
      post.category === "MS Office" ? "ms office, office skills" : ""
    }, launch verse academy`,
    openGraph: {
      title: `${post.title} | Launch Verse Academy`,
      description: post.description,
      type: "article",
      url: `https://scriptauradev.com/blog/${post.id}`,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
      authors: [post.author.name],
      siteName: "Launch Verse Academy",
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Launch Verse Academy`,
      description: post.description,
      images: [post.image],
      creator: "@launchverse",
    },
  };

  return metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;
  const post = blogPosts.find((p) => p.id === blogId);

  if (!post) {
    notFound();
  }

  // Generate blog post schema
  const blogSchema = generateBlogPostingSchema({
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    author: post.author,
    publisher: {
      name: "Launch Verse Academy",
      url: "https://www.launchverseacademy.com",
    },
  });

  // Find related posts (excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}