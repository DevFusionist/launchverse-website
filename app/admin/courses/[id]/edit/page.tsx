"use client";

import { use } from "react";

import CourseForm from "@/components/CourseForm";

// Create a wrapper component to handle the Promise
function CourseFormWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <CourseForm courseId={id} mode="edit" />;
}

// Main component that receives the Promise
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CourseFormWrapper params={params} />;
}
