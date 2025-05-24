import { OpenAI } from "openai";
import mongoose from "mongoose";
import { BlogPost } from "../src/models/BlogPost";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const topics = [
  "Web Development Best Practices",
  "WordPress Development",
  "React.js Tips and Tricks",
  "Next.js Features",
  "JavaScript Modern Features",
  "CSS Grid and Flexbox",
  "Web Performance Optimization",
  "Responsive Design",
  "Web Security",
  "API Development",
];

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function generateBlogPost() {
  try {
    // Select a random topic
    const topic = topics[Math.floor(Math.random() * topics.length)];

    // Generate blog post using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert web developer and technical writer. Write detailed, informative blog posts about web development topics. Include code examples where relevant. Format the content in markdown.",
        },
        {
          role: "user",
          content: `Write a comprehensive blog post about ${topic}. The post should be informative, well-structured, and include practical examples. Include a title, introduction, main sections, and conclusion.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI");
    }

    // Extract title from the first line of content
    const title = content.split("\n")[0].replace(/^#\s*/, "").trim();
    const blogContent = content.split("\n").slice(1).join("\n").trim();

    // Create new blog post
    const blogPost = new BlogPost({
      title,
      content: blogContent,
      tags: [topic.toLowerCase().replace(/\s+/g, "-")],
      status: "draft",
    });

    await blogPost.save();
    console.log(`Successfully generated and saved blog post: ${title}`);
  } catch (error) {
    console.error("Error generating blog post:", error);
  }
}

// Main execution
async function main() {
  await connectDB();
  await generateBlogPost();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

main().catch(console.error);
