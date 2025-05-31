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
          Launch Your Tech Career with&nbsp;
          <Highlight className="text-black dark:text-white">
            Expert-Led Training
          </Highlight>
        </h1>
        <div className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
          Transform your future with our industry-aligned courses, hands-on
          projects, and career support. Join thousands of successful graduates
          who have launched their tech careers with us.
        </div>
        <p className="mt-4 text-default-500 text-sm max-w-xl mx-auto">
          Industry-recognized certifications, personalized mentorship, and
          guaranteed placement support. Start your journey to becoming a tech
          professional today.
        </p>
      </motion.div>
    </HeroHighlight>
  );
}
