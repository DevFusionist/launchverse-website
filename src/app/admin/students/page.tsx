"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/admin/DataTable";

interface APIStudent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: {
    title: string;
  };
  enrollmentDate: string;
  completionDate?: string;
  status: "enrolled" | "completed" | "dropped";
  createdAt: string;
  _count: {
    certificates: number;
  };
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: {
    name: string;
  };
  enrollmentDate: Date;
  completionDate?: Date;
  status: "enrolled" | "completed" | "dropped";
  createdAt: Date;
  _count?: {
    certificates: number;
  };
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

export default function StudentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const fetchStudents = useCallback(
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

        const response = await fetch(
          `/api/admin/students?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const { data, pagination } = await response.json();
        setStudents(
          data.map((student: APIStudent) => ({
            id: student._id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            course: {
              name: student.course.title,
            },
            enrollmentDate: new Date(student.enrollmentDate),
            completionDate: student.completionDate
              ? new Date(student.completionDate)
              : undefined,
            status: student.status,
            createdAt: new Date(student.createdAt),
            _count: student._count,
          }))
        );
        setTotalItems(pagination.total);
      } catch (error) {
        console.error("Error fetching students:", error);
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
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    setCurrentPage(page);
    setSearchTerm(search);
    setSortConfig(sortBy ? { key: sortBy, direction: sortOrder } : null);

    fetchStudents(
      page,
      search,
      sortBy ? { key: sortBy, direction: sortOrder } : null
    );
  }, [session, status, router, searchParams, fetchStudents]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", term);
    params.set("page", "1");
    router.push(`/admin/students?${params.toString()}`);
  };

  const handleSort = (column: Column<Student>) => {
    if (!column.sortable) return;

    const params = new URLSearchParams(searchParams.toString());
    const currentSort = sortConfig?.key === column.accessor;
    const newDirection =
      currentSort && sortConfig?.direction === "asc" ? "desc" : "asc";

    params.set("sortBy", column.accessor);
    params.set("sortOrder", newDirection);
    params.set("page", "1");
    router.push(`/admin/students?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/students?${params.toString()}`);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-primary"></div>
      </div>
    );
  }

  const columns: Column<Student>[] = [
    { header: "Name", accessor: "name", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
    { header: "Phone", accessor: "phone", sortable: true },
    {
      header: "Course",
      accessor: "course",
      sortable: true,
      type: "nested",
      nestedKey: "name",
    },
    {
      header: "Enrollment Date",
      accessor: "enrollmentDate",
      sortable: true,
      type: "date",
    },
    {
      header: "Completion Date",
      accessor: "completionDate",
      sortable: true,
      type: "date",
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      type: "text",
    },
    {
      header: "Certificates",
      accessor: "_count",
      sortable: true,
      type: "count",
    },
    {
      header: "Created",
      accessor: "createdAt",
      sortable: true,
      type: "date",
    },
  ];

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-neon-text-light dark:text-neon-text-dark">
            Students
          </h1>
          <p className="mt-2 text-sm text-neon-text-light/60 dark:text-neon-text-dark/60">
            A list of all students enrolled at Launch Verse Academy.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => router.push("/admin/students/new?refresh=true")}
            className="block rounded-md bg-neon-primary dark:bg-neon-primary-dark px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary dark:focus-visible:outline-neon-primary-dark"
          >
            Add Student
          </button>
        </div>
      </div>
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={students}
          searchable={true}
          searchPlaceholder="Search students..."
          onSearch={handleSearch}
          onSort={handleSort}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          totalItems={totalItems}
          sortConfig={sortConfig}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}
