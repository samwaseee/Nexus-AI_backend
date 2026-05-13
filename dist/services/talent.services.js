"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.talentService = exports.TalentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Gig_model_1 = __importDefault(require("../models/Gig.model"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
class TalentService {
    async getTalentList(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 12;
        const skip = (page - 1) * limit;
        const filter = {
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
            if (query.minRate)
                filter.hourlyRate.$gte = Number(query.minRate);
            if (query.maxRate)
                filter.hourlyRate.$lte = Number(query.maxRate);
        }
        const sortMap = {
            newest: { createdAt: -1 },
            rate_asc: { hourlyRate: 1 },
            rate_desc: { hourlyRate: -1 },
        };
        const sort = sortMap[query.sortBy ?? "newest"] ?? sortMap.newest;
        const [users, total] = await Promise.all([
            User_model_1.default.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select("name avatar headline bio skills hourlyRate availability location createdAt")
                .lean(),
            User_model_1.default.countDocuments(filter),
        ]);
        return { users, meta: (0, ApiResponse_1.buildPaginationMeta)(page, limit, total) };
    }
    async getTalentProfile(userId) {
        const user = await User_model_1.default.findOne({
            _id: userId,
            role: "freelancer",
            isActive: true,
        }).select("name avatar headline bio skills hourlyRate availability location portfolioUrl linkedinUrl githubUrl createdAt");
        if (!user)
            throw ApiError_1.ApiError.notFound("Freelancer not found");
        return user;
    }
    async getTalentGigs(userId) {
        const gigs = await Gig_model_1.default.find({
            freelancer: new mongoose_1.default.Types.ObjectId(userId),
            status: "active",
        })
            .sort({ createdAt: -1 })
            .lean();
        return gigs;
    }
}
exports.TalentService = TalentService;
exports.talentService = new TalentService();
//# sourceMappingURL=talent.services.js.map