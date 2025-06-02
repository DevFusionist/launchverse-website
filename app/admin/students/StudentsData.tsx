import type { IStudent } from "@/models/Student";

import { getStudents } from "@/app/actions/student";
import { UserRole, UserStatus } from "@/lib/types";

// Create a type for the transformed student data
export type Student = Omit<IStudent, "_id"> & {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
  };
  enrollmentNumber: string;
  enrolledCourses: Array<{
    course: string;
    batchNumber: number;
    enrollmentDate: Date;
    status: "ACTIVE" | "COMPLETED" | "DROPPED";
    progress: number;
    certificates?: Array<{
      certificateId: string;
      issuedAt: Date;
      course: string;
      batchNumber: number;
    }>;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear?: number;
  }>;
  skills: string[];
  githubProfile?: string;
  linkedinProfile?: string;
  portfolio?: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getStudentsData(page: number, limit: number = 10) {
  const response = await getStudents({ page, limit });

  if (response.success && response.students) {
    const transformedStudents = response.students.map(
      (student: Partial<IStudent>) => {
        const user = student.user as any; // Type assertion since we know the populated structure

        return {
          ...student,
          _id: student._id?.toString() || "",
          user: {
            _id: user?._id?.toString() || "",
            name: user?.name || "",
            email: user?.email || "",
            role: user?.role || UserRole.STUDENT,
            status: user?.status || UserStatus.PENDING,
            createdAt: user?.createdAt ? new Date(user.createdAt) : new Date(),
            updatedAt: user?.updatedAt ? new Date(user.updatedAt) : new Date(),
          },
          enrolledCourses:
            student.enrolledCourses?.map((course) => ({
              ...course,
              course: course.course?.toString() || "",
              enrollmentDate: course.enrollmentDate
                ? new Date(course.enrollmentDate)
                : new Date(),
              certificates: course.certificates?.map((cert) => ({
                ...cert,
                course: cert.course?.toString() || "",
                issuedAt: cert.issuedAt ? new Date(cert.issuedAt) : new Date(),
              })),
            })) || [],
          createdAt: student.createdAt
            ? new Date(student.createdAt)
            : new Date(),
          updatedAt: student.updatedAt
            ? new Date(student.updatedAt)
            : new Date(),
        };
      },
    ) as Student[];

    return {
      students: transformedStudents,
      pagination: response.pagination,
      error: null,
    };
  }

  return {
    students: [],
    pagination: { total: 0, page, limit, pages: 1 },
    error: response.error,
  };
}
