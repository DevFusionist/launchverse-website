"use client";

import { motion } from "framer-motion";

import { HeroHighlight, Highlight } from "@/components/ui/HeroHighlight";
import { title, subtitle } from "@/components/primitives";

export function HeroSection() {
  return (
    <HeroHighlight>
      <motion.div
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        className="text-center"
        initial={{
          opacity: 0,
          y: 20,
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      >
        <h1 className={title({ size: "sm", class: "md:text-5xl lg:text-6xl leading-tight" })}>
          🚀 Learn Skills. Launch Careers{" "}
          <Highlight className="text-black dark:text-white inline-block">
            Top Computer Training Institute in Kolkata
          </Highlight>
        </h1>
        <div className={subtitle({ class: "mt-3 max-w-2xl mx-auto text-sm md:text-base px-4 md:px-0" })}>
          Welcome to Launch Verse Academy, your premier computer training
          institute in Kolkata. Whether you&apos;re a beginner or looking to
          upskill, we offer expert-led courses in Web Development, MS Office,
          Web Designing, and Graphic Designing.
        </div>
        <p className="mt-3 text-default-500 text-xs md:text-sm max-w-xl mx-auto px-4 md:px-0">
          With 100% practical training and placement support, we help you turn
          skills into success. Join our community of learners and start your
          journey to a rewarding career today.
        </p>
      </motion.div>
    </HeroHighlight>
  );
}
