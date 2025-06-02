"use server";

import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

import { UserRole, UserStatus } from "@/lib/types";

// Web Crypto API utility functions
async function generateRandomBytes(length: number): Promise<string> {
  const array = new Uint8Array(length);

  crypto.getRandomValues(array);

  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  name: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  otp?: string;
  otpExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;
  invitedBy?: mongoose.Types.ObjectId;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationToken(): Promise<string>;
  generateOTP(): Promise<string>;
  generateRefreshToken(): Promise<string>;
  revokeRefreshToken(): Promise<void>;
}

interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    otp: String,
    otpExpires: Date,
    refreshToken: String,
    refreshTokenExpires: Date,
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes for better query performance
userSchema.index({ email: 1, role: 1 });
userSchema.index({ status: 1, role: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Generate verification token
userSchema.methods.generateVerificationToken =
  async function (): Promise<string> {
    const token = await generateRandomBytes(32);

    this.verificationToken = token;
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await this.save();

    return token;
  };

// Generate OTP
userSchema.methods.generateOTP = async function (): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

  this.otp = otp;
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await this.save();

  return otp;
};

// Generate refresh token
userSchema.methods.generateRefreshToken = async function (): Promise<string> {
  const refreshToken = await generateRandomBytes(40);

  this.refreshToken = refreshToken;
  this.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await this.save();

  return refreshToken;
};

// Revoke refresh token
userSchema.methods.revokeRefreshToken = async function (): Promise<void> {
  this.refreshToken = undefined;
  this.refreshTokenExpires = undefined;
  await this.save();
};

// Static method to find user by email
userSchema.statics.findByEmail = async function (
  email: string,
): Promise<IUser | null> {
  return this.findOne({ email }).select("+password");
};

// Create the model with proper typing
const User =
  (mongoose.models.User as unknown as IUserModel) ||
  mongoose.model<IUser, IUserModel>("User", userSchema);

export { User };
