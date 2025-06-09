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
  Pagination,
} from "@heroui/react";
import { Plus, Pencil, Trash2, Eye, QrCode } from "lucide-react";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

import { getCertificatesData, type Certificate } from "./CertificatesData";
import { deleteCertificate, updateCertificateStatus } from "@/app/actions/certificate";
import { formatDate } from "@/lib/utils";

const columns = [
  { key: "certificateCode", label: "CODE" },
  { key: "student", label: "STUDENT" },
  { key: "course", label: "COURSE" },
  { key: "issueDate", label: "ISSUE DATE" },
  { key: "expiryDate", label: "EXPIRY DATE" },
  { key: "status", label: "STATUS" },
  { key: "actions", label: "ACTIONS" },
];

const statusColors = {
  ACTIVE: "success",
  REVOKED: "danger",
  EXPIRED: "warning",
} as const;

// Create a separate component for the certificates table
function CertificatesTable({
  certificates,
  loading,
  onDelete,
  onStatusChange,
  onEdit,
  onView,
  onViewQR,
}: {
  certificates: Certificate[];
  loading: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "ACTIVE" | "REVOKED" | "EXPIRED") => void;
  onEdit: (id: string) => void;
  onView: (certificate: Certificate) => void;
  onViewQR: (certificate: Certificate) => void;
}) {
  const renderCell = (certificate: Certificate, columnKey: string) => {
    switch (columnKey) {
      case "certificateCode":
        return (
          <div className="font-mono text-sm">
            {certificate.certificateCode}
          </div>
        );
      case "student":
        return (
          <div className="flex flex-col">
            <span className="font-medium">{certificate.studentId.name}</span>
            <span className="text-sm text-default-500">
              {certificate.studentId.email}
            </span>
          </div>
        );
      case "course":
        return certificate.courseId.title;
      case "issueDate":
        return formatDate(certificate.issueDate);
      case "expiryDate":
        return certificate.expiryDate
          ? formatDate(certificate.expiryDate)
          : "Never";
      case "status":
        return (
          <Chip
            color={statusColors[certificate.status]}
            size="sm"
            variant="flat"
          >
            {certificate.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="View QR Code">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onViewQR(certificate)}
              >
                <QrCode className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="View Details">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onView(certificate)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Certificate">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(certificate._id)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Certificate">
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onPress={() => onDelete(certificate._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        const value = certificate[columnKey as keyof Certificate];
        return typeof value === "object" ? JSON.stringify(value) : String(value);
    }
  };

  return (
    <div className="relative group/input bg-background/30 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 rounded-xl overflow-hidden">
      <Table
        aria-label="Certificates table"
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
          items={certificates}
          loadingContent={<div>Loading...</div>}
          loadingState={loading ? "loading" : "idle"}
        >
          {(certificate) => (
            <TableRow key={certificate._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(certificate, columnKey as string)}
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
function CertificatesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-default-500">Loading certificates...</p>
      </div>
    </div>
  );
}

export default function AdminCertificates() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { certificates: fetchedCertificates, pagination, error } = await getCertificatesData(page);

      if (error) {
        addToast({ title: error, color: "danger" });
        return;
      }

      setCertificates(fetchedCertificates);
      setTotalPages(pagination?.pages ?? 1);
    } catch (error: any) {
      addToast({ title: error.message, color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      const response = await deleteCertificate(id);
      if (!response.success) {
        addToast({ title: response.error || "Failed to delete certificate", color: "danger" });
        return;
      }

      addToast({ title: "Certificate deleted successfully", color: "success" });
      fetchCertificates();
    } catch (error: any) {
      addToast({ title: error.message, color: "danger" });
    }
  };

  const handleStatusChange = async (id: string, status: "ACTIVE" | "REVOKED" | "EXPIRED") => {
    try {
      const response = await updateCertificateStatus(id, status);
      if (!response.success) {
        addToast({ title: response.error || "Failed to update certificate status", color: "danger" });
        return;
      }

      addToast({ title: "Certificate status updated successfully", color: "success" });
      fetchCertificates();
    } catch (error: any) {
      addToast({ title: error.message, color: "danger" });
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/certificates/${id}/edit`);
  };

  const handleView = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    onOpen();
  };

  const handleViewQR = (certificate: Certificate) => {
    // TODO: Implement QR code modal
    console.log("View QR code for certificate:", certificate.certificateCode);
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Certificates
          </h1>
          <p className="text-default-500">Manage and track student certificates</p>
        </div>
        <Button
          color="primary"
          endContent={<Plus className="w-4 h-4" />}
          onPress={() => router.push("/admin/certificates/new")}
        >
          Issue Certificate
        </Button>
      </motion.div>

      {loading ? (
        <CertificatesLoading />
      ) : (
        <>
          <CertificatesTable
            certificates={certificates}
            loading={loading}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onView={handleView}
            onViewQR={handleViewQR}
          />
          <div className="flex justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={totalPages}
              onChange={setPage}
            />
          </div>
        </>
      )}

      {/* Certificate Details Modal */}
      <Modal isOpen={isOpen} size="lg" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Certificate Details</ModalHeader>
              <ModalBody>
                {selectedCertificate && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Certificate Code: {selectedCertificate.certificateCode}
                      </h3>
                      <p className="text-default-500">
                        Status:{" "}
                        <Chip
                          color={statusColors[selectedCertificate.status]}
                          size="sm"
                          variant="flat"
                        >
                          {selectedCertificate.status}
                        </Chip>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-default-500">Student</p>
                        <p className="font-medium">{selectedCertificate.studentId.name}</p>
                        <p className="text-sm text-default-500">{selectedCertificate.studentId.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Course</p>
                        <p className="font-medium">{selectedCertificate.courseId.title}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-default-500">Issue Date</p>
                        <p>{formatDate(selectedCertificate.issueDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Expiry Date</p>
                        <p>
                          {selectedCertificate.expiryDate
                            ? formatDate(selectedCertificate.expiryDate)
                            : "Never"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-default-500">Issued By</p>
                      <p className="font-medium">{selectedCertificate.issuedBy.name}</p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {selectedCertificate && (
                  <>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() => {
                        onClose();
                        handleViewQR(selectedCertificate);
                      }}
                    >
                      View QR Code
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => {
                        onClose();
                        handleEdit(selectedCertificate._id);
                      }}
                    >
                      Edit Certificate
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 