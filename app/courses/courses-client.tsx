"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState, useMemo, ChangeEvent } from "react";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { CourseCard } from "@/components/course-card";
import { SearchIcon, FilterIcon } from "@/components/icons";

type Course = {
  id: string;
  title: string;
  description: string;
  icon: string;
  neonColor: string;
  category?: string;
};

type CoursesClientProps = {
  courses: Course[];
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

// 3D Button Component
const Button3D = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [15, -15]);
  const rotateY = useTransform(mouseX, [-100, 100], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.a
      ref={ref}
      animate={{
        scale: isHovered ? 1.05 : 1,
        z: isHovered ? 50 : 0,
      }}
      className="relative inline-block px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium transition-all duration-300 perspective-1000 border border-purple-500/30 hover:border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
      href={href}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Neon glow effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.8 : 0.4,
          scale: isHovered ? 1.2 : 1,
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-xl"
        style={{
          transform: "translateZ(-10px)",
          boxShadow: isHovered
            ? "0 0 30px rgba(147, 51, 234, 0.4), 0 0 60px rgba(79, 70, 229, 0.3)"
            : "0 0 15px rgba(147, 51, 234, 0.2), 0 0 30px rgba(79, 70, 229, 0.1)",
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        animate={{
          textShadow: isHovered ? "0 0 10px rgba(255, 255, 255, 0.5)" : "none",
        }}
        className="relative z-10 block"
        style={{
          transform: "translateZ(20px)",
        }}
      >
        {children}
      </motion.span>
    </motion.a>
  );
};

// 3D Search Bar Component
const SearchBar3D = ({
  onSearch,
  onReset,
}: {
  onSearch: (value: string) => void;
  onReset: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  // Neon animation variants
  const neonGlow = {
    initial: { opacity: 0.5, scale: 1 },
    hover: {
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* 3D Effect Container */}
      <motion.div
        ref={ref}
        animate={{
          scale: isHovered ? 1.02 : 1,
          z: isHovered ? 20 : 0,
        }}
        className="absolute inset-0 perspective-1000 pointer-events-none"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Neon glow effect */}
        <motion.div
          animate={isHovered ? "hover" : "initial"}
          className="absolute inset-0 rounded-xl"
          initial="initial"
          style={{
            background:
              "radial-gradient(circle at center, rgba(147, 51, 234, 0.15), rgba(79, 70, 229, 0.15))",
            filter: "blur(20px)",
            boxShadow: isHovered
              ? "0 0 20px rgba(147, 51, 234, 0.3), 0 0 40px rgba(79, 70, 229, 0.2)"
              : "0 0 10px rgba(147, 51, 234, 0.2), 0 0 20px rgba(79, 70, 229, 0.1)",
          }}
          variants={neonGlow}
        />
        <motion.div
          animate={{
            opacity: isHovered ? 0.6 : 0.3,
            scale: isHovered ? 1.1 : 1,
          }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-xl"
          style={{
            transform: "translateZ(-10px)",
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Input Container - No 3D effects */}
      <div className="relative z-10 flex gap-2">
        <Input
          classNames={{
            base: "h-12",
            mainWrapper: "h-12",
            input: "text-lg",
            inputWrapper:
              "h-12 bg-background/60 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all duration-300 [&:hover]:shadow-[0_0_15px_rgba(147,51,234,0.3)] [&:focus-within]:shadow-[0_0_20px_rgba(147,51,234,0.4)]",
          }}
          placeholder="Search courses..."
          radius="lg"
          size="lg"
          startContent={<SearchIcon className="text-default-400" />}
          variant="bordered"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onSearch(e.target.value);
            setHasActiveFilters(e.target.value.length > 0);
          }}
        />
        <Button
          className="h-12 px-4 bg-background/60 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)]"
          radius="lg"
          startContent={<FilterIcon className="text-default-400" />}
          variant="bordered"
        >
          Filter
        </Button>
        {hasActiveFilters && (
          <Button
            className="h-12 px-4 bg-background/60 backdrop-blur-xl border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            radius="lg"
            variant="bordered"
            onClick={() => {
              onReset();
              setHasActiveFilters(false);
            }}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

// Category Chips Component
const CategoryChips = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}) => {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 justify-center mt-4"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Chip
        className={`cursor-pointer transition-all duration-300 ${
          selectedCategory === null
            ? "shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            : "hover:shadow-[0_0_10px_rgba(147,51,234,0.2)]"
        }`}
        variant={selectedCategory === null ? "solid" : "flat"}
        onClick={() => onSelectCategory(null)}
      >
        All
      </Chip>
      {categories.map((category) => (
        <Chip
          key={category}
          className={`cursor-pointer transition-all duration-300 ${
            selectedCategory === category
              ? "shadow-[0_0_15px_rgba(147,51,234,0.3)]"
              : "hover:shadow-[0_0_10px_rgba(147,51,234,0.2)]"
          }`}
          variant={selectedCategory === category ? "solid" : "flat"}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Chip>
      ))}
    </motion.div>
  );
};

export function CoursesClient({ courses }: CoursesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Add categories to courses
  const coursesWithCategories = useMemo(
    () =>
      courses.map((course) => ({
        ...course,
        category: course.title.split(" ")[0].toLowerCase(), // Simple category extraction for demo
      })),
    [courses],
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(coursesWithCategories.map((course) => course.category)),
      ),
    [coursesWithCategories],
  );

  const filteredCourses = useMemo(() => {
    return coursesWithCategories.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [coursesWithCategories, searchQuery, selectedCategory]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore Our Courses
        </motion.h1>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-default-500 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Discover our comprehensive range of courses designed to launch your
          tech career. From web development to data science, find the perfect
          course to accelerate your learning journey.
        </motion.p>

        {/* Search and Filter Section */}
        <SearchBar3D onReset={handleReset} onSearch={setSearchQuery} />
        <CategoryChips
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            // Update hasActiveFilters in SearchBar3D when category changes
            const searchInput = document.querySelector(
              'input[placeholder="Search courses..."]',
            ) as HTMLInputElement;

            if (searchInput) {
              searchInput.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }}
        />
      </motion.div>

      {/* Course Grid */}
      <motion.div
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"
        initial="hidden"
        variants={containerVariants}
      >
        {filteredCourses.map((course) => (
          <motion.div
            key={course.title}
            style={{
              transformStyle: "preserve-3d",
            }}
            variants={itemVariants}
          >
            <CourseCard
              {...course}
              enrollRoute="/enroll"
              learnMoreRoute={`/courses/${course.id}`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* No Results Message */}
      {filteredCourses.length === 0 && (
        <motion.div
          animate={{ opacity: 1 }}
          className="text-center py-12"
          initial={{ opacity: 0 }}
        >
          <p className="text-xl text-default-500">
            No courses found matching your search criteria.
          </p>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold mb-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Ready to Start Your Journey?
        </motion.h2>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-default-500 mb-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Join our community of learners and take the first step towards your
          tech career.
        </motion.p>
        <Button3D href="/contact?source=courses">Enroll Now</Button3D>
      </motion.div>
    </div>
  );
}
