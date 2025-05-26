import { notFound } from 'next/navigation';

interface CoursePageProps {
  params: {
    id: string;
  };
}

async function getCourse(id: string) {
  // TODO: Replace with actual data fetching logic
  // This is a placeholder that you can replace with your actual data source
  const course = {
    id,
    title: 'Sample Course',
    description: 'This is a sample course description',
    instructor: 'John Doe',
    duration: '8 weeks',
  };

  if (!course) {
    return null;
  }

  return course;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-bold">{course.title}</h1>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4">
            <h2 className="mb-2 text-xl font-semibold">Course Details</h2>
            <p className="text-gray-600">{course.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Instructor</h3>
              <p className="text-gray-600">{course.instructor}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Duration</h3>
              <p className="text-gray-600">{course.duration}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
