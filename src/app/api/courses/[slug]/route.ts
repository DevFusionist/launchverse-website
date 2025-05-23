import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Course from "@/models/Course";
import { Course as CourseType } from "@/types/course";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const course = await Course.findOne({ slug: params.slug, isActive: true });

    if (!course) {
      return new NextResponse(null, { status: 404 });
    }

    // Serialize the MongoDB document to a plain object
    const serializedCourse = {
      _id: course._id.toString(),
      title: course.title,
      slug: course.slug,
      description: course.description,
      priceRange: {
        min: course.priceRange.min,
        max: course.priceRange.max,
      },
      duration: {
        min: course.duration.min,
        max: course.duration.max,
      },
      durationUnit: course.durationUnit,
      isComingSoon: course.isComingSoon,
      isActive: course.isActive,
      features: course.features,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedCourse as CourseType);
  } catch (error) {
    console.error("Error fetching course:", error);
    return new NextResponse(null, { status: 500 });
  }
}
