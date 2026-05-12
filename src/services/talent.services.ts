import mongoose from "mongoose";
import User, { IUser } from "../models/User.model";
import Gig from "../models/Gig.model";
import { ApiError } from "../utils/ApiError";
import { buildPaginationMeta } from "../utils/ApiResponse";

export interface TalentQueryInput {
  page?: string;
  limit?: string;
  search?: string;
  skills?: string;
  availability?: string;
  minRate?: string;
  maxRate?: string;
  sortBy?: string;
}

export class TalentService {
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
        { bio: { $regex: query.search, $options: "i" } },
      ];
    }

    if (query.skills) {
      const skillList = query.skills.split(",").map((s) => s.trim());
      filter.skills = { $in: skillList };
    }

    if (query.availability) {
      filter.availability = query.availability;
    }

    if (query.minRate || query.maxRate) {
      filter.hourlyRate = {};
      if (query.minRate) filter.hourlyRate.$gte = Number(query.minRate);
      if (query.maxRate) filter.hourlyRate.$lte = Number(query.maxRate);
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
        .select(
          "name avatar headline bio skills hourlyRate availability location createdAt"
        )
        .lean(),
      User.countDocuments(filter),
    ]);

    return { users, meta: buildPaginationMeta(page, limit, total) };
  }

  async getTalentProfile(userId: string) {
    const user = await User.findOne({
      _id: userId,
      role: "freelancer",
      isActive: true,
    }).select(
      "name avatar headline bio skills hourlyRate availability location portfolioUrl linkedinUrl githubUrl createdAt"
    );
    if (!user) throw ApiError.notFound("Freelancer not found");
    return user;
  }

  async getTalentGigs(userId: string) {
    const gigs = await Gig.find({
      freelancer: new mongoose.Types.ObjectId(userId),
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean();
    return gigs;
  }
}

export const talentService = new TalentService();