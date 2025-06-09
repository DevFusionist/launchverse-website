import mongoose, { Document, Schema } from "mongoose";

export interface ICompany extends Document {
  name: string;
  description: string;
  logo?: string; // optional logo url
  website?: string; // optional website url
  contactPersonName: string; // name of the contact person
  contactPersonEmail: string; // email of the contact person
  createdAt: Date;
}

const CompanySchema: Schema = new Schema<ICompany>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  logo: { type: String, trim: true },
  website: { type: String, trim: true },
  contactPersonName: { type: String, required: true, trim: true },
  contactPersonEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// (Optional) Add an index on the name field if you want to enforce uniqueness or fast queries
// CompanySchema.index({ name: 1 }, { unique: true });

// Export the model with proper typing and prevent recompilation
export const Company =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
