"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gigService = exports.GigService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Gig_model_1 = __importDefault(require("../models/Gig.model"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const slugify_1 = require("../utils/slugify");
class GigService {
    async createGig(freelancerId, data) {
        const slug = (0, slugify_1.uniqueSlug)(data.title);
        const gig = await Gig_model_1.default.create({
            ...data,
            slug,
            freelancer: new mongoose_1.default.Types.ObjectId(freelancerId),
        });
        return gig;
    }
    async getGigs(query) {
        const { page, limit, search, category, minPrice, maxPrice, rating, experienceLevel, deliveryTime, sortBy, skills } = query;
        const filter = { status: "active" };
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }
        if (category)
            filter.category = category;
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.startingPrice = {};
            if (minPrice !== undefined)
                filter.startingPrice.$gte = minPrice;
            if (maxPrice !== undefined)
                filter.startingPrice.$lte = maxPrice;
        }
        if (rating !== undefined)
            filter.averageRating = { $gte: rating };
        if (experienceLevel)
            filter.experienceLevel = experienceLevel;
        if (deliveryTime)
            filter.deliveryTime = deliveryTime;
        if (skills) {
            const skillList = skills.split(",").map((s) => s.trim());
            filter.skills = { $in: skillList };
        }
        const sortMap = {
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
            Gig_model_1.default.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate("freelancer", "name avatar headline averageRating")
                .lean(),
            Gig_model_1.default.countDocuments(filter),
        ]);
        return {
            gigs: gigs,
            meta: (0, ApiResponse_1.buildPaginationMeta)(page, limit, total),
        };
    }
    async getGigById(id) {
        const gig = await Gig_model_1.default.findById(id)
            .populate("freelancer", "name avatar headline bio skills averageRating totalReviews")
            .lean();
        if (!gig)
            throw ApiError_1.ApiError.notFound("Gig not found");
        await Gig_model_1.default.findByIdAndUpdate(id, { $inc: { views: 1 } });
        return gig;
    }
    async getGigBySlug(slug) {
        const gig = await Gig_model_1.default.findOne({ slug })
            .populate("freelancer", "name avatar headline bio skills")
            .lean();
        if (!gig)
            throw ApiError_1.ApiError.notFound("Gig not found");
        await Gig_model_1.default.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
        return gig;
    }
    async updateGig(id, freelancerId, data) {
        const gig = await Gig_model_1.default.findOne({ _id: id, freelancer: freelancerId });
        if (!gig)
            throw ApiError_1.ApiError.notFound("Gig not found or not authorized");
        Object.assign(gig, data);
        await gig.save();
        return gig;
    }
    async deleteGig(id, freelancerId, role) {
        const filter = role === "admin" ? { _id: id } : { _id: id, freelancer: freelancerId };
        const gig = await Gig_model_1.default.findOneAndDelete(filter);
        if (!gig)
            throw ApiError_1.ApiError.notFound("Gig not found or not authorized");
    }
    async getRelatedGigs(gigId, category, limit = 4) {
        const gigs = await Gig_model_1.default.find({ category, status: "active", _id: { $ne: gigId } })
            .sort({ averageRating: -1 })
            .limit(limit)
            .populate("freelancer", "name avatar")
            .lean();
        return gigs;
    }
    async getMyGigs(freelancerId, query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {
            freelancer: new mongoose_1.default.Types.ObjectId(freelancerId),
        };
        if (query.search)
            filter.$text = { $search: query.search };
        const [gigs, total] = await Promise.all([
            Gig_model_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Gig_model_1.default.countDocuments(filter),
        ]);
        return {
            gigs: gigs,
            meta: (0, ApiResponse_1.buildPaginationMeta)(page, limit, total),
        };
    }
}
exports.GigService = GigService;
exports.gigService = new GigService();
//# sourceMappingURL=gig.service.js.map