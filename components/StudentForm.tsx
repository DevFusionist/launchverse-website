"use client";

import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Select, SelectItem } from "@heroui/react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { createStudent, updateStudent, getStudent } from "@/app/actions/student";
import { UserStatus } from "@/lib/types";
import { Input } from "@/components/ui/InputWithEffect";
import { Label } from "@/components/ui/LabelWithEffect";
import { cn } from "@/lib/utils";
import { Chip } from "@heroui/react";

// Form validation schema
const formSchema = z.object({
  // User fields
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.PENDING]),
  // Student specific fields
  education: z.array(
    z.object({
      institution: z.string().min(1, "Institution is required"),
      degree: z.string().min(1, "Degree is required"),
      field: z.string().min(1, "Field is required"),
      graduationYear: z.number().optional(),
    })
  ).min(1, "At least one education entry is required"),
  skills: z.array(z.string()).default([]),
  githubProfile: z.string().url().optional().or(z.literal("")),
  linkedinProfile: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
});

// Form data type that matches the Student model
type FormData = {
  name: string;
  email: string;
  password?: string;
  status: UserStatus;
  education: {
    institution: string;
    degree: string;
    field: string;
    graduationYear?: number;
  }[];
  skills: string[];
  githubProfile?: string;
  linkedinProfile?: string;
  portfolio?: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  password: "",
  status: UserStatus.PENDING,
  education: [],
  skills: [],
  githubProfile: "",
  linkedinProfile: "",
  portfolio: "",
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

  useEffect(() => {
    if (mode === "edit" && studentId) {
      fetchStudent();
    }
  }, [studentId, mode]);

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
        ? formSchema.extend({ password: z.string().min(8, "Password must be at least 8 characters") })
        : formSchema;

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
                      status: e.target.value as UserStatus,
                    })
                  }
                >
                  {Object.values(UserStatus).map((status) => (
                    <SelectItem key={status}>{status}</SelectItem>
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