import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target]);
      req[target] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return next(
          new ApiError(422, "Validation failed", errors)
        );
      }
      next(error);
    }
  };