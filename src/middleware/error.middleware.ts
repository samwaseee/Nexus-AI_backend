import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    error = new ApiError(422, "Validation failed", errors);
  } else if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = new ApiError(400, "Database validation failed", errors);
  } else if (err instanceof mongoose.Error.CastError) {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  } else if ((err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0];
    error = ApiError.conflict(`${field} already exists`);
  } else if (err instanceof Error) {
    error = new ApiError(
      500,
      env.IS_PRODUCTION ? "Internal server error" : err.message
    );
  } else {
    error = ApiError.internal();
  }

  if (env.IS_DEVELOPMENT) {
    console.error(`[${req.method}] ${req.path}`, {
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
      stack: error.stack,
    });
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors.length > 0 ? error.errors : undefined,
    ...(env.IS_DEVELOPMENT && { stack: error.stack }),
  });
};