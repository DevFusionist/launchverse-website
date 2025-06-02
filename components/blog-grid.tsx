"use client";

import { motion } from "framer-motion";

import BlogCard from "@/components/blog-card";
import type { BlogPost } from "@/app/blog/data";

type BlogGridProps = {
  posts: BlogPost[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <motion.section
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"
      initial="hidden"
      variants={containerVariants}
    >
      {posts.map((post) => (
        <motion.div
          key={post.id}
          style={{
            transformStyle: "preserve-3d",
          }}
          variants={itemVariants}
        >
          <BlogCard {...post} />
        </motion.div>
      ))}
    </motion.section>
  );
} 