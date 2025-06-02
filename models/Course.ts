import mongoose, { Document, Model } from "mongoose";

import { CourseStatus, CourseLevel, BatchType } from "@/lib/types";

export { CourseStatus, CourseLevel, BatchType };

export interface ICourse extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: number; // in hours
  level: CourseLevel;
  status: CourseStatus;
  thumbnail: string;
  category: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  curriculum: {
    title: string;
    description: string;
    duration: number; // in minutes
    order: number;
  }[];
  // Offline course specific fields
  batchSize: number;
  batchType: BatchType;
  schedule: {
    startDate: Date;
    endDate: Date;
    days: string[]; // ["MONDAY", "WEDNESDAY", "FRIDAY"]
    startTime: string; // "10:00"
    endTime: string; // "13:00"
  };
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  currentBatch: {
    batchNumber: number;
    startDate: Date;
    endDate: Date;
    enrolledStudents: number;
    maxStudents: number;
    isActive: boolean;
  };
  enrolledStudents: number;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
  updatedBy: mongoose.Schema.Types.ObjectId;
}

interface ICourseModel extends Model<ICourse> {
  findBySlug(slug: string): Promise<ICourse | null>;
  findPublished(): Promise<ICourse[]>;
  findActiveBatches(): Promise<ICourse[]>;
}

const courseSchema = new mongoose.Schema<ICourse, ICourseModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    level: {
      type: String,
      enum: Object.values(CourseLevel),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.DRAFT,
      index: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],
    learningObjectives: [
      {
        type: String,
        trim: true,
      },
    ],
    curriculum: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
          min: 0,
        },
        order: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    // Offline course specific fields
    batchSize: {
      type: Number,
      required: true,
      min: 1,
      max: 30, // Maximum batch size
    },
    batchType: {
      type: String,
      enum: Object.values(BatchType),
      required: true,
      index: true,
    },
    schedule: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      days: [
        {
          type: String,
          enum: [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY",
          ],
          required: true,
        },
      ],
      startTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:mm format
      },
      endTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:mm format
      },
    },
    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      pincode: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{6}$/, // 6 digit pincode
      },
      landmark: {
        type: String,
        trim: true,
      },
    },
    currentBatch: {
      batchNumber: {
        type: Number,
        required: true,
        min: 1,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      enrolledStudents: {
        type: Number,
        default: 0,
        min: 0,
      },
      maxStudents: {
        type: Number,
        required: true,
        min: 1,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    enrolledStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes for better query performance
courseSchema.index({
  title: "text",
  description: "text",
  shortDescription: "text",
});
courseSchema.index({ status: 1, level: 1 });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ "currentBatch.isActive": 1, "currentBatch.startDate": 1 });
courseSchema.index({ "location.city": 1, status: 1 });
courseSchema.index({ batchType: 1, status: 1 });

// Generate slug before saving
courseSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  try {
    const slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Only update slug if it's different
    if (this.slug !== slug) {
      const CourseModel = this.constructor as Model<ICourse>;
      const existingCourse = await CourseModel.findOne({ slug });

      if (
        existingCourse &&
        existingCourse._id.toString() !== this._id.toString()
      ) {
        this.slug = `${slug}-${Date.now()}`;
      } else {
        this.slug = slug;
      }
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// Static method to find course by slug
courseSchema.statics.findBySlug = async function (
  slug: string,
): Promise<ICourse | null> {
  return this.findOne({ slug });
};

// Static method to find published courses
courseSchema.statics.findPublished = async function (): Promise<ICourse[]> {
  return this.find({ status: CourseStatus.PUBLISHED });
};

// Static method to find courses with active batches
courseSchema.statics.findActiveBatches = async function (): Promise<ICourse[]> {
  return this.find({
    status: CourseStatus.PUBLISHED,
    "currentBatch.isActive": true,
    "currentBatch.startDate": { $gte: new Date() },
  });
};

// Create the model with proper typing
const Course: ICourseModel =
  (mongoose.models?.Course as unknown as ICourseModel) ||
  mongoose.model<ICourse, ICourseModel>("Course", courseSchema);

export { Course };
