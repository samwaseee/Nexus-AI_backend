import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import passport from "passport";

import corsMiddleware from "./config/cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";

import "./config/passport";
import { ApiError } from "./utils/ApiError";
import routes from "./routes";

const app: Application = express();

// ─── Security headers ──────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use(corsMiddleware);

// ─── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── Data sanitization (prevents NoSQL injection) ─────────────────────────
app.use(mongoSanitize());

// ─── HTTP request logger ───────────────────────────────────────────────────
if (env.IS_DEVELOPMENT) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Global rate limiter ───────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", globalLimiter);

// ─── Passport (OAuth) ──────────────────────────────────────────────────────
app.use(passport.initialize());

// ─── Health check ──────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "NexusAI API is running",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────
app.use("/api/v1", routes);

// ─── 404 handler ───────────────────────────────────────────────────────────
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${_req.originalUrl}`));
});

// ─── Global error handler ──────────────────────────────────────────────────
app.use(errorHandler);

export default app;