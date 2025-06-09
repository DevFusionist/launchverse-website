import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  certificateCode: string;
  qrCode: string;
  issueDate: Date;
  expiryDate?: Date;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  issuedBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt?: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    certificateCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED", "EXPIRED"],
      default: "ACTIVE",
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
certificateSchema.index({ certificateCode: 1 }, { unique: true });
certificateSchema.index({ studentId: 1, courseId: 1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ createdAt: -1 });

// Virtual for certificate URL
certificateSchema.virtual("verificationUrl").get(function () {
  const verifyUrl =
    process.env.NEXT_PUBLIC_VERIFY_URL || "https://launchverse.academy";
  return `${verifyUrl}/verify/${this.certificateCode}`;
});

// Ensure virtuals are included in JSON output
certificateSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Ensure virtuals are included in Object output
certificateSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Certificate =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", certificateSchema);
