import { Variants } from "framer-motion";

// Common transition settings
export const transitions = {
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1], // Custom easing for smooth motion
  },
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 25,
  },
  bounce: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  },
  slow: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  },
  // New transitions
  smoothBounce: {
    type: "spring",
    stiffness: 200,
    damping: 20,
    mass: 1,
  },
  gentle: {
    duration: 0.4,
    ease: [0.43, 0.13, 0.23, 0.96],
  },
  elastic: {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },
};

// Page transitions
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.smooth,
  },
};

// Fade animations
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.smooth,
  },
};

// Slide animations
export const slideUp: Variants = {
  initial: {
    y: 20,
    opacity: 0,
    transition: transitions.smooth,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: transitions.smooth,
  },
};

export const slideIn: Variants = {
  initial: {
    x: -20,
    opacity: 0,
    transition: transitions.smooth,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: transitions.smooth,
  },
};

// Scale animations
export const scaleUp: Variants = {
  initial: {
    scale: 0.95,
    opacity: 0,
    transition: transitions.spring,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: transitions.spring,
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: transitions.smooth,
  },
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    y: 20,
    opacity: 0,
    transition: transitions.smooth,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: transitions.smooth,
  },
};

// Form animations
export const formAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.smooth,
  },
};

export const formFieldAnimation: Variants = {
  initial: {
    opacity: 0,
    x: -10,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: transitions.smooth,
  },
};

// Table animations
export const tableAnimation: Variants = {
  initial: {
    opacity: 0,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    transition: {
      ...transitions.smooth,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ...transitions.smooth,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const tableRowAnimation: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.smooth,
  },
};

// Card animations
export const cardAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.smooth,
  },
};

// Modal animations
export const modalAnimation: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.smooth,
  },
};

// Alert/Notification animations
export const alertAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: transitions.smooth,
  },
};

// Button animations
export const buttonAnimation: Variants = {
  initial: {
    scale: 1,
    transition: transitions.smooth,
  },
  hover: {
    scale: 1.05,
    transition: transitions.spring,
  },
  tap: {
    scale: 0.95,
    transition: transitions.smooth,
  },
};

// Navigation menu animations
export const menuAnimation: Variants = {
  initial: {
    opacity: 0,
    x: "100%",
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: transitions.smooth,
  },
};

// Dropdown animations
export const dropdownAnimation: Variants = {
  initial: {
    opacity: 0,
    y: -10,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.smooth,
  },
};

// Loading spinner animation
export const spinnerAnimation: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Text reveal animations
export const textReveal: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Grid animations
export const gridAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const gridItemAnimation: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.smooth,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.smooth,
  },
};

// New professional animations

// Hero section animations
export const heroAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96],
      staggerChildren: 0.2,
    },
  },
};

export const heroTextAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.gentle,
  },
};

// Enhanced card animations
export const enhancedCardAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

// Feature highlight animations
export const featureAnimation: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.smoothBounce,
  },
  hover: {
    scale: 1.05,
    transition: transitions.elastic,
  },
};

// Enhanced button animations
export const enhancedButtonAnimation: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: transitions.elastic,
  },
  tap: {
    scale: 0.95,
    transition: transitions.smooth,
  },
  focus: {
    scale: 1.02,
    transition: transitions.smooth,
  },
};

// Navigation menu enhancements
export const enhancedMenuAnimation: Variants = {
  initial: {
    opacity: 0,
    x: "100%",
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: transitions.gentle,
  },
};

// Enhanced dropdown animations
export const enhancedDropdownAnimation: Variants = {
  initial: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: transitions.gentle,
  },
};

// Enhanced modal animations
export const enhancedModalAnimation: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.gentle,
  },
};

// Enhanced table animations
export const enhancedTableAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      ...transitions.smooth,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ...transitions.gentle,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const enhancedTableRowAnimation: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.98,
    transition: transitions.gentle,
  },
};

// Enhanced form animations
export const enhancedFormAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: transitions.gentle,
  },
};

export const enhancedFormFieldAnimation: Variants = {
  initial: {
    opacity: 0,
    x: -10,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    x: 10,
    scale: 0.98,
    transition: transitions.gentle,
  },
};

// Enhanced grid animations
export const enhancedGridAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      ...transitions.smooth,
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ...transitions.gentle,
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

export const enhancedGridItemAnimation: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.smoothBounce,
  },
  hover: {
    scale: 1.05,
    y: -5,
    transition: transitions.elastic,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.gentle,
  },
};

// Enhanced text animations
export const enhancedTextReveal: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.gentle,
  },
};

// Enhanced stagger animations
export const enhancedStaggerContainer: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      ...transitions.smooth,
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ...transitions.gentle,
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

export const enhancedStaggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: transitions.gentle,
  },
};

// Enhanced alert/notification animations
export const enhancedAlertAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    x: "-50%",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    x: "-50%",
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    x: "-50%",
    transition: transitions.gentle,
  },
};

// Enhanced loading spinner animation
export const enhancedSpinnerAnimation: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Enhanced page transition
export const enhancedPageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.smoothBounce,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: transitions.gentle,
  },
};
