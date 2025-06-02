import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

import { withRateLimitAndAuth, AuthenticatedRequest } from "@/lib/auth";
import { Course, CourseStatus, CourseLevel } from "@/models/Course";
import { UserRole } from "@/lib/types";
import connectDB from "@/lib/db";

// Validation schema for course updates
const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().min(1).max(200).optional(),
  price: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  level: z.nativeEnum(CourseLevel).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
  curriculum: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        duration: z.number().min(0),
        order: z.number().min(0),
      }),
    )
    .optional(),
  batchSize: z.number().min(1).max(30).optional(),
  batchType: z.enum(["WEEKDAY", "WEEKEND", "CUSTOM"]).optional(),
  schedule: z
    .object({
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
    })
    .optional(),
  location: z
    .object({
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      pincode: z.string().regex(/^[0-9]{6}$/),
      landmark: z.string().optional(),
    })
    .optional(),
  thumbnail: z.string().url().optional(),
  status: z.nativeEnum(CourseStatus).optional(),
});

// GET /api/courses/[id] - Get a single course
async function getCourseHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    await connectDB();

    const course = await Course.findById(id).lean();

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    console.error("Error fetching course:", error);

    return NextResponse.json(
      { error: error.message || "Failed to fetch course" },
      { status: 500 },
    );
  }
}

// PUT /api/courses/[id] - Update a course
async function updateCourseHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const data = await req.json();
    const validatedData = updateCourseSchema.parse(data);

    await connectDB();

    // Get current course
    const currentCourse = await Course.findById(id);

    if (!currentCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Validate status transition
    if (
      validatedData.status &&
      currentCourse.status === CourseStatus.PUBLISHED &&
      validatedData.status === CourseStatus.DRAFT
    ) {
      return NextResponse.json(
        { error: "Cannot change published course back to draft" },
        { status: 400 },
      );
    }

    // Update course
    const course = await Course.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        updatedBy: req.user!.id,
      },
      { new: true },
    );

    return NextResponse.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error: any) {
    console.error("Error updating course:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update course" },
      { status: 500 },
    );
  }
}

// DELETE /api/courses/[id] - Delete a course
async function deleteCourseHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    await connectDB();

    // Get course before deletion
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if course has enrolled students
    if (course.enrolledStudents > 0) {
      return NextResponse.json(
        { error: "Cannot delete course with enrolled students" },
        { status: 400 },
      );
    }

    // Delete course
    await Course.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting course:", error);

    return NextResponse.json(
      { error: error.message || "Failed to delete course" },
      { status: 500 },
    );
  }
}

// Export the protected route handlers
export const GET = withRateLimitAndAuth(
  getCourseHandler,
  [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  { limit: 30, windowMs: 60000 }, // 30 requests per minute
);

export const PUT = withRateLimitAndAuth(
  updateCourseHandler,
  [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  { limit: 10, windowMs: 60000 }, // 10 requests per minute
);

export const DELETE = withRateLimitAndAuth(
  deleteCourseHandler,
  [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  { limit: 5, windowMs: 60000 }, // 5 requests per minute
);
