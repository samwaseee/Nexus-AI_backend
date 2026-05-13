"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const jwt_1 = require("../utils/jwt");
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
class AuthService {
    async register(data) {
        const existingUser = await User_model_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw ApiError_1.ApiError.conflict("An account with this email already exists");
        }
        const user = await User_model_1.default.create({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            provider: "local",
        });
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const { accessToken, refreshToken } = (0, jwt_1.generateTokenPair)(payload);
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return {
            user: user.toPublicJSON(),
            accessToken,
            refreshToken,
        };
    }
    async login(data) {
        const user = await User_model_1.default.findByEmail(data.email);
        if (!user || !(await user.comparePassword(data.password))) {
            throw ApiError_1.ApiError.unauthorized("Invalid email or password");
        }
        if (!user.isActive) {
            throw ApiError_1.ApiError.forbidden("Your account has been deactivated");
        }
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const { accessToken, refreshToken } = (0, jwt_1.generateTokenPair)(payload);
        user.refreshToken = refreshToken;
        user.lastSeen = new Date();
        await user.save({ validateBeforeSave: false });
        return {
            user: user.toPublicJSON(),
            accessToken,
            refreshToken,
        };
    }
    async refreshTokens(token) {
        const decoded = (0, jwt_1.verifyRefreshToken)(token);
        const user = await User_model_1.default.findById(decoded.userId).select("+refreshToken");
        if (!user || user.refreshToken !== token) {
            throw ApiError_1.ApiError.unauthorized("Invalid refresh token");
        }
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const tokens = (0, jwt_1.generateTokenPair)(payload);
        user.refreshToken = tokens.refreshToken;
        await user.save({ validateBeforeSave: false });
        return tokens;
    }
    async logout(userId) {
        await User_model_1.default.findByIdAndUpdate(userId, { refreshToken: null });
    }
    async handleOAuthUser(oauthUser) {
        const payload = {
            userId: oauthUser._id.toString(),
            email: oauthUser.email,
            role: oauthUser.role,
        };
        const { accessToken, refreshToken } = (0, jwt_1.generateTokenPair)(payload);
        oauthUser.refreshToken = refreshToken;
        await oauthUser.save({ validateBeforeSave: false });
        return {
            user: oauthUser.toPublicJSON(),
            accessToken,
            refreshToken,
        };
    }
    setTokenCookies(res, accessToken, refreshToken) {
        const isProduction = env_1.env.IS_PRODUCTION;
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    }
    clearTokenCookies(res) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map