import { z } from "zod";
import { UserStatus } from "@/lib/types";

// Education schema
export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field is required"),
  graduationYear: z.number().optional(),
});

// Certificate schema
export const certificateSchema = z.object({
  certificateId: z.string().min(1, "Certificate ID is required"),
  issuedAt: z.date(),
  course: z.string().min(1, "Course is required"),
  batchNumber: z.number().min(1, "Batch number is required"),
});

// Enrollment schema
export const enrollmentSchema = z.object({
  course: z.string().min(1, "Course is required"),
  batchNumber: z.number().min(1, "Batch number is required"),
  enrollmentDate: z.date().default(() => new Date()),
  status: z.enum(["ACTIVE", "COMPLETED", "DROPPED"]).default("ACTIVE"),
  progress: z.number().min(0).max(100).default(0),
  certificates: z.array(certificateSchema).optional(),
});

// Create student schema
export const createStudentSchema = z.object({
  // User fields (required for creation)
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  status: z
    .enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.PENDING])
    .default(UserStatus.PENDING),
  // Student specific fields
  education: z
    .array(educationSchema)
    .min(1, "At least one education entry is required"),
  skills: z.array(z.string()).default([]),
  githubProfile: z.string().url().optional().or(z.literal("")),
  linkedinProfile: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  enrolledCourses: z.array(enrollmentSchema).optional(),
});

// Update student schema (without password)
export const updateStudentSchema = createStudentSchema
  .omit({ password: true })
  .partial();

// Enrollment update schema
export const enrollmentUpdateSchema = z.object({
  course: z.string().min(1, "Course is required"),
  batchNumber: z.number().min(1, "Batch number is required"),
});

// Export types
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentUpdateSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
