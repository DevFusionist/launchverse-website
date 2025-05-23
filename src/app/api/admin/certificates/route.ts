import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongodb";
import Certificate from "@/models/Certificate";
import { rateLimit } from "@/lib/rate-limit";
import { getAdminSession, requireAdmin } from "@/lib/admin-session";

// Mark route as dynamic
export const dynamic = "force-dynamic";

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  status: z.enum(["active", "revoked"]).optional(),
});

interface QueryFilter {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  status?: string;
}

interface SortConfig {
  [key: string]: 1 | -1;
}

export async function GET(request: Request) {
  try {
    // Rate limiting
    const limiter = rateLimit({
      interval: 60 * 1000,
      uniqueTokenPerInterval: 500,
    });
    await limiter.check(10, "CERTIFICATES_FETCH");

    // Get and validate session
    const { session, error } = await getAdminSession(request);
    if (error) return error;

    // Check for admin role
    const adminError = requireAdmin(session);
    if (adminError) return adminError;

    // Parse and validate query params
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const validatedQuery = querySchema.parse(query);

    // Connect to DB
    await connectDB();

    // Build query
    const filter: QueryFilter = {};
    if (validatedQuery.search) {
      filter.$or = [
        { certificateId: { $regex: validatedQuery.search, $options: "i" } },
        { "student.name": { $regex: validatedQuery.search, $options: "i" } },
        { "student.email": { $regex: validatedQuery.search, $options: "i" } },
      ];
    }
    if (validatedQuery.status) {
      filter.status = validatedQuery.status;
    }

    // Build sort
    const sort: SortConfig = {};
    if (validatedQuery.sort) {
      const [field, order] = validatedQuery.sort.split(":");
      sort[field] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Pagination
    const page = parseInt(validatedQuery.page || "1");
    const limit = parseInt(validatedQuery.limit || "10");
    const skip = (page - 1) * limit;

    // Fetch data
    const [certificates, total] = await Promise.all([
      Certificate.find(filter)
        .populate("student", "name email")
        .populate("course", "title")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Certificate.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: certificates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
