"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGigStatus = exports.getAllGigs = exports.deleteUser = exports.updateUserRole = exports.toggleUserStatus = exports.getAllUsers = exports.getPlatformStats = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const User_model_1 = __importDefault(require("../models/User.model"));
const Gig_model_1 = __importDefault(require("../models/Gig.model"));
const Review_model_1 = __importDefault(require("../models/Review.model"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_2 = require("../utils/ApiResponse");
const AIsession_model_1 = __importDefault(require("../models/AIsession.model"));
exports.getPlatformStats = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const [totalUsers, totalFreelancers, totalClients, totalGigs, totalReviews, totalAISessions, newUsersThisMonth, newGigsThisMonth,] = await Promise.all([
        User_model_1.default.countDocuments({ isActive: true }),
        User_model_1.default.countDocuments({ role: "freelancer", isActive: true }),
        User_model_1.default.countDocuments({ role: "client", isActive: true }),
        Gig_model_1.default.countDocuments({ status: "active" }),
        Review_model_1.default.countDocuments(),
        AIsession_model_1.default.countDocuments(),
        User_model_1.default.countDocuments({
            createdAt: { $gte: new Date(new Date().setDate(1)) },
        }),
        Gig_model_1.default.countDocuments({
            createdAt: { $gte: new Date(new Date().setDate(1)) },
        }),
    ]);
    const aiUsageByFeature = await AIsession_model_1.default.aggregate([
        { $group: { _id: "$feature", count: { $sum: 1 } } },
    ]);
    const userGrowth = await User_model_1.default.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    const topCategories = await Gig_model_1.default.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
    ]);
    (0, ApiResponse_1.sendSuccess)(res, {
        overview: {
            totalUsers,
            totalFreelancers,
            totalClients,
            totalGigs,
            totalReviews,
            totalAISessions,
            newUsersThisMonth,
            newGigsThisMonth,
        },
        aiUsageByFeature,
        userGrowth,
        topCategories,
    }, "Platform stats fetched");
});
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const role = req.query.role;
    const filter = {};
    if (role)
        filter.role = role;
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    const [users, total] = await Promise.all([
        User_model_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-password -refreshToken"),
        User_model_1.default.countDocuments(filter),
    ]);
    (0, ApiResponse_1.sendSuccess)(res, users, "Users fetched", 200, (0, ApiResponse_2.buildPaginationMeta)(page, limit, total));
});
exports.toggleUserStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_model_1.default.findById(req.params.id);
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    if (user.role === "admin")
        throw ApiError_1.ApiError.forbidden("Cannot deactivate admin");
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    (0, ApiResponse_1.sendSuccess)(res, { isActive: user.isActive }, `User ${user.isActive ? "activated" : "deactivated"}`);
});
exports.updateUserRole = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { role } = req.body;
    if (!["freelancer", "client", "admin"].includes(role)) {
        throw ApiError_1.ApiError.badRequest("Invalid role");
    }
    const user = await User_model_1.default.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password -refreshToken");
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    (0, ApiResponse_1.sendSuccess)(res, user, "User role updated");
});
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_model_1.default.findById(req.params.id);
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    if (user.role === "admin")
        throw ApiError_1.ApiError.forbidden("Cannot delete admin");
    await User_model_1.default.findByIdAndDelete(req.params.id);
    (0, ApiResponse_1.sendNoContent)(res);
});
exports.getAllGigs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;
    const filter = {};
    if (status)
        filter.status = status;
    if (search)
        filter.$text = { $search: search };
    const [gigs, total] = await Promise.all([
        Gig_model_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("freelancer", "name email avatar"),
        Gig_model_1.default.countDocuments(filter),
    ]);
    (0, ApiResponse_1.sendSuccess)(res, gigs, "Gigs fetched", 200, (0, ApiResponse_2.buildPaginationMeta)(page, limit, total));
});
exports.updateGigStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    const gig = await Gig_model_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!gig)
        throw ApiError_1.ApiError.notFound("Gig not found");
    (0, ApiResponse_1.sendSuccess)(res, gig, "Gig status updated");
});
//# sourceMappingURL=admin.controller.js.map