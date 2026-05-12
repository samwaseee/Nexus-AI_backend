import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import User from "../models/User.model";

declare global {
  namespace Express {
    // This globally overrides the default Express User interface
    interface User {
      userId: string;
      email: string;
      role: string;
    }
  }
}

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw ApiError.unauthorized("No token provided");
    }

    const decoded = verifyAccessToken(token);

    const userExists = await User.findById(decoded.userId).select("isActive");
    if (!userExists || !userExists.isActive) {
      throw ApiError.unauthorized("User account is inactive or does not exist");
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) token = authHeader.split(" ")[1];
    else if (req.cookies?.accessToken) token = req.cookies.accessToken;

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }
  } catch {
    // token invalid — proceed as unauthenticated
  }
  next();
};