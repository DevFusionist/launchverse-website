import mongoose from "mongoose";

export interface ICourse extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  priceRange: {
    min: number;
    max: number;
  };
  duration: {
    min: number;
    max: number;
  };
  durationUnit: "months" | "weeks";
  isActive: boolean;
  isComingSoon: boolean;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    students: number;
    certificates: number;
  };
}

const courseSchema = new mongoose.Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Course slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    priceRange: {
      min: {
        type: Number,
        required: [true, "Minimum price is required"],
      },
      max: {
        type: Number,
        required: [true, "Maximum price is required"],
      },
    },
    duration: {
      min: {
        type: Number,
        required: [true, "Minimum duration is required"],
      },
      max: {
        type: Number,
        required: [true, "Maximum duration is required"],
      },
    },
    durationUnit: {
      type: String,
      enum: ["months", "weeks"],
      default: "months",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isComingSoon: {
      type: Boolean,
      default: false,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug from title before saving
courseSchema.pre("save", function (this: ICourse, next: () => void) {
  if (!this.isModified("title")) return next();

  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  next();
});

// Virtual for students count
courseSchema.virtual("_count.students", {
  ref: "Student",
  localField: "_id",
  foreignField: "course",
  count: true,
});

// Virtual for certificates count
courseSchema.virtual("_count.certificates", {
  ref: "Certificate",
  localField: "_id",
  foreignField: "course",
  count: true,
});

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", courseSchema);
