import rateLimit from "express-rate-limit";
import { env } from "../config/env";

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.AI_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId ?? req.ip ?? "anonymous",
  message: {
    success: false,
    message: `AI rate limit exceeded. Max ${env.AI_RATE_LIMIT_MAX} requests per minute.`,
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts. Try again in 15 minutes.",
  },
});

export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Upload limit exceeded." },
});