"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.verifyToken = void 0;
const jwt_1 = require("../utils/jwt");
const ApiError_1 = require("../utils/ApiError");
const User_model_1 = __importDefault(require("../models/User.model"));
const verifyToken = async (req, _res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        if (!token) {
            throw ApiError_1.ApiError.unauthorized("No token provided");
        }
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        const userExists = await User_model_1.default.findById(decoded.userId).select("isActive");
        if (!userExists || !userExists.isActive) {
            throw ApiError_1.ApiError.unauthorized("User account is inactive or does not exist");
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError)
            return next(error);
        next(ApiError_1.ApiError.unauthorized("Invalid or expired token"));
    }
};
exports.verifyToken = verifyToken;
const optionalAuth = async (req, _res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer "))
            token = authHeader.split(" ")[1];
        else if (req.cookies?.accessToken)
            token = req.cookies.accessToken;
        if (token) {
            const decoded = (0, jwt_1.verifyAccessToken)(token);
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            };
        }
    }
    catch {
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map