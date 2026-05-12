import mongoose from "mongoose";
import User, { IUser } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { buildPaginationMeta } from "../utils/ApiResponse";

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

export class UserService {
  async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    return user.toPublicJSON();
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<Partial<IUser>> {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");

    Object.assign(user, data);
    await user.save();
    return user.toPublicJSON();
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<Partial<IUser>> {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );
    if (!user) throw ApiError.notFound("User not found");
    return user.toPublicJSON();
  }

  async getPublicProfile(userId: string): Promise<Partial<IUser>> {
    const user = await User.findById(userId).select(
      "name avatar headline bio location skills hourlyRate availability portfolioUrl linkedinUrl githubUrl createdAt"
    );
    if (!user) throw ApiError.notFound("User not found");
    return user.toObject();
  }

  async getTalentList(query: TalentQueryInput) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter: mongoose.FilterQuery<IUser> = {
      role: "freelancer",
      isActive: true,
    };

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { headline: { $regex: query.search, $options: "i" } },
        { skills: { $in: [new RegExp(query.search, "i")] } },
      ];
    }

    if (query.skills) {
      const skillList = query.skills.split(",").map((s) => s.trim());
      filter.skills = { $in: skillList };
    }

    if (query.availability) {
      filter.availability = query.availability;
    }

    if (query.minRate !== undefined || query.maxRate !== undefined) {
      filter.hourlyRate = {};
      if (query.minRate !== undefined) filter.hourlyRate.$gte = query.minRate;
      if (query.maxRate !== undefined) filter.hourlyRate.$lte = query.maxRate;
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      rate_asc: { hourlyRate: 1 },
      rate_desc: { hourlyRate: -1 },
    };

    const sort = sortMap[query.sortBy ?? "newest"] ?? sortMap.newest;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("name avatar headline bio skills hourlyRate availability location createdAt")
        .lean(),
      User.countDocuments(filter),
    ]);

    return { users, meta: buildPaginationMeta(page, limit, total) };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId).select("+password");
    if (!user) throw ApiError.notFound("User not found");
    if (!user.password) throw ApiError.badRequest("Cannot change password for OAuth accounts");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw ApiError.unauthorized("Current password is incorrect");

    user.password = newPassword;
    await user.save();
  }

  async deactivateAccount(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { isActive: false });
  }
}

export const userService = new UserService();