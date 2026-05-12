import mongoose from "mongoose";
import Gig, { IGig } from "../models/Gig.model";
import { ApiError } from "../utils/ApiError";
import { buildPaginationMeta, PaginationMeta } from "../utils/ApiResponse";
import { uniqueSlug } from "../utils/slugify";
import { CreateGigInput, GigQueryInput } from "../validations/gig.validation";

export class GigService {
  async createGig(freelancerId: string, data: CreateGigInput): Promise<IGig> {
    const slug = uniqueSlug(data.title);
    const gig = await Gig.create({
      ...data,
      slug,
      freelancer: new mongoose.Types.ObjectId(freelancerId),
    });
    return gig;
  }

  async getGigs(query: GigQueryInput): Promise<{ gigs: IGig[]; meta: PaginationMeta }> {
    const { page, limit, search, category, minPrice, maxPrice, rating,
      experienceLevel, deliveryTime, sortBy, skills } = query;
        
    const filter: mongoose.FilterQuery<IGig> = { status: "active" };

    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.startingPrice = {};
      if (minPrice !== undefined) filter.startingPrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.startingPrice.$lte = maxPrice;
    }
    if (rating !== undefined) filter.averageRating = { $gte: rating };
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (deliveryTime) filter.deliveryTime = deliveryTime;
    if (skills) {
      const skillList = skills.split(",").map((s) => s.trim());
      filter.skills = { $in: skillList };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { startingPrice: 1 },
      price_desc: { startingPrice: -1 },
      rating: { averageRating: -1 },
      trending: { trendingScore: -1 },
    };

    const sort = sortMap[sortBy] ?? sortMap.newest;
    const skip = (page - 1) * limit;

    const [gigs, total] = await Promise.all([
      Gig.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("freelancer", "name avatar headline averageRating")
        .lean(),
      Gig.countDocuments(filter),
    ]);

    return {
      gigs: gigs as unknown as IGig[],
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getGigById(id: string): Promise<IGig> {
    const gig = await Gig.findById(id)
      .populate("freelancer", "name avatar headline bio skills averageRating totalReviews")
      .lean();
    if (!gig) throw ApiError.notFound("Gig not found");
    await Gig.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return gig as unknown as IGig;
  }

  async getGigBySlug(slug: string): Promise<IGig> {
    const gig = await Gig.findOne({ slug })
      .populate("freelancer", "name avatar headline bio skills")
      .lean();
    if (!gig) throw ApiError.notFound("Gig not found");
    await Gig.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    return gig as unknown as IGig;
  }

  async updateGig(id: string, freelancerId: string, data: Partial<CreateGigInput>): Promise<IGig> {
    const gig = await Gig.findOne({ _id: id, freelancer: freelancerId });
    if (!gig) throw ApiError.notFound("Gig not found or not authorized");
    Object.assign(gig, data);
    await gig.save();
    return gig;
  }

  async deleteGig(id: string, freelancerId: string, role: string): Promise<void> {
    const filter = role === "admin" ? { _id: id } : { _id: id, freelancer: freelancerId };
    const gig = await Gig.findOneAndDelete(filter);
    if (!gig) throw ApiError.notFound("Gig not found or not authorized");
  }

  async getRelatedGigs(gigId: string, category: string, limit = 4): Promise<IGig[]> {
    const gigs = await Gig.find({ category, status: "active", _id: { $ne: gigId } })
      .sort({ averageRating: -1 })
      .limit(limit)
      .populate("freelancer", "name avatar")
      .lean();
      
    return gigs as unknown as IGig[];
  }

  async getMyGigs(freelancerId: string, query: Partial<GigQueryInput>) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
 
    const filter: mongoose.FilterQuery<IGig> = {
      freelancer: new mongoose.Types.ObjectId(freelancerId),
    };
 
    if (query.search) filter.$text = { $search: query.search };
 
    const [gigs, total] = await Promise.all([
      Gig.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Gig.countDocuments(filter),
    ]);

    return {
      gigs: gigs as unknown as IGig[],
      meta: buildPaginationMeta(page, limit, total),
    };
  }
}

export const gigService = new GigService();