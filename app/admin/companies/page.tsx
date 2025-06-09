"use client";

import type { ICompany } from "@/models/Company";

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

import { getCompaniesData } from "./CompaniesData";
import { deleteCompany } from "@/app/actions/company";

// Update the Company type to use ICompany but with string _id
type Company = Omit<ICompany, "_id"> & { _id: string };

const columns = [
  { key: "name", label: "NAME" },
  { key: "description", label: "DESCRIPTION" },
  { key: "contactPersonName", label: "CONTACT PERSON" },
  { key: "contactPersonEmail", label: "CONTACT EMAIL" },
  { key: "website", label: "WEBSITE" },
  { key: "actions", label: "ACTIONS" },
];

// Create a separate component for the companies table
function CompaniesTable({
  companies,
  loading,
  onDelete,
  onEdit,
  onView,
}: {
  companies: Company[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (company: Company) => void;
}) {
  const renderCell = (company: Company, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-2">
            {company.logo && (
              <img
                src={company.logo}
                alt={company.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="font-medium">{company.name}</span>
          </div>
        );
      case "description":
        return (
          <div className="max-w-md truncate" title={company.description}>
            {company.description}
          </div>
        );
      case "website":
        return company.website ? (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {company.website}
          </a>
        ) : (
          "-"
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="View Details">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onView(company)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Company">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(company._id)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete Company">
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onPress={() => onDelete(company._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        const value = company[columnKey as keyof Company];
        return typeof value === "object" ? JSON.stringify(value) : String(value);
    }
  };

  return (
    <div className="relative group/input bg-background/30 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 rounded-xl overflow-hidden">
      <Table
        aria-label="Companies table"
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
          items={companies}
          loadingContent={<div>Loading...</div>}
          loadingState={loading ? "loading" : "idle"}
        >
          {(company) => (
            <TableRow key={company._id}>
              {(columnKey) => (
                <TableCell>{renderCell(company, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Loading component
function CompaniesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-default-500">Loading companies...</p>
      </div>
    </div>
  );
}

export default function AdminCompanies() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { companies: fetchedCompanies, pagination, error } = await getCompaniesData(page);

      if (error) {
        addToast({ title: error, color: "danger" });
        return;
      }

      setCompanies(fetchedCompanies);
      setTotalPages(pagination.pages);
    } catch (error: any) {
      addToast({ title: error.message, color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCompany(id);
      if (!response.success) {
        addToast({ title: response.error || "Failed to delete company", color: "danger" });
        return;
      }

      addToast({ title: "Company deleted successfully", color: "success" });
      fetchCompanies();
    } catch (error: any) {
      addToast({ title: error.message, color: "danger" });
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/companies/${id}`);
  };

  const handleView = (company: Company) => {
    setSelectedCompany(company);
    onOpen();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Button
          color="primary"
          endContent={<Plus className="w-4 h-4" />}
          onPress={() => router.push("/admin/companies/new")}
        >
          Add Company
        </Button>
      </div>

      {loading ? (
        <CompaniesLoading />
      ) : (
        <CompaniesTable
          companies={companies}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {/* Company Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {selectedCompany?.name}
              </ModalHeader>
              <ModalBody>
                {selectedCompany && (
                  <div className="space-y-4">
                    {selectedCompany.logo && (
                      <div className="flex justify-center">
                        <img
                          src={selectedCompany.logo}
                          alt={selectedCompany.name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">Description</h3>
                      <p className="text-default-500">{selectedCompany.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">Contact Person</h3>
                        <p className="text-default-500">{selectedCompany.contactPersonName}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Contact Email</h3>
                        <p className="text-default-500">{selectedCompany.contactPersonEmail}</p>
                      </div>
                    </div>
                    {selectedCompany.website && (
                      <div>
                        <h3 className="font-semibold">Website</h3>
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedCompany.website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    if (selectedCompany) {
                      handleEdit(selectedCompany._id);
                    }
                  }}
                >
                  Edit Company
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 