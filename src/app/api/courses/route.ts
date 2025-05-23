import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();

    const courses = await Course.find({ isActive: true })
      .select(
        "title slug description priceRange duration durationUnit isComingSoon"
      )
      .sort({ createdAt: -1 });

    if (!courses || courses.length === 0) {
      // Return empty array instead of error if no courses found
      return NextResponse.json([]);
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error in /api/courses:", error);

    // Return more detailed error information
    return NextResponse.json(
      {
        error: "Failed to fetch courses",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
