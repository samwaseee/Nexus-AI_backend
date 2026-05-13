"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
class UserService {
    async getProfile(userId) {
        const user = await User_model_1.default.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        return user.toPublicJSON();
    }
    async updateProfile(userId, data) {
        const user = await User_model_1.default.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        Object.assign(user, data);
        await user.save();
        return user.toPublicJSON();
    }
    async updateAvatar(userId, avatarUrl) {
        const user = await User_model_1.default.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        return user.toPublicJSON();
    }
    async getPublicProfile(userId) {
        const user = await User_model_1.default.findById(userId).select("name avatar headline bio location skills hourlyRate availability portfolioUrl linkedinUrl githubUrl createdAt");
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        return user.toObject();
    }
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
            if (query.minRate !== undefined)
                filter.hourlyRate.$gte = query.minRate;
            if (query.maxRate !== undefined)
                filter.hourlyRate.$lte = query.maxRate;
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
    async changePassword(userId, currentPassword, newPassword) {
        const user = await User_model_1.default.findById(userId).select("+password");
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        if (!user.password)
            throw ApiError_1.ApiError.badRequest("Cannot change password for OAuth accounts");
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch)
            throw ApiError_1.ApiError.unauthorized("Current password is incorrect");
        user.password = newPassword;
        await user.save();
    }
    async deactivateAccount(userId) {
        await User_model_1.default.findByIdAndUpdate(userId, { isActive: false });
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map