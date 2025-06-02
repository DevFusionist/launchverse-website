"use client";

import type { Student } from "./StudentsData";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Chip,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

import {
  createStudent,
  getStudent,
  updateStudent,
  enrollStudentInCourse,
  getAvailableCourses,
  updateEnrollmentStatus,
} from "@/app/actions/student";
import { UserStatus } from "@/lib/types";

interface StudentFormProps {
  studentId?: string;
  mode: "create" | "edit";
}

interface Course {
  _id: string;
  title: string;
  currentBatch: {
    batchNumber: number;
    maxStudents: number;
    enrolledStudents: number;
  };
}

export default function StudentForm({ studentId, mode }: StudentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    // User fields
    name: string;
    email: string;
    password?: string;
    status: UserStatus;
    // Student fields
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      graduationYear?: number;
    }>;
    skills: string[];
    githubProfile?: string;
    linkedinProfile?: string;
    portfolio?: string;
    enrolledCourses?: Array<{
      course: {
        _id: string;
        title: string;
      };
      batchNumber: number;
      enrollmentDate: string;
      status: "ACTIVE" | "COMPLETED" | "DROPPED";
      progress: number;
    }>;
  }>({
    name: "",
    email: "",
    password: mode === "create" ? "" : undefined,
    status: UserStatus.PENDING,
    education: [{ institution: "", degree: "", field: "" }],
    skills: [],
    githubProfile: "",
    linkedinProfile: "",
    portfolio: "",
    enrolledCourses: [],
  });

  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<number | "">("");
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (mode === "edit" && studentId) {
      const fetchStudent = async () => {
        try {
          const response = await getStudent(studentId);

          if (response.success && response.student) {
            const student = response.student as Student;

            setFormData({
              name: student.user.name,
              email: student.user.email,
              status: student.user.status,
              education: student.education,
              skills: student.skills,
              githubProfile: student.githubProfile || "",
              linkedinProfile: student.linkedinProfile || "",
              portfolio: student.portfolio || "",
              enrolledCourses:
                student.enrolledCourses?.map((enrollment) => ({
                  course: {
                    _id: enrollment.course._id.toString(),
                    title: (enrollment.course as any).title || "Unknown Course",
                  },
                  batchNumber: enrollment.batchNumber,
                  enrollmentDate: enrollment.enrollmentDate.toISOString(),
                  status: enrollment.status,
                  progress: enrollment.progress,
                })) || [],
            });
          }
        } catch (error) {
          addToast({
            title: "Failed to fetch student details",
            color: "danger",
          });
        }
      };

      fetchStudent();
    }
  }, [mode, studentId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAvailableCourses();

        if (response.success) {
          setAvailableCourses(response.courses);
        }
      } catch (error) {
        addToast({
          title: "Failed to fetch available courses",
          color: "danger",
        });
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "create") {
        if (!formData.password) {
          addToast({ title: "Password is required", color: "danger" });

          return;
        }
        if (formData.education.length === 0) {
          addToast({
            title: "At least one education entry is required",
            color: "danger",
          });

          return;
        }
        if (
          formData.education.some(
            (edu) => !edu.institution || !edu.degree || !edu.field,
          )
        ) {
          addToast({
            title: "All education fields are required",
            color: "danger",
          });

          return;
        }
      }

      if (mode === "create") {
        const response = await createStudent({
          ...formData,
          password: formData.password!,
          education: formData.education.filter(
            (edu) => edu.institution && edu.degree && edu.field,
          ),
          skills: formData.skills.filter(Boolean),
          githubProfile: formData.githubProfile || undefined,
          linkedinProfile: formData.linkedinProfile || undefined,
          portfolio: formData.portfolio || undefined,
          enrolledCourses: formData.enrolledCourses?.map((ec) => ({
            course: ec.course._id,
            batchNumber: ec.batchNumber,
          })),
        });

        if (response.success) {
          addToast({ title: "Student created successfully", color: "success" });
          router.push("/admin/students");
        } else {
          addToast({
            title: response.error || "Failed to create student",
            color: "danger",
          });
        }
      } else {
        const { password, ...updateData } = formData;
        const response = await updateStudent(studentId!, {
          ...updateData,
          education: updateData.education.filter(
            (edu) => edu.institution && edu.degree && edu.field,
          ),
          skills: updateData.skills.filter(Boolean),
          githubProfile: updateData.githubProfile || undefined,
          linkedinProfile: updateData.linkedinProfile || undefined,
          portfolio: updateData.portfolio || undefined,
          enrolledCourses: updateData.enrolledCourses?.map((ec) => ({
            course: ec.course._id,
            batchNumber: ec.batchNumber,
          })),
        });

        if (response.success) {
          addToast({ title: "Student updated successfully", color: "success" });
          router.push("/admin/students");
        } else {
          addToast({
            title: response.error || "Failed to update student",
            color: "danger",
          });
        }
      }
    } catch (error) {
      addToast({
        title: `An error occurred while ${mode}ing student`,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const education = [...prev.education];

      education[index] = { ...education[index], [field]: value };

      return { ...prev, education };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", field: "" },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length === 1) {
      addToast({
        title: "At least one education entry is required",
        color: "danger",
      });

      return;
    }
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleSkillsChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: value.split(",").map((skill) => skill.trim()),
    }));
  };

  const handleEnroll = async () => {
    if (!selectedCourse || !selectedBatch) {
      addToast({
        title: "Please select both course and batch",
        color: "danger",
      });

      return;
    }

    setEnrolling(true);
    try {
      const response = await enrollStudentInCourse(studentId!, {
        course: selectedCourse,
        batchNumber: selectedBatch as number,
      });

      if (response.success) {
        addToast({ title: "Student enrolled successfully", color: "success" });
        setSelectedCourse("");
        setSelectedBatch("");
        // Refresh student data
        if (mode === "edit" && studentId) {
          const studentResponse = await getStudent(studentId);

          if (studentResponse.success && studentResponse.student) {
            const student = studentResponse.student as Student;

            setFormData((prev) => ({
              ...prev,
              enrolledCourses: student.enrolledCourses?.map((enrollment) => ({
                course: {
                  _id: enrollment.course._id.toString(),
                  title: (enrollment.course as any).title || "Unknown Course",
                },
                batchNumber: enrollment.batchNumber,
                enrollmentDate: enrollment.enrollmentDate.toISOString(),
                status: enrollment.status,
                progress: enrollment.progress,
              })),
            }));
          }
        }
      } else {
        addToast({
          title: response.error || "Failed to enroll student",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "An error occurred while enrolling student",
        color: "danger",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleUpdateEnrollmentStatus = async (
    courseId: string,
    status: "ACTIVE" | "COMPLETED" | "DROPPED",
  ) => {
    try {
      const response = await updateEnrollmentStatus(
        studentId!,
        courseId,
        status,
      );

      if (response.success) {
        addToast({
          title: "Enrollment status updated successfully",
          color: "success",
        });
        // Refresh student data
        if (mode === "edit" && studentId) {
          const studentResponse = await getStudent(studentId);

          if (studentResponse.success && studentResponse.student) {
            const student = studentResponse.student as Student;

            setFormData((prev) => ({
              ...prev,
              enrolledCourses: student.enrolledCourses?.map((enrollment) => ({
                course: {
                  _id: enrollment.course._id.toString(),
                  title: (enrollment.course as any).title || "Unknown Course",
                },
                batchNumber: enrollment.batchNumber,
                enrollmentDate: enrollment.enrollmentDate.toISOString(),
                status: enrollment.status,
                progress: enrollment.progress,
              })),
            }));
          }
        }
      } else {
        addToast({
          title: response.error || "Failed to update enrollment status",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "An error occurred while updating enrollment status",
        color: "danger",
      });
    }
  };

  return (
    <motion.form
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 20 }}
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6">
        {mode === "create" ? "Create New Student" : "Edit Student"}
      </h2>

      {/* User Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <Input
          required
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          required
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        {mode === "create" && (
          <Input
            required
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        )}
        <Select
          required
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          {Object.values(UserStatus).map((status) => (
            <SelectItem key={status} textValue={status}>
              {status}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Student Fields */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Education</h3>
          <p className="text-sm text-default-500">
            At least one entry required
          </p>
        </div>
        {formData.education.map((edu, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Education #{index + 1}</h4>
              <Button
                color="danger"
                isDisabled={formData.education.length === 1}
                size="sm"
                variant="light"
                onClick={() => removeEducation(index)}
              >
                Remove
              </Button>
            </div>
            <Input
              required
              label="Institution"
              value={edu.institution}
              onChange={(e) =>
                handleEducationChange(index, "institution", e.target.value)
              }
            />
            <Input
              required
              label="Degree"
              value={edu.degree}
              onChange={(e) =>
                handleEducationChange(index, "degree", e.target.value)
              }
            />
            <Input
              required
              label="Field"
              value={edu.field}
              onChange={(e) =>
                handleEducationChange(index, "field", e.target.value)
              }
            />
            <Input
              label="Graduation Year"
              type="number"
              value={edu.graduationYear?.toString() || ""}
              onChange={(e) =>
                handleEducationChange(
                  index,
                  "graduationYear",
                  parseInt(e.target.value),
                )
              }
            />
          </div>
        ))}
        <Button
          color="primary"
          type="button"
          variant="light"
          onClick={addEducation}
        >
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Skills & Profiles</h3>
        <Textarea
          label="Skills (comma-separated)"
          placeholder="e.g., JavaScript, React, Node.js"
          value={formData.skills.join(", ")}
          onChange={(e) => handleSkillsChange(e.target.value)}
        />
        <Input
          label="GitHub Profile"
          name="githubProfile"
          placeholder="https://github.com/username"
          type="url"
          value={formData.githubProfile}
          onChange={handleChange}
        />
        <Input
          label="LinkedIn Profile"
          name="linkedinProfile"
          placeholder="https://linkedin.com/in/username"
          type="url"
          value={formData.linkedinProfile}
          onChange={handleChange}
        />
        <Input
          label="Portfolio"
          name="portfolio"
          placeholder="https://your-portfolio.com"
          type="url"
          value={formData.portfolio}
          onChange={handleChange}
        />
      </div>

      {/* Course Enrollment Section */}
      {mode === "edit" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Course Enrollment</h3>

          {/* Current Enrollments */}
          {formData.enrolledCourses && formData.enrolledCourses.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Current Enrollments</h4>
              {formData.enrolledCourses.map((enrollment, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{enrollment.course.title}</p>
                      <p className="text-sm text-default-500">
                        Batch #{enrollment.batchNumber} • Enrolled on{" "}
                        {new Date(
                          enrollment.enrollmentDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip
                        color={
                          enrollment.status === "ACTIVE"
                            ? "success"
                            : enrollment.status === "COMPLETED"
                              ? "primary"
                              : "danger"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {enrollment.status}
                      </Chip>
                      <Select
                        size="sm"
                        value={enrollment.status}
                        onChange={(e) =>
                          handleUpdateEnrollmentStatus(
                            enrollment.course._id,
                            e.target.value as
                              | "ACTIVE"
                              | "COMPLETED"
                              | "DROPPED",
                          )
                        }
                      >
                        <SelectItem key="ACTIVE" textValue="ACTIVE">
                          Active
                        </SelectItem>
                        <SelectItem key="COMPLETED" textValue="COMPLETED">
                          Completed
                        </SelectItem>
                        <SelectItem key="DROPPED" textValue="DROPPED">
                          Dropped
                        </SelectItem>
                      </Select>
                    </div>
                  </div>
                  <div className="w-full bg-default-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-default-500">
                    Progress: {enrollment.progress}%
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* New Enrollment */}
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium">Enroll in New Course</h4>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Course"
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedBatch("");
                }}
              >
                {availableCourses.map((course) => (
                  <SelectItem key={course._id} textValue={course._id}>
                    {course.title} (Batch #{course.currentBatch.batchNumber})
                  </SelectItem>
                ))}
              </Select>
              <Select
                isDisabled={!selectedCourse}
                label="Batch"
                value={selectedBatch.toString()}
                onChange={(e) => setSelectedBatch(parseInt(e.target.value))}
              >
                {(() => {
                  const course = availableCourses.find(
                    (c) => c._id === selectedCourse,
                  );

                  return course ? (
                    <SelectItem
                      key={course.currentBatch.batchNumber.toString()}
                      textValue={course.currentBatch.batchNumber.toString()}
                    >
                      Batch #{course.currentBatch.batchNumber}
                    </SelectItem>
                  ) : null;
                })()}
              </Select>
            </div>
            <Button
              color="primary"
              isDisabled={!selectedCourse || !selectedBatch}
              isLoading={enrolling}
              onClick={handleEnroll}
            >
              Enroll Student
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          color="danger"
          variant="light"
          onClick={() => router.push("/admin/students")}
        >
          Cancel
        </Button>
        <Button color="primary" isLoading={isLoading} type="submit">
          {mode === "create" ? "Create Student" : "Update Student"}
        </Button>
      </div>
    </motion.form>
  );
}
