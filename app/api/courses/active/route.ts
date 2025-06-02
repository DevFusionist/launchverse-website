import { NextResponse } from "next/server";

import { Course } from "@/models/Course";
import connectDB from "@/lib/db";

// GET /api/courses/active - Get all active course batches
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const city = searchParams.get("city");

    await connectDB();

    const query: any = {
      status: "PUBLISHED",
      "currentBatch.isActive": true,
      "currentBatch.startDate": { $gte: new Date() },
    };

    if (category) query.category = category;
    if (level) query.level = level;
    if (city) query["location.city"] = city;

    const courses = await Course.find(query)
      .select(
        "title slug shortDescription price duration level category thumbnail schedule location currentBatch",
      )
      .sort({ "currentBatch.startDate": 1 })
      .lean();

    return NextResponse.json(courses);
  } catch (error: any) {
    console.error("Error fetching active batches:", error);

    return NextResponse.json(
      { error: error.message || "Failed to fetch active batches" },
      { status: 500 },
    );
  }
}
