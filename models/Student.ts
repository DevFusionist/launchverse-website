import mongoose, { Schema, Document } from "mongoose";

import { User } from "./User";
import { Course } from "./Course";

export interface IStudent extends Document {
  user: mongoose.Types.ObjectId;
  enrollmentNumber: string;
  enrolledCourses: {
    course: mongoose.Types.ObjectId;
    batchNumber: number;
    enrollmentDate: Date;
    status: "ACTIVE" | "COMPLETED" | "DROPPED";
    progress: number;
    certificates?: {
      certificateId: string;
      issuedAt: Date;
      course: mongoose.Types.ObjectId;
      batchNumber: number;
    }[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    graduationYear?: number;
  }[];
  skills: string[];
  githubProfile?: string;
  linkedinProfile?: string;
  portfolio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },
    enrolledCourses: [
      {
        course: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        batchNumber: {
          type: Number,
          required: true,
        },
        enrollmentDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["ACTIVE", "COMPLETED", "DROPPED"],
          default: "ACTIVE",
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        certificates: [
          {
            certificateId: {
              type: String,
              required: true,
            },
            issuedAt: {
              type: Date,
              required: true,
            },
            course: {
              type: Schema.Types.ObjectId,
              ref: "Course",
              required: true,
            },
            batchNumber: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
    education: [
      {
        institution: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        field: {
          type: String,
          required: true,
        },
        graduationYear: {
          type: Number,
        },
      },
    ],
    skills: [
      {
        type: String,
      },
    ],
    githubProfile: {
      type: String,
    },
    linkedinProfile: {
      type: String,
    },
    portfolio: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Generate enrollment number before saving
studentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Student").countDocuments();

    this.enrollmentNumber = `STU${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

// Validate that user has STUDENT role
studentSchema.pre("save", async function (next) {
  const user = await User.findById(this.user);

  if (!user || user.role !== "STUDENT") {
    throw new Error("User must have STUDENT role");
  }
  next();
});

// Validate course exists and batch number is valid
studentSchema.pre("save", async function (next) {
  for (const enrollment of this.enrolledCourses) {
    const course = await Course.findById(enrollment.course);

    if (!course) {
      throw new Error(`Course ${enrollment.course} not found`);
    }
    if (enrollment.batchNumber > course.currentBatch.batchNumber) {
      throw new Error(`Invalid batch number for course ${course.title}`);
    }
  }
  next();
});

export const Student =
  mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);
