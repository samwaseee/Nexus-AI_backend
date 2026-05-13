import mongoose, { Document, Model } from "mongoose";
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
declare const User: IUserModel;
export default User;
//# sourceMappingURL=User.model.d.ts.map