"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Select, SelectItem } from "@heroui/react";
import { ArrowLeft, Plus, Upload, X, Image as ImageIcon } from "lucide-react";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";

import { createCompany, updateCompany, getCompany } from "@/app/actions/company";
import { uploadCompanyLogo, deleteCompanyLogo, getPublicIdFromUrl } from "@/app/actions/upload";
import { Input } from "@/components/ui/InputWithEffect";
import { Label } from "@/components/ui/LabelWithEffect";
import { cn } from "@/lib/utils";
import { companySchema, updateCompanySchema } from "@/lib/schemas/company";

type CompanyFormProps = {
  companyId?: string;
  mode: "create" | "edit";
};

// Form data type based on the company schema
type FormData = {
  name: string;
  description: string;
  logo?: string;
  website?: string;
  contactPersonName: string;
  contactPersonEmail: string;
};

export default function CompanyForm({ companyId, mode }: CompanyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const initialFormData: FormData = {
    name: "",
    description: "",
    logo: "",
    website: "",
    contactPersonName: "",
    contactPersonEmail: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === "edit");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "edit" && companyId) {
      fetchCompany();
    }
  }, [companyId, mode]);

  const fetchCompany = async () => {
    try {
      const response = await getCompany(companyId!);

      if (response.success && response.data) {
        setFormData(response.data);
      } else {
        addToast({
          title: response.error || "Failed to fetch company",
          color: "danger",
        });
        router.push("/admin/companies");
      }
    } catch (error) {
      addToast({
        title: "An error occurred while fetching company",
        color: "danger",
      });
      router.push("/admin/companies");
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    try {
      const schema = mode === "create" ? companySchema : updateCompanySchema;
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const getFieldError = (field: string) => errors[field];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        title: "Please fix the errors in the form",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    try {
      const response =
        mode === "create"
          ? await createCompany(formData)
          : await updateCompany(companyId!, formData);

      if (response.success) {
        addToast({
          title: `Company ${mode === "create" ? "created" : "updated"} successfully`,
          color: "success",
        });
        router.push("/admin/companies");
      } else {
        addToast({
          title: response.error || `Failed to ${mode} company`,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: `An error occurred while ${mode}ing company`,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addToast({
        title: "Please select an image file",
        color: "danger",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        title: "Image size should be less than 5MB",
        color: "danger",
      });
      return;
    }

    try {
      setUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const response = await uploadCompanyLogo(reader.result as string);
      if (!response.success) {
        throw new Error(response.error || "Failed to upload image");
      }

      // Update form data
      setFormData(prev => ({ ...prev, logo: response.url }));
      addToast({
        title: "Image uploaded successfully",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: error.message || "Failed to upload image",
        color: "danger",
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle image deletion
  const handleDeleteImage = async () => {
    if (!formData.logo) return;

    try {
      const publicId = await getPublicIdFromUrl(formData.logo);
      if (!publicId) {
        throw new Error("Invalid image URL");
      }

      const response = await deleteCompanyLogo(publicId);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete image");
      }

      setFormData(prev => ({ ...prev, logo: "" }));
      setPreviewUrl(null);
      addToast({
        title: "Image deleted successfully",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: error.message || "Failed to delete image",
        color: "danger",
      });
    }
  };

  // Update preview URL when form data changes
  useEffect(() => {
    if (formData.logo) {
      setPreviewUrl(formData.logo);
    } else {
      setPreviewUrl(null);
    }
  }, [formData.logo]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-default-500">Loading company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          isIconOnly
          variant="light"
          onPress={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            {mode === "create" ? "Add New Company" : "Edit Company"}
          </h1>
          <p className="text-default-500">
            {mode === "create"
              ? "Create a new company profile"
              : "Update company information"}
          </p>
        </div>
      </motion.div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/10 hover:border-blue-500/50 hover:animate-neon-pulse dark:hover:border-blue-400/50">
          <CardBody className="gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information Section */}
              <LabelInputContainer className="col-span-2">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Basic Information
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                  Fill in the basic details of the company
                </p>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("name") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {getFieldError("name") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("name")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="contactPersonName">Contact Person Name</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("contactPersonName") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPersonName: e.target.value })
                  }
                />
                {getFieldError("contactPersonName") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("contactPersonName")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="contactPersonEmail">Contact Person Email</Label>
                <Input
                  required
                  type="email"
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("contactPersonEmail") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="contactPersonEmail"
                  value={formData.contactPersonEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPersonEmail: e.target.value })
                  }
                />
                {getFieldError("contactPersonEmail") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("contactPersonEmail")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  type="url"
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("website") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="website"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
                {getFieldError("website") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("website")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="logo">Company Logo</Label>
                <div className="space-y-4">
                  {/* Preview */}
                  {previewUrl && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={previewUrl}
                        alt="Company logo preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        className="absolute top-2 right-2"
                        onPress={handleDeleteImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<Upload className="w-4 h-4" />}
                      onPress={() => fileInputRef.current?.click()}
                      isLoading={uploading}
                    >
                      {previewUrl ? "Change Logo" : "Upload Logo"}
                    </Button>
                    {!previewUrl && (
                      <p className="text-sm text-default-500">
                        Upload a company logo (max 5MB)
                      </p>
                    )}
                  </div>

                  {/* URL Input (hidden but kept for form data) */}
                  <input
                    type="hidden"
                    name="logo"
                    value={formData.logo}
                  />
                </div>
                {getFieldError("logo") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("logo")}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  required
                  className={cn(
                    "w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:bg-black/10",
                    getFieldError("description") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                  )}
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                {getFieldError("description") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getFieldError("description")}
                  </p>
                )}
              </LabelInputContainer>
            </div>
          </CardBody>
        </Card>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end gap-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            isDisabled={loading || isPending}
            variant="flat"
            onPress={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={loading || isPending}
            startContent={
              !loading && !isPending && <Plus className="w-4 h-4" />
            }
            type="submit"
          >
            {mode === "create" ? "Create Company" : "Update Company"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

// Label and Input container component
function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {children}
    </div>
  );
} 