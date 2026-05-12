import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  googleAuth,
  googleAuthCallback,
  googleCallback,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { verifyToken } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimit.middleware";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validations/auth.validation";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/logout", verifyToken, logout);
router.post("/refresh-token", validate(refreshTokenSchema, "body"), refreshToken);
router.get("/me", verifyToken, getMe);

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, googleCallback);

export default router;