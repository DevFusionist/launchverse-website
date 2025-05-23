import { Suspense } from "react";
import connectDB from "@/lib/db/mongodb";
import Course from "@/models/Course";
import CoursesPage from "./CoursesPage";

async function getCourses() {
  try {
    await connectDB();
    const courses = await Course.find({ isActive: true })
      .select(
        "title slug description priceRange duration durationUnit isComingSoon"
      )
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain objects

    // Serialize the data
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export default async function CoursesPageServer() {
  return (
    <Suspense fallback={<CoursesPage courses={[]} isLoading={true} />}>
      <CoursesPageContent />
    </Suspense>
  );
}

async function CoursesPageContent() {
  const courses = await getCourses();
  return <CoursesPage courses={courses} isLoading={false} />;
}
