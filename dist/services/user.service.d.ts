import mongoose from "mongoose";
import { IUser } from "../models/User.model";
export interface UpdateProfileInput {
    name?: string;
    bio?: string;
    headline?: string;
    location?: string;
    skills?: string[];
    hourlyRate?: number;
    availability?: "available" | "busy" | "unavailable";
    portfolioUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    avatar?: string;
}
export interface TalentQueryInput {
    page?: number;
    limit?: number;
    search?: string;
    skills?: string;
    availability?: string;
    minRate?: number;
    maxRate?: number;
    sortBy?: string;
}
export declare class UserService {
    getProfile(userId: string): Promise<Partial<IUser>>;
    updateProfile(userId: string, data: UpdateProfileInput): Promise<Partial<IUser>>;
    updateAvatar(userId: string, avatarUrl: string): Promise<Partial<IUser>>;
    getPublicProfile(userId: string): Promise<Partial<IUser>>;
    getTalentList(query: TalentQueryInput): Promise<{
        users: (mongoose.FlattenMaps<IUser> & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: import("../utils/ApiResponse").PaginationMeta;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    deactivateAccount(userId: string): Promise<void>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map