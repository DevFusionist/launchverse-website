"use client";

import { getCompanies } from "@/app/actions/company";

export async function getCompaniesData(page: number = 1, limit: number = 10) {
  try {
    const response = await getCompanies({ page, limit });
    
    if (!response.success || !response.data) {
      return { 
        companies: [], 
        pagination: { total: 0, page: 1, limit: 10, pages: 1 }, 
        error: response.error 
      };
    }

    return {
      companies: response.data.companies,
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return {
      companies: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 1 },
      error: error.message,
    };
  }
} 