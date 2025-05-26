'use client';

import { motion, Variants, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

// Enhanced card variants with spring physics
export const enhancedCardVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
    filter: 'brightness(1)',
  },
  hover: {
    scale: 1.02,
    y: -4,
    filter: 'brightness(1.05)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
  },
};

// Enhanced button variants with spring physics
export const enhancedButtonVariants: Variants = {
  initial: {
    scale: 1,
    filter: 'brightness(1)',
  },
  hover: {
    scale: 1.05,
    filter: 'brightness(1.1)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
  },
  tap: {
    scale: 0.95,
    filter: 'brightness(0.95)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
  },
};

// Enhanced icon variants with spring physics
export const enhancedIconVariants: Variants = {
  initial: {
    x: 0,
    scale: 1,
  },
  hover: {
    x: 4,
    scale: 1.1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
  },
};

// Enhanced badge variants
export const enhancedBadgeVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  hover: {
    scale: 1.05,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
  },
};

// Enhanced input variants
export const enhancedInputVariants: Variants = {
  initial: {
    scale: 1,
    filter: 'brightness(1)',
  },
  focus: {
    scale: 1.01,
    filter: 'brightness(1.05)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
  },
};

// Enhanced motion components
export const EnhancedCard = motion.div;
export const EnhancedButton = motion.button;
export const EnhancedIcon = motion.div;
export const EnhancedBadge = motion.div;
export const EnhancedInput = motion.div;

// Reusable hover card component with enhanced animations
export function HoverCard({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <EnhancedCard
      variants={enhancedCardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        'group relative rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent',
        className
      )}
      {...props}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-primary/10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </EnhancedCard>
  );
}

// Reusable animated button component
export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    asChild?: boolean;
  }
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : Button;
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn('inline-block', className)}
    >
      <Comp ref={ref} {...props} />
    </motion.div>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

// Reusable animated icon component
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
    <EnhancedIcon
      variants={enhancedIconVariants}
      initial="initial"
      whileHover="hover"
      className={cn('inline-flex', className)}
      {...props}
    >
      {children}
    </EnhancedIcon>
  );
}

// Reusable animated badge component
export function AnimatedBadge({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <EnhancedBadge
      variants={enhancedBadgeVariants}
      initial="initial"
      whileHover="hover"
      className={cn('inline-flex', className)}
      {...props}
    >
      {children}
    </EnhancedBadge>
  );
}

// Reusable animated input wrapper component
export function AnimatedInput({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className={cn('relative', className)} {...props}>
      <motion.div
        variants={enhancedInputVariants}
        initial="initial"
        whileFocus="focus"
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

// Enhanced error animation variants
const errorVariants = {
  initial: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  pulse: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  border: {
    borderColor: ['rgb(var(--destructive))', 'transparent'],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

// Enhanced Error Message Component with icon
const AnimatedError = motion.div;
AnimatedError.defaultProps = {
  variants: errorVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  className: 'flex items-center gap-2 text-sm text-destructive font-medium',
  role: 'alert',
};

// Enhanced Error Input Component with border animation
const AnimatedErrorInput = motion.div;
AnimatedErrorInput.defaultProps = {
  variants: errorVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  className: 'relative',
};

// New component for form fields with error animations
const AnimatedErrorField = ({
  error,
  children,
  className,
  ...props
}: {
  error?: string | null;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (error) {
      setHasError(true);
      const timer = setTimeout(() => setHasError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className={cn('relative', className)} {...props}>
      <AnimatedErrorInput
        animate={hasError ? 'shake' : 'animate'}
        className={cn('transition-colors', error && 'border-destructive')}
      >
        {children}
      </AnimatedErrorInput>
      {error && (
        <AnimatePresence>
          <AnimatedError
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-1.5"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </AnimatedError>
        </AnimatePresence>
      )}
    </div>
  );
};

export {
  // ... existing exports ...
  AnimatedError,
  AnimatedErrorInput,
  AnimatedErrorField,
  errorVariants,
};
