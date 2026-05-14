import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { userService } from "../services/user.service";
import Order from "../models/Order.model";

// GET /api/v1/users/profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getProfile(req.user!.userId);
  sendSuccess(res, user, "Profile fetched");
});

// PUT /api/v1/users/profile
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.user!.userId, req.body);
  sendSuccess(res, user, "Profile updated successfully");
});

// GET /api/v1/users/:id — public profile
export const getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getPublicProfile(req.params.id);
  sendSuccess(res, user, "Profile fetched");
});

// POST /api/v1/users/change-password
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user!.userId, currentPassword, newPassword);
  sendSuccess(res, null, "Password changed successfully");
});

// DELETE /api/v1/users/account
export const deactivateAccount = asyncHandler(async (req: Request, res: Response) => {
  await userService.deactivateAccount(req.user!.userId);
  sendSuccess(res, null, "Account deactivated");
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  // Find orders where the user is EITHER the client OR the freelancer
  const orders = await Order.find({
    $or: [{ client: req.user!.userId }, { freelancer: req.user!.userId }]
  })
    .populate("client", "name avatar")
    .populate("freelancer", "name avatar")
    .sort({ createdAt: -1 });

  sendSuccess(res, orders, "Orders fetched successfully");
});