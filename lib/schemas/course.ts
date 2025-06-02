import { z } from "zod";

import { CourseLevel, CourseStatus } from "@/models/Course";

const scheduleSchema = z.object({
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
});

const locationSchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^[0-9]{6}$/),
  landmark: z.string().optional(),
});

const curriculumSchema = z.array(
  z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    duration: z.number().min(0),
    order: z.number().min(0),
  }),
);

export const courseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().min(1),
  shortDescription: z.string().min(1).max(200),
  price: z.number().min(0),
  duration: z.number().min(0),
  level: z.nativeEnum(CourseLevel),
  category: z.string().min(1),
  tags: z.array(z.string()),
  prerequisites: z.array(z.string()),
  learningObjectives: z.array(z.string()),
  curriculum: curriculumSchema,
  batchSize: z.number().min(1).max(30),
  batchType: z.enum(["WEEKDAY", "WEEKEND", "CUSTOM"]),
  schedule: scheduleSchema,
  location: locationSchema,
  thumbnail: z.string().url(),
});

export const updateCourseSchema = courseSchema.partial().extend({
  status: z.nativeEnum(CourseStatus).optional(),
});
