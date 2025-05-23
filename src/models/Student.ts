import mongoose from "mongoose";

export interface IStudent extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  course: mongoose.Types.ObjectId;
  enrollmentDate: Date;
  completionDate?: Date;
  status: "enrolled" | "completed" | "dropped";
  certificates: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new mongoose.Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    enrollmentDate: {
      type: Date,
      required: [true, "Enrollment date is required"],
      default: Date.now,
    },
    completionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["enrolled", "completed", "dropped"],
      default: "enrolled",
    },
    certificates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certificate",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
studentSchema.index({ email: 1 });
studentSchema.index({ course: 1 });
studentSchema.index({ status: 1 });

export default mongoose.models.Student ||
  mongoose.model<IStudent>("Student", studentSchema);
