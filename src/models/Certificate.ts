import mongoose from "mongoose";

export interface ICertificate extends mongoose.Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  certificateId: string;
  issueDate: Date;
  validFrom: Date;
  validUntil: Date;
  qrCode: string;
  status: "active" | "revoked";
  revokedAt?: Date;
  revokedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new mongoose.Schema<ICertificate>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
      default: Date.now,
    },
    validFrom: {
      type: Date,
      required: [true, "Valid from date is required"],
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: [true, "Valid until date is required"],
    },
    qrCode: {
      type: String,
      required: [true, "QR code is required"],
    },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
    revokedAt: {
      type: Date,
    },
    revokedReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate certificate ID before saving
certificateSchema.pre("save", function (next) {
  if (!this.isModified("certificateId")) {
    // Generate a unique certificate ID if not provided
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.certificateId = `LV-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Index for faster queries
certificateSchema.index({ student: 1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ status: 1 });

export default mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", certificateSchema);
