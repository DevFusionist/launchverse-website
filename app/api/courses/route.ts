import { NextResponse } from "next/server";
import { z } from "zod";

import { withRateLimitAndAuth, AuthenticatedRequest } from "@/lib/auth";
import { Course, CourseStatus, CourseLevel } from "@/models/Course";
import { UserRole } from "@/lib/types";
import connectDB from "@/lib/db";

// Validation schema for course creation
const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().min(1).max(200),
  price: z.number().min(0),
  duration: z.number().min(0),
  level: z.nativeEnum(CourseLevel),
  category: z.string().min(1),
  tags: z.array(z.string()),
  prerequisites: z.array(z.string()),
  learningObjectives: z.array(z.string()),
  curriculum: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      duration: z.number().min(0),
      order: z.number().min(0),
    }),
  ),
  batchSize: z.number().min(1).max(30),
  batchType: z.enum(["WEEKDAY", "WEEKEND", "CUSTOM"]),
  schedule: z.object({
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    days: z.array(
      z.enum([
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]),
    ),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }),
  location: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().regex(/^[0-9]{6}$/),
    landmark: z.string().optional(),
  }),
  thumbnail: z.string().url(),
});

// GET /api/courses - List courses with filters and pagination
async function getCoursesHandler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as CourseStatus | null;
    const level = searchParams.get("level") as CourseLevel | null;
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    await connectDB();

    const query: any = {};

    if (status) query.status = status;
    if (level) query.level = level;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      Course.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Course.countDocuments(query),
    ]);

    return NextResponse.json({
      courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching courses:", error);

    return NextResponse.json(
      { error: error.message || "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

// POST /api/courses - Create a new course
async function createCourseHandler(req: AuthenticatedRequest) {
  try {
    const data = await req.json();

    // Validate input data
    const validatedData = createCourseSchema.parse(data);

    await connectDB();

    // Create course
    const course = await Course.create({
      ...validatedData,
      status: CourseStatus.DRAFT,
      currentBatch: {
        batchNumber: 1,
        startDate: validatedData.schedule.startDate,
        endDate: validatedData.schedule.endDate,
        enrolledStudents: 0,
        maxStudents: validatedData.batchSize,
        isActive: true,
      },
      createdBy: req.user!.id,
      updatedBy: req.user!.id,
    });

    return NextResponse.json({
      message: "Course created successfully",
      course,
    });
  } catch (error: any) {
    console.error("Error creating course:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create course" },
      { status: 500 },
    );
  }
}

// Export the protected route handlers
export const GET = withRateLimitAndAuth(
  getCoursesHandler,
  [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  { limit: 30, windowMs: 60000 }, // 30 requests per minute
);

export const POST = withRateLimitAndAuth(
  createCourseHandler,
  [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  { limit: 10, windowMs: 60000 }, // 10 requests per minute
);
