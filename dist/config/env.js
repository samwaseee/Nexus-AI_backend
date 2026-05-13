"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.string().default("5000"),
    MONGO_URI: zod_1.z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: zod_1.z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    JWT_REFRESH_SECRET: zod_1.z
        .string()
        .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("30d"),
    GOOGLE_CLIENT_ID: zod_1.z.string().optional(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().optional(),
    GOOGLE_CALLBACK_URL: zod_1.z
        .string()
        .default("http://localhost:5000/api/auth/google/callback"),
    GEMINI_API_KEY: zod_1.z.string().min(1, "GEMINI_API_KEY is required"),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional(),
    CLOUDINARY_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional(),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().optional(),
    CLIENT_URL: zod_1.z.string().default("http://localhost:3000"),
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().default("900000"),
    RATE_LIMIT_MAX: zod_1.z.string().default("100"),
    AI_RATE_LIMIT_MAX: zod_1.z.string().default("20"),
});
const _parsed = envSchema.safeParse(process.env);
if (!_parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(_parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = {
    ..._parsed.data,
    PORT: parseInt(_parsed.data.PORT, 10),
    RATE_LIMIT_WINDOW_MS: parseInt(_parsed.data.RATE_LIMIT_WINDOW_MS, 10),
    RATE_LIMIT_MAX: parseInt(_parsed.data.RATE_LIMIT_MAX, 10),
    AI_RATE_LIMIT_MAX: parseInt(_parsed.data.AI_RATE_LIMIT_MAX, 10),
    IS_PRODUCTION: _parsed.data.NODE_ENV === "production",
    IS_DEVELOPMENT: _parsed.data.NODE_ENV === "development",
};
//# sourceMappingURL=env.js.map