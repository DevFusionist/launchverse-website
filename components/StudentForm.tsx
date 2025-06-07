"use client";

import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Select, SelectItem } from "@heroui/react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { createStudent, updateStudent, getStudent, getAvailableCourses } from "@/app/actions/student";
import { UserStatus } from "@/lib/types";
import { Input } from "@/components/ui/InputWithEffect";
import { Label } from "@/components/ui/LabelWithEffect";
import { cn } from "@/lib/utils";
import { Chip } from "@heroui/react";
import { 
  createStudentSchema, 
  updateStudentSchema,
  type EducationInput 
} from "@/lib/schemas/student";

// Update FormData type to be conditional based on mode
type FormData = {
  name: string;
  email: string;
  password?: string;
  status: UserStatus;
  education: EducationInput[];
  skills: string[];
  githubProfile?: string;
  linkedinProfile?: string;
  portfolio?: string;
  enrolledCourses?: any[]; // Using any[] for now since we don't need to edit enrollments in the form
};

type StudentFormProps = {
  studentId?: string;
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

export default function StudentForm({ studentId, mode }: StudentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Move initialFormData inside component
  const initialFormData: FormData = {
    name: "",
    email: "",
    password: mode === "create" ? "" : undefined,
    status: UserStatus.PENDING,
    education: [],
    skills: [],
    githubProfile: "",
    linkedinProfile: "",
    portfolio: "",
    enrolledCourses: [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === "edit");
  const [newSkill, setNewSkill] = useState("");
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    graduationYear: undefined as number | undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  console.log("availableCourses", availableCourses);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<number | undefined>();

  useEffect(() => {
    if (mode === "edit" && studentId) {
      fetchStudent();
    }
  }, [studentId, mode]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await getAvailableCourses();
      if (response.success) {
        setAvailableCourses(response.courses);
      }
    };
    fetchCourses();
  }, []);

  const fetchStudent = async () => {
    try {
      const response = await getStudent(studentId!);

      if (response.success && response.student) {
        const student = response.student;
        setFormData({
          name: student.user.name,
          email: student.user.email,
          status: student.user.status,
          education: student.education,
          skills: student.skills,
          githubProfile: student.githubProfile || "",
          linkedinProfile: student.linkedinProfile || "",
          portfolio: student.portfolio || "",
          enrolledCourses: student.enrolledCourses,
          password: undefined,
        });
      } else {
        addToast({
          title: response.error || "Failed to fetch student",
          color: "danger",
        });
        router.push("/admin/students");
      }
    } catch (error) {
      addToast({
        title: "An error occurred while fetching the student",
        color: "danger",
      });
      router.push("/admin/students");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create a validation schema based on mode
      const validationSchema = mode === "create" 
        ? createStudentSchema
        : updateStudentSchema;

      // Validate form data
      validationSchema.parse(formData);
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
      startTransition(async () => {
        const response =
          mode === "create"
            ? await createStudent({ ...formData, password: formData.password! })
            : await updateStudent(studentId!, formData);

        if (response.success) {
          addToast({
            title: `Student ${mode === "create" ? "created" : "updated"} successfully`,
            color: "success",
          });
          router.push("/admin/students");
          router.refresh();
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
              title: response.error || `Failed to ${mode} student`,
              color: "danger",
            });
          }
        }
      });
    } catch (error) {
      addToast({
        title: `An error occurred while ${mode}ing the student`,
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

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    if (
      newEducation.institution.trim() &&
      newEducation.degree.trim() &&
      newEducation.field.trim()
    ) {
      setFormData({
        ...formData,
        education: [...formData.education, { ...newEducation }],
      });
      setNewEducation({
        institution: "",
        degree: "",
        field: "",
        graduationYear: undefined,
      });
    }
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const addEnrollment = () => {
    if (selectedCourse && selectedBatch) {
      setFormData({
        ...formData,
        enrolledCourses: [
          ...(formData.enrolledCourses || []),
          {
            course: selectedCourse,
            batchNumber: selectedBatch,
            enrollmentDate: new Date(),
            status: "ACTIVE",
            progress: 0,
          },
        ],
      });
      setSelectedCourse("");
      setSelectedBatch(undefined);
    }
  };

  const removeEnrollment = (index: number) => {
    setFormData({
      ...formData,
      enrolledCourses: formData.enrolledCourses?.filter((_, i) => i !== index),
    });
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-default-500">Loading student data...</p>
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
            {mode === "create" ? "Create New Student" : "Edit Student"}
          </h1>
          <p className="text-default-500 mt-1">
            {mode === "create"
              ? "Fill in the details to create a new student"
              : "Update the student details"}
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
                  Fill in the basic details of the student
                </p>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("name") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {getFieldError("name") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("name")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("email") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {getFieldError("email") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("email")}
                  </p>
                )}
              </LabelInputContainer>

              {mode === "create" && (
                <LabelInputContainer>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    required
                    className={cn(
                      "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                      getFieldError("password") &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                    )}
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  {getFieldError("password") && (
                    <p className="text-sm text-red-500 mt-1">
                      {getFieldError("password")}
                    </p>
                  )}
                </LabelInputContainer>
              )}

              <LabelInputContainer>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  aria-label="Select Status"
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("status") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  selectedKeys={[formData.status]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as UserStatus,
                    })
                  }
                >
                  {Object.values(UserStatus).map((status) => (
                    <SelectItem 
                      key={status}
                      aria-label={status}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </Select>
                {getFieldError("status") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("status")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Education Section */}
              <LabelInputContainer className="col-span-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Education
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                  Add the student&apos;s educational background
                </p>
              </LabelInputContainer>

              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    className={cn(
                      "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                      getFieldError("education") &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                    )}
                    placeholder="Institution"
                    value={newEducation.institution}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        institution: e.target.value,
                      })
                    }
                  />
                  <Input
                    className={cn(
                      "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                      getFieldError("education") &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                    )}
                    placeholder="Degree"
                    value={newEducation.degree}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        degree: e.target.value,
                      })
                    }
                  />
                  <Input
                    className={cn(
                      "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                      getFieldError("education") &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                    )}
                    placeholder="Field"
                    value={newEducation.field}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        field: e.target.value,
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <Input
                      className={cn(
                        "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                        getFieldError("education") &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                      )}
                      placeholder="Graduation Year"
                      type="number"
                      value={newEducation.graduationYear || ""}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          graduationYear: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                    />
                    <Button onPress={addEducation}>Add</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {formData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{edu.institution}</p>
                        <p className="text-sm text-default-500">
                          {edu.degree} in {edu.field}
                          {edu.graduationYear
                            ? ` (${edu.graduationYear})`
                            : ""}
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => removeEducation(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {getFieldError("education") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("education")}
                  </p>
                )}
              </div>

              {/* Skills Section */}
              <LabelInputContainer className="col-span-2">
                <Label htmlFor="skills">Skills</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    className={cn(
                      "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                      getFieldError("skills") &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                    )}
                    id="skills"
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                  />
                  <Button onPress={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Chip key={index} onClose={() => removeSkill(index)}>
                      {skill}
                    </Chip>
                  ))}
                </div>
                {getFieldError("skills") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("skills")}
                  </p>
                )}
              </LabelInputContainer>

              {/* Social Links Section */}
              <LabelInputContainer className="col-span-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Social Links
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                  Add the student&apos;s professional profiles
                </p>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="githubProfile">GitHub Profile</Label>
                <Input
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("githubProfile") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="githubProfile"
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.githubProfile}
                  onChange={(e) =>
                    setFormData({ ...formData, githubProfile: e.target.value })
                  }
                />
                {getFieldError("githubProfile") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("githubProfile")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                <Input
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("linkedinProfile") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="linkedinProfile"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinProfile}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedinProfile: e.target.value })
                  }
                />
                {getFieldError("linkedinProfile") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("linkedinProfile")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="portfolio">Portfolio</Label>
                <Input
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("portfolio") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="portfolio"
                  type="url"
                  placeholder="https://portfolio.com"
                  value={formData.portfolio}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolio: e.target.value })
                  }
                />
                {getFieldError("portfolio") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("portfolio")}
                  </p>
                )}
              </LabelInputContainer>
            </div>
          </CardBody>
        </Card>

        {/* Add Course Enrollment Section */}
        <Card className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/10 hover:border-blue-500/50 hover:animate-neon-pulse dark:hover:border-blue-400/50">
          <CardBody className="gap-6">
            <LabelInputContainer className="col-span-2">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                Course Enrollment
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                Enroll the student in available courses
              </p>
            </LabelInputContainer>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="course">Course</Label>
                <Select
                  id="course"
                  aria-label="Select Course"
                  selectedKeys={selectedCourse ? [selectedCourse] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    console.log("Selected course:", selected);
                    setSelectedCourse(selected);
                    setSelectedBatch(undefined);
                  }}
                  className="w-full"
                >
                  {availableCourses.map((course) => (
                    <SelectItem 
                      key={course._id} 
                      textValue={course.title}
                      aria-label={`${course.title} (Batch ${course.currentBatch.batchNumber})`}
                    >
                      {course.title} (Batch {course.currentBatch.batchNumber})
                    </SelectItem>
                  ))}
                </Select>

                {/* Add debug display */}
                <div className="text-sm text-gray-500 mt-1">
                  Selected Course ID: {selectedCourse}
                </div>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="batch">Batch Number</Label>
                <Input
                  id="batch"
                  type="number"
                  value={selectedBatch || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    const course = availableCourses.find(c => c._id === selectedCourse);
                    const maxBatch = course?.currentBatch?.batchNumber || 1;
                    
                    if (value > 0 && value <= maxBatch) {
                      setSelectedBatch(value);
                    } else {
                      setSelectedBatch(undefined);
                    }
                  }}
                  min={1}
                  max={availableCourses.find(c => c._id === selectedCourse)?.currentBatch?.batchNumber || 1}
                  placeholder="Enter batch number"
                  className="w-full"
                />
                {selectedCourse && (
                  <p className="text-sm text-default-500 mt-1">
                    Available batches: 1 to {availableCourses.find(c => c._id === selectedCourse)?.currentBatch?.batchNumber || 1}
                  </p>
                )}
              </LabelInputContainer>
            </div>

            <Button
              onPress={addEnrollment}
              isDisabled={!selectedCourse || !selectedBatch || selectedBatch < 1}
              className="mt-2"
            >
              Add Enrollment
            </Button>

            <div className="space-y-2">
              {formData.enrolledCourses?.map((enrollment, index) => {
                const course = availableCourses.find(
                  (c) => c._id === enrollment.course
                );
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{course?.title}</p>
                      <p className="text-sm text-default-500">
                        Batch {enrollment.batchNumber}
                      </p>
                    </div>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => removeEnrollment(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
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
            {mode === "create" ? "Create Student" : "Update Student"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
} 