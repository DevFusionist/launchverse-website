"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import DescriptionModal from "./DescriptionModal";

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

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  onSearch?: (term: string) => void;
  onSort?: (column: Column<T>) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalItems?: number;
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  searchTerm?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  itemsPerPage = 10,
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  onSearch,
  onSort,
  onPageChange,
  currentPage = 1,
  totalItems = 0,
  sortConfig,
  searchTerm = "",
}: DataTableProps<T>) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  // Handle search with debounce
  const handleSearch = (value: string) => {
    setLocalSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const formatValue = (
    value: any,
    type?: string,
    nestedKey?: string,
    item?: T
  ) => {
    if (value === null || value === undefined) return "";

    switch (type) {
      case "date":
        return new Intl.DateTimeFormat("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(value));
      case "currency":
        if (typeof value === "object" && value !== null) {
          if (value.min !== undefined && value.max !== undefined) {
            return `₹${value.min.toLocaleString()} - ₹${value.max.toLocaleString()}`;
          }
          return `₹${Number(value).toLocaleString()}`;
        }
        return `₹${Number(value).toLocaleString()}`;
      case "duration":
        if (typeof value === "object" && value !== null) {
          const unit = value.durationUnit || "months";
          if (value.min !== undefined && value.max !== undefined) {
            return `${value.min} - ${value.max} ${unit}`;
          }
          return `${value} ${unit}`;
        }
        return String(value);
      case "role":
        return value === "super_admin" ? "Super Admin" : "Admin";
      case "count":
        if (typeof value === "object" && value !== null) {
          const count = Object.values(value)[0];
          return typeof count === "number" ? count.toString() : String(count);
        }
        return String(value);
      case "list":
        if (Array.isArray(value)) {
          return value.map((item) => item.name || item).join(", ");
        }
        return String(value);
      case "nested":
        if (typeof value === "object" && value !== null && nestedKey) {
          return value[nestedKey] || "";
        }
        return String(value);
      case "text":
        if (typeof value === "boolean") {
          return value ? "Active" : "Inactive";
        }
        return String(value);
      case "description":
        return (
          <div className="flex flex-col gap-2">
            <span>{truncateText(String(value))}</span>
            {String(value).length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalState({
                    isOpen: true,
                    title: item?.title || "",
                    description: String(value),
                  });
                }}
                className="text-sm text-neon-primary dark:text-neon-primary-dark hover:underline focus:outline-none"
              >
                Read More
              </button>
            )}
          </div>
        );
      default:
        return String(value);
    }
  };

  return (
    <div className="w-full">
      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={localSearchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-md border border-neon-primary/10 dark:border-neon-primary-dark/10 rounded px-3 py-2 bg-neon-background-light dark:bg-neon-background-dark text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neon-primary/10 dark:border-neon-primary-dark/10">
        <table className="min-w-full divide-y divide-neon-primary/10 dark:divide-neon-primary-dark/10">
          <thead className="bg-neon-card-light dark:bg-neon-card-dark">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-neon-text-light/60 dark:text-neon-text-dark/60 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer" : ""
                  }`}
                  onClick={() => column.sortable && onSort?.(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortConfig?.key === column.accessor && (
                      <span>
                        {sortConfig.direction === "asc" ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-neon-background-light dark:bg-neon-background-dark divide-y divide-neon-primary/10 dark:divide-neon-primary-dark/10">
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
                className={`${
                  onRowClick
                    ? "cursor-pointer hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5"
                    : ""
                }`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-sm text-neon-text-light dark:text-neon-text-dark"
                  >
                    {formatValue(
                      item[column.accessor],
                      column.type,
                      column.nestedKey,
                      item
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-neon-card-light dark:bg-neon-card-dark border-t border-neon-primary/10 dark:border-neon-primary-dark/10 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-neon-primary/10 dark:border-neon-primary-dark/10 text-sm font-medium rounded-md text-neon-text-light dark:text-neon-text-dark bg-neon-background-light dark:bg-neon-background-dark hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-neon-primary/10 dark:border-neon-primary-dark/10 text-sm font-medium rounded-md text-neon-text-light dark:text-neon-text-dark bg-neon-background-light dark:bg-neon-background-dark hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neon-text-light/60 dark:text-neon-text-dark/60">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark text-sm font-medium text-neon-text-light dark:text-neon-text-dark hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange?.(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? "z-10 bg-neon-primary dark:bg-neon-primary-dark text-white"
                          : "bg-neon-background-light dark:bg-neon-background-dark text-neon-text-light dark:text-neon-text-dark hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5"
                      } border-neon-primary/10 dark:border-neon-primary-dark/10`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark text-sm font-medium text-neon-text-light dark:text-neon-text-dark hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <DescriptionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        description={modalState.description}
      />
    </div>
  );
}
