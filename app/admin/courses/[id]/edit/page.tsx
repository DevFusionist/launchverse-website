import CourseForm from "@/components/CourseForm";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CourseForm courseId={id} mode="edit" />;
}
