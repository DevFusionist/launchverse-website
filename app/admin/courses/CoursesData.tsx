import type { ICourse } from "@/models/Course";

import { getCourses } from "@/app/actions/course";

export async function getCoursesData(page: number, limit: number = 10) {
  const response = await getCourses({ page, limit });

  if (response.success && response.courses) {
    const transformedCourses = response.courses.map(
      (course: Partial<ICourse>) => ({
        ...course,
        _id: course._id?.toString() || "",
        createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
      }),
    ) as ICourse[];

    return {
      courses: transformedCourses,
      pagination: response.pagination,
      error: null,
    };
  }

  return {
    courses: [],
    pagination: { total: 0, page, limit, pages: 1 },
    error: response.error,
  };
}
