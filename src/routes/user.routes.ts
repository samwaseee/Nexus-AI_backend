import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getPublicProfile,
  changePassword,
  deactivateAccount,
} from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// Protected
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/change-password", verifyToken, changePassword);
router.delete("/account", verifyToken, deactivateAccount);

// Public
router.get("/:id", getPublicProfile);

export default router;