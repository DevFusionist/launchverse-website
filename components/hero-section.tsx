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
        <h1 className={title({ size: "lg" })}>
          🚀 Learn Skills. Launch Careers –&nbsp;
          <Highlight className="text-black dark:text-white">
            Top Computer Training Institute in Kolkata
          </Highlight>
        </h1>
        <div className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
          Welcome to Launch Verse Academy, your premier computer training
          institute in Kolkata. Whether you&apos;re a beginner or looking to
          upskill, we offer expert-led courses in Web Development, MS Office,
          Web Designing, and Graphic Designing.
        </div>
        <p className="mt-4 text-default-500 text-sm max-w-xl mx-auto">
          With 100% practical training and placement support, we help you turn
          skills into success. Join our community of learners and start your
          journey to a rewarding career today.
        </p>
      </motion.div>
    </HeroHighlight>
  );
}
