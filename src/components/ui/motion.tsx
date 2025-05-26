import { motion, Variants } from 'framer-motion';
import { useState, useEffect, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      opacity: { duration: 0.3 },
      scale: { duration: 0.4 },
      y: { duration: 0.4 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      opacity: { duration: 0.2 },
      scale: { duration: 0.3 },
      y: { duration: 0.3 },
    },
  },
};

// Fade in animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0.8, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Scale animation variants
export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Slide in animation variants
export const slideIn: Variants = {
  hidden: { x: -10, opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Hover animation variants
export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// Card animation variants
export const cardVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeIn',
    },
  },
};

// Button animation variants
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeIn',
    },
  },
};

// Icon animation variants
export const iconVariants: Variants = {
  initial: { x: 0 },
  hover: {
    x: 4,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// Stagger container variant
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Stagger item variant
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Reusable motion components
export const MotionDiv = motion.div;
export const MotionSpan = motion.span;
export const MotionButton = motion.button;

// Animated section component
export function AnimatedSection({
  children,
  className,
  variants = fadeIn,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Parallax component
export function ParallaxSection({
  children,
  className,
  speed = 0.5,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  [key: string]: any;
}) {
  return (
    <motion.div
      style={{
        y: useParallax(speed),
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Custom hook for parallax effect
function useParallax(speed: number) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Set initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY * speed;
}

// Page transition component
export function PageTransition({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={cn('relative min-h-screen', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated card component
export function AnimatedCard({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        'group relative cursor-pointer rounded-lg border bg-card p-8 shadow-sm transition-colors hover:bg-accent',
        className
      )}
      {...props}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-lg ring-1 ring-inset ring-primary/10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

// Animated button wrapper component
export function AnimatedButtonWrapper({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated icon component
export function AnimatedIcon({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      variants={iconVariants}
      className={cn('inline-flex', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
