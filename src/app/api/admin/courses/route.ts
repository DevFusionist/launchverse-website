import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import Course from "@/models/Course";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

// Mark route as dynamic
export const dynamic = "force-dynamic";

const searchParamsSchema = z.object({
  page: z.string().optional().transform(Number).default("1"),
  limit: z.string().optional().transform(Number).default("10"),
  search: z.string().optional().default(""),
  sortBy: z
    .enum([
      "title",
      "priceRange",
      "duration",
      "studentCount",
      "certificateCount",
      "isActive",
      "createdAt",
    ])
    .optional()
    .default("title"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 500,
    });
    await limiter.check(5, "COURSES_FETCH_CACHE");

    // Validate session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate user role
    if (session.user.role !== "admin" && session.user.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const validatedParams = searchParamsSchema.parse(
      Object.fromEntries(searchParams)
    );

    // Connect to database
    await connectDB();

    // Build search query
    const searchQuery = validatedParams.search
      ? {
          $or: [
            { title: { $regex: validatedParams.search, $options: "i" } },
            { description: { $regex: validatedParams.search, $options: "i" } },
          ],
        }
      : {};

    // Calculate pagination
    const skip = (validatedParams.page - 1) * validatedParams.limit;

    // Fetch courses with aggregation pipeline
    const [courses, totalCount] = await Promise.all([
      Course.aggregate([
        { $match: searchQuery },
        {
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "courses",
            as: "students",
          },
        },
        {
          $lookup: {
            from: "certificates",
            localField: "_id",
            foreignField: "course",
            as: "certificates",
          },
        },
        {
          $addFields: {
            _count: {
              students: { $size: "$students" },
              certificates: { $size: "$certificates" },
            },
            studentCount: { $size: "$students" },
            certificateCount: { $size: "$certificates" },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            priceRange: 1,
            duration: 1,
            durationUnit: 1,
            isActive: 1,
            createdAt: 1,
            _count: 1,
            studentCount: 1,
            certificateCount: 1,
          },
        },
        {
          $sort: {
            [validatedParams.sortBy]:
              validatedParams.sortOrder === "asc" ? 1 : -1,
          },
        },
        { $skip: skip },
        { $limit: validatedParams.limit },
      ]),
      Course.countDocuments(searchQuery),
    ]);

    return NextResponse.json({
      courses,
      pagination: {
        total: totalCount,
        page: validatedParams.page,
        limit: validatedParams.limit,
        totalPages: Math.ceil(totalCount / validatedParams.limit),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/courses:", error);
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
