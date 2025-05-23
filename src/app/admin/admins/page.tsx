"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/admin/DataTable";
import AddAdminModal from "@/components/admin/AddAdminModal";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
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

function AddAdminButton({ onAdminAdded }: { onAdminAdded: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="block rounded-md bg-neon-primary dark:bg-neon-primary-dark px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary dark:focus-visible:outline-neon-primary-dark"
      >
        Add Administrator
      </button>
      <AddAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdminAdded={onAdminAdded}
      />
    </>
  );
}

function AdminsPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const fetchAdmins = useCallback(
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

        const response = await fetch(`/api/admin/admins?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }
        const { data, pagination } = await response.json();
        setAdmins(data);
        setTotalItems(pagination.total);
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.role !== "super_admin") {
      router.push("/");
      return;
    }

    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

    setCurrentPage(page);
    setSearchTerm(search);
    setSortConfig(sortBy ? { key: sortBy, direction: sortOrder } : null);

    fetchAdmins(
      page,
      search,
      sortBy ? { key: sortBy, direction: sortOrder } : null
    );
  }, [session, status, router, searchParams, fetchAdmins]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", term);
    params.set("page", "1");
    router.push(`/admin/admins?${params.toString()}`);
  };

  const handleSort = (column: Column<Admin>) => {
    if (!column.sortable) return;

    const params = new URLSearchParams(searchParams.toString());
    const currentSort = sortConfig?.key === column.accessor;
    const newDirection =
      currentSort && sortConfig?.direction === "asc" ? "desc" : "asc";

    params.set("sortBy", column.accessor);
    params.set("sortOrder", newDirection);
    params.set("page", "1");
    router.push(`/admin/admins?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/admins?${params.toString()}`);
  };

  const refreshData = useCallback(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

    fetchAdmins(
      page,
      search,
      sortBy ? { key: sortBy, direction: sortOrder } : null
    );
  }, [searchParams, fetchAdmins]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-primary"></div>
      </div>
    );
  }

  const columns: Column<Admin>[] = [
    { header: "Name", accessor: "name", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      type: "role",
    },
    {
      header: "Certificates Issued",
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
            Administrators
          </h1>
          <p className="mt-2 text-sm text-neon-text-light/60 dark:text-neon-text-dark/60">
            A list of all administrators who can manage Launch Verse Academy.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <AddAdminButton onAdminAdded={refreshData} />
        </div>
      </div>
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={admins}
          searchable={true}
          searchPlaceholder="Search administrators..."
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

export default AdminsPageContent;
