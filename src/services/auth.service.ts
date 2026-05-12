import User, { IUser } from "../models/User.model";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { RegisterInput, LoginInput } from "../validations/auth.validation";
import { env } from "../config/env";

export class AuthService {
  async register(data: RegisterInput): Promise<{
    user: Partial<IUser>;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw ApiError.conflict("An account with this email already exists");
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      provider: "local",
    });

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = generateTokenPair(payload);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginInput): Promise<{
    user: Partial<IUser>;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await User.findByEmail(data.email);

    if (!user || !(await user.comparePassword(data.password))) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    if (!user.isActive) {
      throw ApiError.forbidden("Your account has been deactivated");
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = generateTokenPair(payload);

    user.refreshToken = refreshToken;
    user.lastSeen = new Date();
    await user.save({ validateBeforeSave: false });

    return {
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(token: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.userId).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(payload);

    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async handleOAuthUser(oauthUser: IUser): Promise<{
    user: Partial<IUser>;
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      userId: oauthUser._id.toString(),
      email: oauthUser.email,
      role: oauthUser.role,
    };

    const { accessToken, refreshToken } = generateTokenPair(payload);

    oauthUser.refreshToken = refreshToken;
    await oauthUser.save({ validateBeforeSave: false });

    return {
      user: oauthUser.toPublicJSON(),
      accessToken,
      refreshToken,
    };
  }

  setTokenCookies(
    res: import("express").Response,
    accessToken: string,
    refreshToken: string
  ): void {
    const isProduction = env.IS_PRODUCTION;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  clearTokenCookies(res: import("express").Response): void {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }
}

export const authService = new AuthService();