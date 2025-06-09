"use client";

import type { ICertificate } from "@/models/Certificate";
import { getCertificates } from "@/app/actions/certificate";

// Create a type for the transformed certificate data
export type Certificate = Omit<ICertificate, "_id"> & {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  courseId: {
    _id: string;
    title: string;
  };
  issuedBy: {
    _id: string;
    name: string;
  };
  issueDate: string;
  expiryDate?: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  certificateCode: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
};

export async function getCertificatesData(page: number = 1, limit: number = 10) {
  try {
    const response = await getCertificates(page, limit);
    
    if (!response.success || !response.data) {
      return { 
        certificates: [], 
        pagination: { total: 0, page: 1, limit: 10, pages: 1 }, 
        error: response.error 
      };
    }

    const transformedCertificates = response.data.map((certificate: any) => ({
      ...certificate,
      _id: certificate._id.toString(),
      studentId: {
        _id: certificate.studentId._id.toString(),
        name: certificate.studentId.name,
        email: certificate.studentId.email,
      },
      courseId: {
        _id: certificate.courseId._id.toString(),
        title: certificate.courseId.title,
      },
      issuedBy: {
        _id: certificate.issuedBy._id.toString(),
        name: certificate.issuedBy.name,
      },
      issueDate: new Date(certificate.issueDate).toISOString(),
      expiryDate: certificate.expiryDate 
        ? new Date(certificate.expiryDate).toISOString()
        : undefined,
      createdAt: new Date(certificate.createdAt).toISOString(),
      updatedAt: new Date(certificate.updatedAt).toISOString(),
    })) as Certificate[];

    return {
      certificates: transformedCertificates,
      pagination: response.pagination,
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching certificates:", error);
    return {
      certificates: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 1 },
      error: error.message,
    };
  }
} 