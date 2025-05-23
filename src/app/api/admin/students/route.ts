import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongodb";
import Student from "@/models/Student";
import { rateLimit } from "@/lib/rate-limit";
import { getAdminSession, requireAdmin } from "@/lib/admin-session";

// Mark route as dynamic
export const dynamic = "force-dynamic";

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  status: z.enum(["enrolled", "completed", "dropped"]).optional(),
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
    await limiter.check(10, "STUDENTS_FETCH");

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
        { name: { $regex: validatedQuery.search, $options: "i" } },
        { email: { $regex: validatedQuery.search, $options: "i" } },
        { phone: { $regex: validatedQuery.search, $options: "i" } },
      ];
    }
    if (validatedQuery.status) {
      filter.status = validatedQuery.status;
    }

    // Build sort
    const sort: SortConfig = {};
    if (validatedQuery.sortBy) {
      sort[validatedQuery.sortBy] =
        validatedQuery.sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Pagination
    const page = parseInt(validatedQuery.page || "1");
    const limit = parseInt(validatedQuery.limit || "10");
    const skip = (page - 1) * limit;

    // Fetch data
    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate("course", "title")
        .populate({
          path: "_count",
          select: "certificates",
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: students,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in students API:", error);
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
