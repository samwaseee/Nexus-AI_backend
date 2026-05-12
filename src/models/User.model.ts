import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "freelancer" | "client" | "admin";
export type AuthProvider = "local" | "google";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  provider: AuthProvider;
  googleId?: string;
  avatar?: string;
  bio?: string;
  headline?: string;
  location?: string;
  skills: string[];
  hourlyRate?: number;
  availability: "available" | "busy" | "unavailable";
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  lastSeen: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toPublicJSON(): Partial<IUser>;
}

interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["freelancer", "client", "admin"],
      default: "freelancer",
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: { type: String, sparse: true },
    avatar: { type: String, default: "" },
    bio: { type: String, maxlength: [500, "Bio cannot exceed 500 characters"] },
    headline: {
      type: String,
      maxlength: [150, "Headline cannot exceed 150 characters"],
    },
    location: { type: String },
    skills: [{ type: String, trim: true }],
    hourlyRate: { type: Number, min: 0 },
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    portfolioUrl: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastSeen: { type: Date, default: Date.now },
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ availability: 1 });
userSchema.index({ createdAt: -1 });

// ─── Hash password before save ────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Update lastSeen ──────────────────────────────────────────────────────
userSchema.pre("save", function (next) {
  this.lastSeen = new Date();
  next();
});

// ─── Instance methods ─────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function (): Partial<IUser> {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

// ─── Static methods ───────────────────────────────────────────────────────
userSchema.statics.findByEmail = function (
  email: string
): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase() }).select("+password");
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;