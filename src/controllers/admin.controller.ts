import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendNoContent } from "../utils/ApiResponse";
import User from "../models/User.model";
import Gig from "../models/Gig.model";
import Review from "../models/Review.model";
import { ApiError } from "../utils/ApiError";
import { buildPaginationMeta } from "../utils/ApiResponse";
import AISession from "../models/AIsession.model";

// GET /api/v1/admin/stats — platform overview
export const getPlatformStats = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalUsers,
    totalFreelancers,
    totalClients,
    totalGigs,
    totalReviews,
    totalAISessions,
    newUsersThisMonth,
    newGigsThisMonth,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: "freelancer", isActive: true }),
    User.countDocuments({ role: "client", isActive: true }),
    Gig.countDocuments({ status: "active" }),
    Review.countDocuments(),
    AISession.countDocuments(),
    User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) },
    }),
    Gig.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) },
    }),
  ]);

  // AI usage by feature
  const aiUsageByFeature = await AISession.aggregate([
    { $group: { _id: "$feature", count: { $sum: 1 } } },
  ]);

  // User growth last 6 months
  const userGrowth = await User.aggregate([
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

  // Top categories
  const topCategories = await Gig.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  sendSuccess(res, {
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

// GET /api/v1/admin/users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search as string;
  const role = req.query.role as string;

  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password -refreshToken"),
    User.countDocuments(filter),
  ]);

  sendSuccess(res, users, "Users fetched", 200, buildPaginationMeta(page, limit, total));
});

// PATCH /api/v1/admin/users/:id/toggle-status
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");
  if (user.role === "admin") throw ApiError.forbidden("Cannot deactivate admin");

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });
  sendSuccess(res, { isActive: user.isActive }, `User ${user.isActive ? "activated" : "deactivated"}`);
});

// PATCH /api/v1/admin/users/:id/role
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  if (!["freelancer", "client", "admin"].includes(role)) {
    throw ApiError.badRequest("Invalid role");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) throw ApiError.notFound("User not found");
  sendSuccess(res, user, "User role updated");
});

// DELETE /api/v1/admin/users/:id
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");
  if (user.role === "admin") throw ApiError.forbidden("Cannot delete admin");

  await User.findByIdAndDelete(req.params.id);
  sendNoContent(res);
});

// GET /api/v1/admin/gigs
export const getAllGigs = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status as string;
  const search = req.query.search as string;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const [gigs, total] = await Promise.all([
    Gig.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("freelancer", "name email avatar"),
    Gig.countDocuments(filter),
  ]);

  sendSuccess(res, gigs, "Gigs fetched", 200, buildPaginationMeta(page, limit, total));
});

// PATCH /api/v1/admin/gigs/:id/status
export const updateGigStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const gig = await Gig.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!gig) throw ApiError.notFound("Gig not found");
  sendSuccess(res, gig, "Gig status updated");
});