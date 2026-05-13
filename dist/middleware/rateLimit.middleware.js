"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRateLimiter = exports.authRateLimiter = exports.aiRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
exports.aiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: env_1.env.AI_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.userId ?? req.ip ?? "anonymous",
    message: {
        success: false,
        message: `AI rate limit exceeded. Max ${env_1.env.AI_RATE_LIMIT_MAX} requests per minute.`,
    },
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many auth attempts. Try again in 15 minutes.",
    },
});
exports.uploadRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Upload limit exceeded." },
});
//# sourceMappingURL=rateLimit.middleware.js.map