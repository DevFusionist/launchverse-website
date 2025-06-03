import StudentForm from "@/components/StudentForm";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentForm mode="edit" studentId={id} />;
}
