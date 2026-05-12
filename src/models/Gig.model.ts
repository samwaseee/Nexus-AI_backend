import mongoose, { Document, Schema } from "mongoose";

export type GigStatus = "active" | "paused" | "draft" | "archived";
export type ExperienceLevel = "entry" | "intermediate" | "expert";
export type DeliveryTime = "1_day" | "3_days" | "1_week" | "2_weeks" | "1_month";

export interface IGig extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory?: string;
  tags: string[];
  skills: string[];
  freelancer: mongoose.Types.ObjectId;
  images: string[];
  startingPrice: number;
  packages: {
    basic: GigPackage;
    standard?: GigPackage;
    premium?: GigPackage;
  };
  experienceLevel: ExperienceLevel;
  deliveryTime: DeliveryTime;
  revisions: number;
  status: GigStatus;
  isRemote: boolean;
  location?: string;
  views: number;
  averageRating: number;
  totalReviews: number;
  totalOrders: number;
  aiDemandScore?: number;
  trendingScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface GigPackage {
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

const gigPackageSchema = new Schema<GigPackage>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 5 },
  deliveryDays: { type: Number, required: true, min: 1 },
  revisions: { type: Number, default: 1 },
  features: [{ type: String }],
});

const gigSchema = new Schema<IGig>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    slug: { type: String, unique: true, lowercase: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"], // <-- Added string
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [200, "Short description cannot exceed 200 characters"], // <-- Added string
    },
    category: { type: String, required: [true, "Category is required"], index: true },
    subcategory: { type: String },
    tags: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    images: [{ type: String }],
    startingPrice: { type: Number, required: true, min: 5 },
    packages: {
      basic: { type: gigPackageSchema, required: true },
      standard: { type: gigPackageSchema },
      premium: { type: gigPackageSchema },
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      default: "intermediate",
    },
    deliveryTime: {
      type: String,
      enum: ["1_day", "3_days", "1_week", "2_weeks", "1_month"],
      default: "1_week",
    },
    revisions: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["active", "paused", "draft", "archived"],
      default: "active",
      index: true,
    },
    isRemote: { type: Boolean, default: true },
    location: { type: String },
    views: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    aiDemandScore: { type: Number, min: 0, max: 100 },
    trendingScore: { type: Number, min: 0, max: 100 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes for search & filtering ──────────────────────────────────────
gigSchema.index({ title: "text", description: "text", tags: "text" });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ startingPrice: 1 });
gigSchema.index({ averageRating: -1 });
gigSchema.index({ createdAt: -1 });
gigSchema.index({ trendingScore: -1 });

const Gig = mongoose.model<IGig>("Gig", gigSchema);
export default Gig;