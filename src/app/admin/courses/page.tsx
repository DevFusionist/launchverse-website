"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/admin/DataTable";

interface APICourse {
  _id: string;
  title: string;
  description: string;
  duration: number;
  price: {
    min: number;
    max: number;
  };
  status: "active" | "inactive";
  _count: {
    students: number;
    certificates: number;
  };
  createdAt: string;
}

interface CourseWithCounts {
  _id: string;
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
  createdAt: Date;
  _count: {
    students: number;
    certificates: number;
  };
  studentCount: number;
  certificateCount: number;
}

interface Column<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  type?:
    | "text"
    | "number"
    | "date"
    | "currency"
    | "role"
    | "count"
    | "list"
    | "nested"
    | "duration"
    | "description";
  nestedKey?: string;
}

const columns: Column<CourseWithCounts>[] = [
  {
    header: "Title",
    accessor: "title",
    sortable: true,
    type: "text",
  },
  {
    header: "Description",
    accessor: "description",
    type: "description",
  },
  {
    header: "Price Range",
    accessor: "priceRange",
    sortable: true,
    type: "currency",
  },
  {
    header: "Duration",
    accessor: "duration",
    sortable: true,
    type: "duration",
  },
  {
    header: "Students",
    accessor: "studentCount",
    sortable: true,
    type: "count",
  },
  {
    header: "Certificates",
    accessor: "certificateCount",
    sortable: true,
    type: "count",
  },
  {
    header: "Status",
    accessor: "isActive",
    sortable: true,
    type: "text",
  },
  {
    header: "Created At",
    accessor: "createdAt",
    sortable: true,
    type: "date",
  },
];

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const fetchCourses = useCallback(
    async (
      page: number,
      search: string,
      sort: { key: string; direction: "asc" | "desc" } | null
    ) => {
      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", "10");
        if (search) params.set("search", search);
        if (sort) {
          params.set("sortBy", sort.key);
          params.set("sortOrder", sort.direction);
        }

        const response = await fetch(`/api/admin/courses?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const { courses, pagination } = await response.json();
        setCourses(
          courses.map((course: APICourse) => ({
            ...course,
            id: course._id,
            studentCount: course._count.students,
            certificateCount: course._count.certificates,
            createdAt: new Date(course.createdAt),
          }))
        );
        setTotalItems(pagination.total);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (
      !session?.user?.role ||
      !["admin", "super_admin"].includes(session.user.role)
    ) {
      router.push("/");
      return;
    }

    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "title";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

    setCurrentPage(page);
    setSearchTerm(search);
    setSortConfig(sortBy ? { key: sortBy, direction: sortOrder } : null);

    fetchCourses(
      page,
      search,
      sortBy ? { key: sortBy, direction: sortOrder } : null
    );
  }, [session, status, router, searchParams, fetchCourses]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", term);
    params.set("page", "1");
    router.push(`/admin/courses?${params.toString()}`);
  };

  const handleSort = (column: Column<CourseWithCounts>) => {
    if (!column.sortable) return;

    const params = new URLSearchParams(searchParams.toString());
    const currentSort = sortConfig?.key === column.accessor;
    const newDirection =
      currentSort && sortConfig?.direction === "asc" ? "desc" : "asc";

    params.set("sortBy", column.accessor);
    params.set("sortOrder", newDirection);
    params.set("page", "1");
    router.push(`/admin/courses?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/courses?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-neon-text-light dark:text-neon-text-dark">
            Courses
          </h1>
          <p className="mt-2 text-sm text-neon-text-light/60 dark:text-neon-text-dark/60">
            A list of all courses offered at Launch Verse Academy.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => router.push("/admin/courses/new?refresh=true")}
            className="block rounded-md bg-neon-primary dark:bg-neon-primary-dark px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary dark:focus-visible:outline-neon-primary-dark"
          >
            Add Course
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={courses}
        searchable
        searchPlaceholder="Search courses..."
        onSearch={handleSearch}
        onSort={handleSort}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        totalItems={totalItems}
        sortConfig={sortConfig}
        searchTerm={searchTerm}
      />
    </div>
  );
}
