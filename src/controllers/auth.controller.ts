import { Request, Response } from "express";
import passport from "passport";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../utils/ApiResponse";
import { authService } from "../services/auth.service";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/User.model";
import { env } from "../config/env";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  authService.setTokenCookies(res, accessToken, refreshToken);
  sendCreated(res, { user, accessToken }, "Account created successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  authService.setTokenCookies(res, accessToken, refreshToken);
  sendSuccess(res, { user, accessToken }, "Login successful");
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
  if (!token) throw ApiError.unauthorized("Refresh token required");

  const tokens = await authService.refreshTokens(token);
  authService.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
  sendSuccess(res, { accessToken: tokens.accessToken }, "Token refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.userId) {
    await authService.logout(req.user.userId);
  }
  authService.clearTokenCookies(res);
  sendSuccess(res, null, "Logged out successfully");
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const User = (await import("../models/User.model")).default;
  const user = await User.findById(req.user?.userId);
  if (!user) throw ApiError.notFound("User not found");
  sendSuccess(res, user.toPublicJSON(), "User fetched");
});

export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const oauthUser = req.user as unknown as IUser;
    if (!oauthUser) throw ApiError.unauthorized("Google auth failed");

    const { accessToken, refreshToken } =
      await authService.handleOAuthUser(oauthUser);

    authService.setTokenCookies(res, accessToken, refreshToken);
    res.redirect(`${env.CLIENT_URL}/dashboard?token=${accessToken}`);
  }
);

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export const googleAuthCallback = passport.authenticate("google", {
  session: false,
  failureRedirect: `${env.CLIENT_URL}/login?error=oauth_failed`,
});