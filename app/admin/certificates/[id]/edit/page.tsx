"use client";

import CertificateForm from "../../CertificateForm";

export default async function EditCertificate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CertificateForm certificateId={id} mode="edit" />;
} 