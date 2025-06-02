"use client";

import type { ICourse } from "@/models/Course";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

import { getCoursesData } from "./CoursesData";

import { CourseStatus } from "@/lib/types";
import { deleteCourse, updateCourseStatus } from "@/app/actions/course";

// Update the Course type to use ICourse but with string _id
type Course = Omit<ICourse, "_id"> & { _id: string };

const columns = [
  { key: "title", label: "TITLE" },
  { key: "category", label: "CATEGORY" },
  { key: "level", label: "LEVEL" },
  { key: "price", label: "PRICE" },
  { key: "enrolledStudents", label: "ENROLLED" },
  { key: "status", label: "STATUS" },
  { key: "actions", label: "ACTIONS" },
];

const statusColors = {
  [CourseStatus.DRAFT]: "warning",
  [CourseStatus.PUBLISHED]: "success",
  [CourseStatus.ARCHIVED]: "danger",
} as const;

// Create a separate component for the courses table
function CoursesTable({
  courses,
  loading,
  onDelete,
  onStatusChange,
  onEdit,
  onView,
}: {
  courses: Course[];
  loading: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: CourseStatus) => void;
  onEdit: (id: string) => void;
  onView: (course: Course) => void;
}) {
  const renderCell = (course: Course, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <span className="font-medium">{course.title}</span>
            <span className="text-sm text-default-500">
              {course.shortDescription}
            </span>
          </div>
        );
      case "price":
        return `₹${course.price.toLocaleString()}`;
      case "enrolledStudents":
        return `${course.currentBatch.enrolledStudents}/${course.currentBatch.maxStudents}`;
      case "status":
        return (
          <Chip color={statusColors[course.status]} size="sm" variant="flat">
            {course.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="View Details">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onView(course)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Course">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(course._id)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Course">
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onPress={() => onDelete(course._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        const value = course[columnKey as keyof Course];

        return typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
    }
  };

  return (
    <div className="relative group/input bg-background/30 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 rounded-xl overflow-hidden">
      <Table
        aria-label="Courses table"
        classNames={{
          wrapper: "min-h-[400px]",
          th: "bg-background/50 backdrop-blur-md",
          td: "border-b border-white/5",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={courses}
          loadingContent={<div>Loading...</div>}
          loadingState={loading ? "loading" : "idle"}
        >
          {(course) => (
            <TableRow key={course._id}>
              {(columnKey) => (
                <TableCell>{renderCell(course, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Loading component
function CoursesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-default-500">Loading courses...</p>
      </div>
    </div>
  );
}

export default function AdminCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const {
        courses: fetchedCourses,
        pagination,
        error,
      } = await getCoursesData(page);

      if (error) {
        addToast({ title: error, color: "danger" });
      } else {
        setCourses(fetchedCourses as Course[]);
        setTotalPages(pagination?.pages || 1);
      }
    } catch (error) {
      addToast({
        title: "An error occurred while fetching courses",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await deleteCourse(id);

      if (response.success) {
        addToast({ title: "Course deleted successfully", color: "success" });
        fetchCourses();
      } else {
        addToast({
          title: response.error || "Failed to delete course",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "An error occurred while deleting the course",
        color: "danger",
      });
    }
  };

  const handleStatusChange = async (id: string, status: CourseStatus) => {
    try {
      const response = await updateCourseStatus(id, status);

      if (response.success) {
        addToast({
          title: "Course status updated successfully",
          color: "success",
        });
        fetchCourses();
      } else {
        addToast({
          title: response.error || "Failed to update course status",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "An error occurred while updating course status",
        color: "danger",
      });
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/courses/${id}/edit`);
  };

  const handleView = (course: Course) => {
    setSelectedCourse(course);
    onOpen();
  };

  return (
    <div className="space-y-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Course Management
          </h1>
          <p className="text-default-500 mt-1">
            Manage your courses and batches
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          variant="shadow"
          onPress={() => router.push("/admin/courses/new")}
        >
          Add New Course
        </Button>
      </motion.div>

      {loading ? (
        <CoursesLoading />
      ) : (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CoursesTable
            courses={courses}
            loading={loading}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
            onView={handleView}
          />

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              isDisabled={page === 1}
              size="sm"
              variant="flat"
              onPress={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              isDisabled={page === totalPages}
              size="sm"
              variant="flat"
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}

      {/* Course Details Modal */}
      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Course Details</ModalHeader>
              <ModalBody>
                {selectedCourse && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedCourse.title}
                      </h3>
                      <p className="text-default-500">
                        {selectedCourse.shortDescription}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-default-500">Category</p>
                        <p>{selectedCourse.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Level</p>
                        <p>{selectedCourse.level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Price</p>
                        <p>₹{selectedCourse.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Duration</p>
                        <p>{selectedCourse.duration} hours</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Status</p>
                        <Select
                          value={selectedCourse.status}
                          onChange={(e) =>
                            handleStatusChange(
                              selectedCourse._id,
                              e.target.value as CourseStatus,
                            )
                          }
                        >
                          {Object.values(CourseStatus).map((status) => (
                            <SelectItem key={status} textValue={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Enrollment</p>
                        <p>
                          {selectedCourse.currentBatch.enrolledStudents} /{" "}
                          {selectedCourse.currentBatch.maxStudents}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    router.push(`/admin/courses/${selectedCourse?._id}/edit`);
                  }}
                >
                  Edit Course
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
