"use client";

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
} from "@heroui/react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

import { getStudentsData } from "./StudentsData";

import { UserStatus } from "@/lib/types";
import { deleteStudent, updateStudentStatus } from "@/app/actions/student";

// Define the Student type from StudentsData
type Student = Awaited<ReturnType<typeof getStudentsData>>["students"][number];

const columns = [
  { key: "name", label: "NAME" },
  { key: "email", label: "EMAIL" },
  { key: "status", label: "STATUS" },
  { key: "createdAt", label: "JOINED" },
  { key: "actions", label: "ACTIONS" },
];

const statusColors = {
  [UserStatus.ACTIVE]: "success",
  [UserStatus.INACTIVE]: "danger",
  [UserStatus.PENDING]: "warning",
} as const;

// Create a separate component for the students table
function StudentsTable({
  students,
  loading,
  onDelete,
  onStatusChange,
  onEdit,
  onView,
}: {
  students: Student[];
  loading: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: UserStatus) => void;
  onEdit: (id: string) => void;
  onView: (student: Student) => void;
}) {
  const renderCell = (student: Student, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <span className="font-medium">{student.user.name}</span>
            <span className="text-sm text-default-500">Student</span>
          </div>
        );
      case "email":
        return student.user.email;
      case "createdAt":
        return new Date(student.createdAt).toLocaleDateString();
      case "status":
        return (
          <Chip
            color={statusColors[student.user.status]}
            size="sm"
            variant="flat"
          >
            {student.user.status}
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
                onPress={() => onView(student)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Student">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(student._id)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Student">
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onPress={() => onDelete(student._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        const value = student[columnKey as keyof Student];

        return typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
    }
  };

  return (
    <div className="relative group/input bg-background/30 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 rounded-xl overflow-hidden">
      <Table
        aria-label="Students table"
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
          items={students}
          loadingContent={<div>Loading...</div>}
          loadingState={loading ? "loading" : "idle"}
        >
          {(student) => (
            <TableRow key={student._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(student, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Loading component
function StudentsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-default-500">Loading students...</p>
      </div>
    </div>
  );
}

export default function AdminStudents() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const {
        students: fetchedStudents,
        pagination,
        error,
      } = await getStudentsData(page);

      if (error) {
        addToast({ title: error, color: "danger" });
      } else {
        setStudents(fetchedStudents);
        setTotalPages(pagination?.pages || 1);
      }
    } catch (error) {
      addToast({
        title: "An error occurred while fetching students",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await deleteStudent(id);

      if (response.success) {
        addToast({ title: "Student deleted successfully", color: "success" });
        fetchStudents();
      } else {
        addToast({
          title: response.error || "Failed to delete student",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "An error occurred while deleting the student",
        color: "danger",
      });
    }
  };

  const handleStatusChange = async (id: string, status: UserStatus) => {
    try {
      const response = await updateStudentStatus(id, status);

      if (response.success) {
        addToast({
          title: "Student status updated successfully",
          color: "success",
        });
        fetchStudents();
      } else {
        addToast({
          title: response.error || "Failed to update student status",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "An error occurred while updating student status",
        color: "danger",
      });
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/students/${id}/edit`);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
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
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-default-500">Manage your students</p>
        </div>
        <Button
          color="primary"
          endContent={<Plus className="w-4 h-4" />}
          onPress={() => router.push("/admin/students/new")}
        >
          Add Student
        </Button>
      </motion.div>

      {loading ? (
        <StudentsLoading />
      ) : (
        <StudentsTable
          loading={loading}
          students={students}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onView={handleView}
        />
      )}

      {/* View Student Modal */}
      <Modal isOpen={isOpen} size="lg" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Student Details</ModalHeader>
              <ModalBody>
                {selectedStudent && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedStudent.user.name}
                      </h3>
                      <p className="text-default-500">
                        {selectedStudent.user.email}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-default-500">Status</p>
                        <Chip
                          color={statusColors[selectedStudent.user.status]}
                          size="sm"
                          variant="flat"
                        >
                          {selectedStudent.user.status}
                        </Chip>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Joined</p>
                        <p>
                          {new Date(
                            selectedStudent.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {selectedStudent && (
                  <Button
                    color="primary"
                    onPress={() => {
                      onClose();
                      handleEdit(selectedStudent._id);
                    }}
                  >
                    Edit Student
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
