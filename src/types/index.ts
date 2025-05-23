import { IUser } from "@/models/User";
import { ICourse } from "@/models/Course";
import { IStudent } from "@/models/Student";
import { ICertificate } from "@/models/Certificate";

export type { IUser, ICourse, IStudent, ICertificate };

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  priceRange: {
    min: number;
    max: number;
  };
  duration: {
    min: number;
    max: number;
  };
  durationUnit: string;
  isActive: boolean;
  isComingSoon: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
  expires: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseFormData {
  title: string;
  description: string;
  priceRange: {
    min: number;
    max: number;
  };
  duration: {
    min: number;
    max: number;
  };
  durationUnit: "months" | "weeks";
  isActive: boolean;
  isComingSoon: boolean;
  features: string[];
}

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  enrollmentDate: Date;
  status: "enrolled" | "completed" | "dropped";
}

export interface CertificateFormData {
  student: string;
  course: string;
  validUntil: Date;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface VerifyCertificateFormData {
  certificateId: string;
}
