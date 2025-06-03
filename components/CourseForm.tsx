"use client";

import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Select, SelectItem } from "@heroui/react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Chip } from "@heroui/react";

import { createCourse, updateCourse, getCourse } from "@/app/actions/course";
import { CourseLevel, CourseStatus, BatchType } from "@/models/Course";
import { courseSchema } from "@/lib/schemas/course";
import { Input } from "@/components/ui/InputWithEffect";
import { Label } from "@/components/ui/LabelWithEffect";
import { cn } from "@/lib/utils";

// Form validation schema
const formSchema = courseSchema.extend({
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  prerequisites: z
    .array(z.string())
    .min(1, "At least one prerequisite is required"),
  learningObjectives: z
    .array(z.string())
    .min(1, "At least one learning objective is required"),
  curriculum: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        duration: z.number().min(0, "Duration must be positive"),
        order: z.number().min(0),
      }),
    )
    .min(1, "At least one curriculum item is required"),
});

// Form data type that matches the Course model
type FormData = {
  title: string;
  slug?: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: number;
  level: CourseLevel;
  status: CourseStatus;
  category: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  curriculum: {
    title: string;
    description: string;
    duration: number;
    order: number;
  }[];
  batchSize: number;
  batchType: BatchType;
  schedule: {
    startDate: string;
    endDate: string;
    days: (
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY"
    )[];
    startTime: string;
    endTime: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  currentBatch: {
    batchNumber: number;
    startDate: string;
    endDate: string;
    enrolledStudents: number;
    maxStudents: number;
    isActive: boolean;
  };
  thumbnail: string;
};

const initialFormData: FormData = {
  title: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: 0,
  duration: 0,
  level: CourseLevel.BEGINNER,
  status: CourseStatus.DRAFT,
  category: "",
  tags: [],
  prerequisites: [],
  learningObjectives: [],
  curriculum: [],
  batchSize: 20,
  batchType: BatchType.WEEKDAY,
  schedule: {
    startDate: "",
    endDate: "",
    days: [],
    startTime: "",
    endTime: "",
  },
  location: {
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  },
  currentBatch: {
    batchNumber: 1,
    startDate: "",
    endDate: "",
    enrolledStudents: 0,
    maxStudents: 20,
    isActive: true,
  },
  thumbnail: "",
};

const weekDays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

type CourseFormProps = {
  courseId?: string;
  mode: "create" | "edit";
};

// Add LabelInputContainer component
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

// Add this utility function at the top level of the file, before the CourseForm component
const generateSlug = (title: string): string => {
  if (!title) return "";

  // Convert to lowercase and replace special characters with hyphens
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // Add timestamp if slug is empty
  if (!slug) {
    slug = `course-${Date.now()}`;
  }

  return slug;
};

export default function CourseForm({ courseId, mode }: CourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === "edit");
  const [newTag, setNewTag] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newCurriculumItem, setNewCurriculumItem] = useState({
    title: "",
    description: "",
    duration: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    if (mode === "edit" && courseId) {
      fetchCourse();
    }
  }, [courseId, mode]);

  useEffect(() => {
    setSelectedDays(formData.schedule.days);
  }, [formData.schedule.days]);

  const fetchCourse = async () => {
    try {
      const response = await getCourse(courseId!);

      if (response.success && response.course) {
        // Transform the course data to match our form data structure
        const course = response.course;

        setFormData({
          ...course,
          schedule: {
            ...course.schedule,
            startDate: new Date(course.schedule.startDate)
              .toISOString()
              .split("T")[0],
            endDate: new Date(course.schedule.endDate)
              .toISOString()
              .split("T")[0],
            days: course.schedule.days as (
              | "MONDAY"
              | "TUESDAY"
              | "WEDNESDAY"
              | "THURSDAY"
              | "FRIDAY"
              | "SATURDAY"
              | "SUNDAY"
            )[],
          },
          currentBatch: course.currentBatch
            ? {
                ...course.currentBatch,
                startDate: new Date(course.currentBatch.startDate)
                  .toISOString()
                  .split("T")[0],
                endDate: new Date(course.currentBatch.endDate)
                  .toISOString()
                  .split("T")[0],
                batchNumber: course.currentBatch.batchNumber || 1,
                enrolledStudents: course.currentBatch.enrolledStudents || 0,
                maxStudents: course.currentBatch.maxStudents || 20,
                isActive: course.currentBatch.isActive ?? true,
              }
            : {
                batchNumber: 1,
                startDate: "",
                endDate: "",
                enrolledStudents: 0,
                maxStudents: 20,
                isActive: true,
              },
        });
      } else {
        addToast({
          title: response.error || "Failed to fetch course",
          color: "danger",
        });
        router.push("/admin/courses");
      }
    } catch (error) {
      addToast({
        title: "An error occurred while fetching the course",
        color: "danger",
      });
      router.push("/admin/courses");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate slug from title before validation
    const slug = generateSlug(formData.title);
    const formDataWithSlug = {
      ...formData,
      slug: slug || undefined,
    };

    try {
      // Validate without slug
      const tempSchema = courseSchema.omit({ slug: true });

      tempSchema.parse(formDataWithSlug);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};

        error.errors.forEach((err) => {
          const path = err.path.join(".");

          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        addToast({
          title: "Please fix the validation errors before submitting",
          color: "danger",
        });

        return;
      }
    }

    setLoading(true);

    try {
      // Add order to curriculum items
      const curriculumWithOrder = formDataWithSlug.curriculum.map(
        (item, index) => ({
          ...item,
          order: index,
        }),
      );

      // Transform the data to match the schema
      const data = {
        ...formDataWithSlug,
        curriculum: curriculumWithOrder,
        schedule: {
          ...formDataWithSlug.schedule,
          startDate: new Date(formDataWithSlug.schedule.startDate),
          endDate: new Date(formDataWithSlug.schedule.endDate),
          days: formDataWithSlug.schedule.days,
        },
        currentBatch: {
          ...formDataWithSlug.currentBatch,
          startDate: new Date(formDataWithSlug.currentBatch.startDate),
          endDate: new Date(formDataWithSlug.currentBatch.endDate),
        },
      };

      startTransition(async () => {
        const response =
          mode === "create"
            ? await createCourse(data)
            : await updateCourse(courseId!, data);

        if (response.success) {
          addToast({
            title: `Course ${mode === "create" ? "created" : "updated"} successfully`,
            color: "success",
          });
          router.push("/admin/courses");
          router.refresh(); // Refresh the current page data
        } else {
          if (response.details) {
            const newErrors: Record<string, string> = {};

            response.details.forEach((err: z.ZodIssue) => {
              const path = err.path.join(".");

              newErrors[path] = err.message;
            });
            setErrors(newErrors);
            addToast({
              title: "Please fix the validation errors",
              color: "danger",
            });
          } else {
            addToast({
              title: response.error || `Failed to ${mode} course`,
              color: "danger",
            });
          }
        }
      });
    } catch (error) {
      addToast({
        title: `An error occurred while ${mode}ing the course`,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get error message for a field
  const getFieldError = (field: string) => {
    return errors[field] || "";
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData({
        ...formData,
        prerequisites: [...formData.prerequisites, newPrerequisite.trim()],
      });
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData({
      ...formData,
      prerequisites: formData.prerequisites.filter((_, i) => i !== index),
    });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData({
        ...formData,
        learningObjectives: [
          ...formData.learningObjectives,
          newObjective.trim(),
        ],
      });
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      learningObjectives: formData.learningObjectives.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const addCurriculumItem = () => {
    if (
      newCurriculumItem.title.trim() &&
      newCurriculumItem.description.trim() &&
      newCurriculumItem.duration > 0
    ) {
      setFormData({
        ...formData,
        curriculum: [
          ...formData.curriculum,
          { ...newCurriculumItem, order: formData.curriculum.length },
        ],
      });
      setNewCurriculumItem({ title: "", description: "", duration: 0 });
    }
  };

  const removeCurriculumItem = (index: number) => {
    setFormData({
      ...formData,
      curriculum: formData.curriculum
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i })),
    });
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-default-500">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          isIconOnly
          isDisabled={isPending}
          variant="light"
          onPress={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            {mode === "create" ? "Create New Course" : "Edit Course"}
          </h1>
          <p className="text-default-500 mt-1">
            {mode === "create"
              ? "Fill in the details to create a new course"
              : "Update the course details"}
          </p>
        </div>
      </motion.div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/10 hover:border-blue-500/50 hover:animate-neon-pulse dark:hover:border-blue-400/50">
          <CardBody className="gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information Section */}
              <LabelInputContainer className="col-span-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Basic Information
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                  Fill in the basic details of your course
                </p>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("title") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                {getFieldError("title") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("title")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="status">Status</Label>
                <Select
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("status") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="status"
                  selectedKeys={[formData.status]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as CourseStatus,
                    })
                  }
                >
                  {Object.values(CourseStatus).map((status) => (
                    <SelectItem key={status}>{status}</SelectItem>
                  ))}
                </Select>
                {getFieldError("status") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("status")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("shortDescription") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="shortDescription"
                  maxLength={200}
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                />
                {getFieldError("shortDescription") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("shortDescription")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("description") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                {getFieldError("description") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("description")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Course Details Section */}
              <LabelInputContainer className="col-span-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Course Details
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                  Specify the course requirements and details
                </p>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="price">Price</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("price") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="price"
                  min="0"
                  type="number"
                  value={formData.price.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      price: value === "" ? 0 : Math.max(0, Number(value)),
                    });
                  }}
                />
                {getFieldError("price") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("price")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("duration") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="duration"
                  min="0"
                  type="number"
                  value={formData.duration.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      duration: value === "" ? 0 : Math.max(0, Number(value)),
                    });
                  }}
                />
                {getFieldError("duration") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("duration")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="level">Level</Label>
                <Select
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("level") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="level"
                  selectedKeys={[formData.level]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: e.target.value as CourseLevel,
                    })
                  }
                >
                  {Object.values(CourseLevel).map((level) => (
                    <SelectItem key={level}>{level}</SelectItem>
                  ))}
                </Select>
                {getFieldError("level") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("level")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="category">Category</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("category") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
                {getFieldError("category") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("category")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Batch Information Section */}
              <LabelInputContainer className="col-span-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Batch Information
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                  Specify the batch details
                </p>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("batchSize") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="batchSize"
                  max="30"
                  min="1"
                  type="number"
                  value={formData.batchSize.toString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      setFormData({ ...formData, batchSize: value });
                    }
                  }}
                />
                {getFieldError("batchSize") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("batchSize")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="batchType">Batch Type</Label>
                <Select
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("batchType") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="batchType"
                  selectedKeys={[formData.batchType]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      batchType: e.target.value as BatchType,
                    })
                  }
                >
                  {Object.values(BatchType).map((type) => (
                    <SelectItem key={type}>{type}</SelectItem>
                  ))}
                </Select>
                {getFieldError("batchType") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("batchType")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Current Batch Section */}
              <LabelInputContainer className="col-span-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Current Batch
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                  Specify the current batch details
                </p>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("currentBatch.batchNumber") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="batchNumber"
                  min="1"
                  type="number"
                  value={formData.currentBatch.batchNumber.toString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      setFormData({
                        ...formData,
                        currentBatch: {
                          ...formData.currentBatch,
                          batchNumber: value,
                        },
                      });
                    }
                  }}
                />
                {getFieldError("currentBatch.batchNumber") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("currentBatch.batchNumber")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="maxStudents">Maximum Students</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("currentBatch.maxStudents") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="maxStudents"
                  min="1"
                  type="number"
                  value={formData.currentBatch.maxStudents.toString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      setFormData({
                        ...formData,
                        currentBatch: {
                          ...formData.currentBatch,
                          maxStudents: value,
                        },
                      });
                    }
                  }}
                />
                {getFieldError("currentBatch.maxStudents") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("currentBatch.maxStudents")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="batchStartDate">Batch Start Date</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("currentBatch.startDate") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="batchStartDate"
                  type="date"
                  value={formData.currentBatch.startDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentBatch: {
                        ...formData.currentBatch,
                        startDate: e.target.value,
                      },
                    })
                  }
                />
                {getFieldError("currentBatch.startDate") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("currentBatch.startDate")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="batchEndDate">Batch End Date</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("currentBatch.endDate") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="batchEndDate"
                  type="date"
                  value={formData.currentBatch.endDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentBatch: {
                        ...formData.currentBatch,
                        endDate: e.target.value,
                      },
                    })
                  }
                />
                {getFieldError("currentBatch.endDate") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("currentBatch.endDate")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="isActive">Batch Active</Label>
                <Select
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("currentBatch.isActive") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="isActive"
                  selectedKeys={[formData.currentBatch.isActive.toString()]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentBatch: {
                        ...formData.currentBatch,
                        isActive: e.target.value === "true",
                      },
                    })
                  }
                >
                  <SelectItem key="true">Active</SelectItem>
                  <SelectItem key="false">Inactive</SelectItem>
                </Select>
                {getFieldError("currentBatch.isActive") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("currentBatch.isActive")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Schedule Section */}
              <LabelInputContainer className="col-span-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Schedule
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                  Specify the course schedule
                </p>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="scheduleStartDate">Schedule Start Date</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("schedule.startDate") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="scheduleStartDate"
                  type="date"
                  value={formData.schedule.startDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule,
                        startDate: e.target.value,
                      },
                    })
                  }
                />
                {getFieldError("schedule.startDate") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("schedule.startDate")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="scheduleEndDate">Schedule End Date</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("schedule.endDate") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="scheduleEndDate"
                  type="date"
                  value={formData.schedule.endDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule,
                        endDate: e.target.value,
                      },
                    })
                  }
                />
                {getFieldError("schedule.endDate") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("schedule.endDate")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="scheduleDays">Schedule Days</Label>
                <Select
                  required
                  aria-label="Select schedule days"
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("schedule.days") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="scheduleDays"
                  selectedKeys={new Set(formData.schedule.days)}
                  selectionMode="multiple"
                  onSelectionChange={(keys) => {
                    // Convert the Set to an array of valid day strings
                    const selected = Array.from(keys).filter((key) =>
                      weekDays.includes(key as any),
                    ) as (
                      | "MONDAY"
                      | "TUESDAY"
                      | "WEDNESDAY"
                      | "THURSDAY"
                      | "FRIDAY"
                      | "SATURDAY"
                      | "SUNDAY"
                    )[];

                    setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, days: selected },
                    });
                  }}
                >
                  {weekDays.map((day) => (
                    <SelectItem key={day}>
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </Select>
                {getFieldError("schedule.days") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("schedule.days")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="scheduleStartTime">Schedule Start Time</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("schedule.startTime") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="scheduleStartTime"
                  type="time"
                  value={formData.schedule.startTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule,
                        startTime: e.target.value,
                      },
                    })
                  }
                />
                {getFieldError("schedule.startTime") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("schedule.startTime")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="scheduleEndTime">Schedule End Time</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("schedule.endTime") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="scheduleEndTime"
                  type="time"
                  value={formData.schedule.endTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule,
                        endTime: e.target.value,
                      },
                    })
                  }
                />
                {getFieldError("schedule.endTime") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("schedule.endTime")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Location Section */}
              <LabelInputContainer className="col-span-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Location
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                  Specify the course location
                </p>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="locationAddress">Location Address</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("location.address") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="locationAddress"
                  value={formData.location.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        address: e.target.value,
                      },
                    })
                  }
                />
                {getFieldError("location.address") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("location.address")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="locationCity">Location City</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("location.city") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="locationCity"
                  value={formData.location.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value },
                    })
                  }
                />
                {getFieldError("location.city") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("location.city")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="locationState">Location State</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("location.state") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="locationState"
                  value={formData.location.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, state: e.target.value },
                    })
                  }
                />
                {getFieldError("location.state") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("location.state")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="locationPincode">Location Pincode</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("location.pincode") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="locationPincode"
                  value={formData.location.pincode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        pincode: e.target.value,
                      },
                    })
                  }
                />
                {getFieldError("location.pincode") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("location.pincode")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="locationLandmark">
                  Location Landmark (Optional)
                </Label>
                <Input
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("location.landmark") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="locationLandmark"
                  value={formData.location.landmark || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        landmark: e.target.value,
                      },
                    })
                  }
                />
                {getFieldError("location.landmark") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("location.landmark")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Tags Section */}
              <LabelInputContainer className="col-span-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    className={cn(
                      "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                      getFieldError("tags") &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                    )}
                    id="tags"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button onPress={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Chip key={index} onClose={() => removeTag(index)}>
                      {tag}
                    </Chip>
                  ))}
                </div>
                {getFieldError("tags") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("tags")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Prerequisites Section */}
              <LabelInputContainer className="col-span-2">
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    className={cn(
                      "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                      getFieldError("prerequisites") &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                    )}
                    id="prerequisites"
                    placeholder="Add a prerequisite"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addPrerequisite())
                    }
                  />
                  <Button onPress={addPrerequisite}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.prerequisites.map((prerequisite, index) => (
                    <Chip key={index} onClose={() => removePrerequisite(index)}>
                      {prerequisite}
                    </Chip>
                  ))}
                </div>
                {getFieldError("prerequisites") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("prerequisites")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Learning Objectives Section */}
              <LabelInputContainer className="col-span-2">
                <Label htmlFor="learningObjectives">Learning Objectives</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    className={cn(
                      "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                      getFieldError("learningObjectives") &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                    )}
                    id="learningObjectives"
                    placeholder="Add a learning objective"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addObjective())
                    }
                  />
                  <Button onPress={addObjective}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.learningObjectives.map((objective, index) => (
                    <Chip key={index} onClose={() => removeObjective(index)}>
                      {objective}
                    </Chip>
                  ))}
                </div>
                {getFieldError("learningObjectives") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("learningObjectives")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Curriculum Section */}
              <LabelInputContainer className="col-span-2">
                <Label htmlFor="curriculum">Curriculum</Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      className={cn(
                        "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                        getFieldError("curriculum") &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                      )}
                      placeholder="Title"
                      value={newCurriculumItem.title}
                      onChange={(e) =>
                        setNewCurriculumItem({
                          ...newCurriculumItem,
                          title: e.target.value,
                        })
                      }
                    />
                    <Input
                      className={cn(
                        "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                        getFieldError("curriculum") &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                      )}
                      placeholder="Description"
                      value={newCurriculumItem.description}
                      onChange={(e) =>
                        setNewCurriculumItem({
                          ...newCurriculumItem,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        className={cn(
                          "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                          getFieldError("curriculum") &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                        )}
                        min="0"
                        placeholder="Duration (hours)"
                        type="number"
                        value={newCurriculumItem.duration.toString()}
                        onChange={(e) =>
                          setNewCurriculumItem({
                            ...newCurriculumItem,
                            duration: Number(e.target.value),
                          })
                        }
                      />
                      <Button onPress={addCurriculumItem}>Add</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {formData.curriculum.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 border rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-default-500">
                            {item.description}
                          </p>
                          <p className="text-sm text-default-500">
                            Duration: {item.duration} hours
                          </p>
                        </div>
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => removeCurriculumItem(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                {getFieldError("curriculum") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("curriculum")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Thumbnail Section */}
              <LabelInputContainer>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("thumbnail") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                />
                {getFieldError("thumbnail") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("thumbnail")}
                  </p>
                )}
              </LabelInputContainer>
            </div>
          </CardBody>
        </Card>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end gap-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            isDisabled={loading || isPending}
            variant="flat"
            onPress={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={loading || isPending}
            startContent={
              !loading && !isPending && <Plus className="w-4 h-4" />
            }
            type="submit"
          >
            {mode === "create" ? "Create Course" : "Update Course"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
