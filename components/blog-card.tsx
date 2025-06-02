"use client";

import Image from "next/image";
import Link from "next/link";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type BlogCardProps = {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  author: {
    name: string;
    url: string;
  };
};

const BlogCard = ({
  id,
  title,
  description,
  date,
  readTime,
  category,
  image,
  author,
}: BlogCardProps) => {
  return (
    <CardContainer className="inter-var w-full">
      <Link href={`/blog/${id}`}>
        <CardBody
          className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-2xl p-6 border flex flex-col
          before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
          after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
          [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
          [&:hover]:border-emerald-500/50
          transition-all duration-500"
        >
          <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
            <Image
              alt={title}
              className="object-cover transform transition-transform duration-500 group-hover/card:scale-110"
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <CardItem
              className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-sm font-medium rounded-full shadow-lg"
              translateZ="100"
            >
              {category}
            </CardItem>
          </div>

          <CardItem
            className="text-xl font-bold text-neutral-600 dark:text-white line-clamp-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent group-hover/card:from-emerald-500 group-hover/card:to-blue-500 transition-all duration-300"
            translateZ="150"
          >
            {title}
          </CardItem>

          <CardItem
            className="text-sm text-neutral-500 dark:text-neutral-300 mt-2 line-clamp-3"
            translateZ="180"
          >
            {description}
          </CardItem>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <CardItem className="flex items-center text-sm text-gray-600" translateZ="120">
              <time dateTime={date} className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                {new Date(date).toLocaleDateString()}
              </time>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                {readTime}
              </span>
            </CardItem>

            <CardItem className="flex items-center" translateZ="120">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 blur-sm" />
                <Image
                  alt={author.name}
                  className="relative rounded-full border-2 border-white transform transition-transform duration-300 group-hover/card:scale-110"
                  height={32}
                  src="/logo.png"
                  width={32}
                />
              </div>
            </CardItem>
          </div>
        </CardBody>
      </Link>
    </CardContainer>
  );
};

export default BlogCard; 