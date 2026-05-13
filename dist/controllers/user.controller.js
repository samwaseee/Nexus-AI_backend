"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateAccount = exports.changePassword = exports.getPublicProfile = exports.updateProfile = exports.getProfile = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const user_service_1 = require("../services/user.service");
exports.getProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await user_service_1.userService.getProfile(req.user.userId);
    (0, ApiResponse_1.sendSuccess)(res, user, "Profile fetched");
});
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await user_service_1.userService.updateProfile(req.user.userId, req.body);
    (0, ApiResponse_1.sendSuccess)(res, user, "Profile updated successfully");
});
exports.getPublicProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await user_service_1.userService.getPublicProfile(req.params.id);
    (0, ApiResponse_1.sendSuccess)(res, user, "Profile fetched");
});
exports.changePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await user_service_1.userService.changePassword(req.user.userId, currentPassword, newPassword);
    (0, ApiResponse_1.sendSuccess)(res, null, "Password changed successfully");
});
exports.deactivateAccount = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await user_service_1.userService.deactivateAccount(req.user.userId);
    (0, ApiResponse_1.sendSuccess)(res, null, "Account deactivated");
});
//# sourceMappingURL=user.controller.js.map