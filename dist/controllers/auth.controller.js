"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthCallback = exports.googleAuth = exports.googleCallback = exports.getMe = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const passport_1 = __importDefault(require("passport"));
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const auth_service_1 = require("../services/auth.service");
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user, accessToken, refreshToken } = await auth_service_1.authService.register(req.body);
    auth_service_1.authService.setTokenCookies(res, accessToken, refreshToken);
    (0, ApiResponse_1.sendCreated)(res, { user, accessToken }, "Account created successfully");
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user, accessToken, refreshToken } = await auth_service_1.authService.login(req.body);
    auth_service_1.authService.setTokenCookies(res, accessToken, refreshToken);
    (0, ApiResponse_1.sendSuccess)(res, { user, accessToken }, "Login successful");
});
exports.refreshToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
    if (!token)
        throw ApiError_1.ApiError.unauthorized("Refresh token required");
    const tokens = await auth_service_1.authService.refreshTokens(token);
    auth_service_1.authService.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    (0, ApiResponse_1.sendSuccess)(res, { accessToken: tokens.accessToken }, "Token refreshed");
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (req.user?.userId) {
        await auth_service_1.authService.logout(req.user.userId);
    }
    auth_service_1.authService.clearTokenCookies(res);
    (0, ApiResponse_1.sendSuccess)(res, null, "Logged out successfully");
});
exports.getMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const User = (await Promise.resolve().then(() => __importStar(require("../models/User.model")))).default;
    const user = await User.findById(req.user?.userId);
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    (0, ApiResponse_1.sendSuccess)(res, user.toPublicJSON(), "User fetched");
});
exports.googleCallback = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const oauthUser = req.user;
    if (!oauthUser)
        throw ApiError_1.ApiError.unauthorized("Google auth failed");
    const { accessToken, refreshToken } = await auth_service_1.authService.handleOAuthUser(oauthUser);
    auth_service_1.authService.setTokenCookies(res, accessToken, refreshToken);
    res.redirect(`${env_1.env.CLIENT_URL}/dashboard?token=${accessToken}`);
});
exports.googleAuth = passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
});
exports.googleAuthCallback = passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: `${env_1.env.CLIENT_URL}/login?error=oauth_failed`,
});
//# sourceMappingURL=auth.controller.js.map