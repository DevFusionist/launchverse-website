import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000),
  logo: z.string().url("Invalid logo URL").optional(),
  website: z.string().url("Invalid website URL").optional(),
  contactPersonName: z
    .string()
    .min(2, "Contact person name must be at least 2 characters")
    .max(100),
  contactPersonEmail: z.string().email("Invalid email address"),
});

export const updateCompanySchema = companySchema.partial();
