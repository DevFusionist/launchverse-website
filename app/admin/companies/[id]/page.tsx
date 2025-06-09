"use client";


import CompanyForm from "@/components/CompanyForm";

export default async function EditCompany({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CompanyForm mode="edit" companyId={id} />;
} 