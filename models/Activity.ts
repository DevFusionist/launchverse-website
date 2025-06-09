import mongoose, { Document, Model } from "mongoose";

export enum ActivityType {
  // User activities
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  USER_REGISTER = "USER_REGISTER",
  USER_VERIFY_EMAIL = "USER_VERIFY_EMAIL",
  USER_CHANGE_PASSWORD = "USER_CHANGE_PASSWORD",
  USER_UPDATE_PROFILE = "USER_UPDATE_PROFILE",

  // Course activities
  COURSE_CREATE = "COURSE_CREATE",
  COURSE_UPDATE = "COURSE_UPDATE",
  COURSE_DELETE = "COURSE_DELETE",
  COURSE_PUBLISH = "COURSE_PUBLISH",
  COURSE_ARCHIVE = "COURSE_ARCHIVE",
  COURSE_ENROLL = "COURSE_ENROLL",
  COURSE_UNENROLL = "COURSE_UNENROLL",
  COURSE_RATE = "COURSE_RATE",
  COURSE_REVIEW = "COURSE_REVIEW",

  // Company activities
  COMPANY_CREATE = "COMPANY_CREATE",
  COMPANY_UPDATE = "COMPANY_UPDATE",
  COMPANY_DELETE = "COMPANY_DELETE",

  // Student activities
  STUDENT_ENROLL = "STUDENT_ENROLL",
  STUDENT_ENROLLMENT_UPDATE = "STUDENT_ENROLLMENT_UPDATE",
  STUDENT_DELETE = "STUDENT_DELETE",
  STUDENT_STATUS_UPDATE = "STUDENT_STATUS_UPDATE",

  // Certificate activities
  CERTIFICATE_ISSUE = "CERTIFICATE_ISSUE",
  CERTIFICATE_UPDATE = "CERTIFICATE_UPDATE",
  CERTIFICATE_REVOKE = "CERTIFICATE_REVOKE",

  // File activities
  FILE_UPLOAD = "FILE_UPLOAD",
  FILE_DELETE = "FILE_DELETE",

  // Admin activities
  ADMIN_USER_CREATE = "ADMIN_USER_CREATE",
  ADMIN_USER_UPDATE = "ADMIN_USER_UPDATE",
  ADMIN_USER_DELETE = "ADMIN_USER_DELETE",
  ADMIN_USER_ROLE_UPDATE = "ADMIN_USER_ROLE_UPDATE",
  ADMIN_USER_STATUS_UPDATE = "ADMIN_USER_STATUS_UPDATE",

  // System activities
  SYSTEM_ERROR = "SYSTEM_ERROR",
  SYSTEM_WARNING = "SYSTEM_WARNING",
  SYSTEM_INFO = "SYSTEM_INFO",
}

export enum ActivityStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export enum ActivityTargetType {
  USER = "USER",
  COURSE = "COURSE",
  COMPANY = "COMPANY",
  STUDENT = "STUDENT",
  CERTIFICATE = "CERTIFICATE",
  FILE = "FILE",
}

export interface IActivityMetadata {
  action: string;
  targetType: ActivityTargetType;
  targetId: string;
  details: Record<string, unknown>;
  error?: string;
}

export interface IActivity extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  type: ActivityType;
  status: ActivityStatus;
  user: mongoose.Schema.Types.ObjectId; // User who performed the action
  targetId: mongoose.Schema.Types.ObjectId; // Generic target reference
  metadata: IActivityMetadata;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

interface IActivityModel extends Model<IActivity> {
  findByUser(userId: mongoose.Types.ObjectId): Promise<IActivity[]>;
  findByCourse(courseId: mongoose.Types.ObjectId): Promise<IActivity[]>;
  findByType(type: ActivityType): Promise<IActivity[]>;
  findRecent(limit?: number): Promise<IActivity[]>;
}

const activitySchema = new mongoose.Schema<IActivity, IActivityModel>(
  {
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ActivityStatus),
      default: ActivityStatus.SUCCESS,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    metadata: {
      action: { type: String, required: true },
      targetType: {
        type: String,
        enum: Object.values(ActivityTargetType),
        required: true,
      },
      targetId: { type: String, required: true },
      details: { type: mongoose.Schema.Types.Mixed, default: {} },
      error: { type: String },
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1, status: 1 });
activitySchema.index({ user: 1, type: 1 });
activitySchema.index({ targetId: 1, type: 1 });

// Static method to find activities by user
activitySchema.statics.findByUser = async function (
  userId: mongoose.Types.ObjectId
): Promise<IActivity[]> {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to find activities by course
activitySchema.statics.findByCourse = async function (
  courseId: mongoose.Types.ObjectId
): Promise<IActivity[]> {
  return this.find({ targetId: courseId }).sort({ createdAt: -1 });
};

// Static method to find activities by type
activitySchema.statics.findByType = async function (
  type: ActivityType
): Promise<IActivity[]> {
  return this.find({ type }).sort({ createdAt: -1 });
};

// Static method to find recent activities
activitySchema.statics.findRecent = async function (
  limit: number = 50
): Promise<IActivity[]> {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Create the model with proper typing
const Activity =
  (mongoose.models.Activity as unknown as IActivityModel) ||
  mongoose.model<IActivity, IActivityModel>("Activity", activitySchema);

export { Activity };
