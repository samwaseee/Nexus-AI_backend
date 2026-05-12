import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

type Role = "freelancer" | "client" | "admin";

/**
 * Usage: router.delete('/users/:id', verifyToken, requireRole('admin'), handler)
 */
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role(s): ${allowedRoles.join(", ")}`
        )
      );
    }

    next();
  };
};

export const requireAdmin = requireRole("admin");
export const requireFreelancer = requireRole("freelancer");
export const requireClient = requireRole("client");
export const requireAdminOrFreelancer = requireRole("admin", "freelancer");