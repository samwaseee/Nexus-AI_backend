import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getPublicProfile,
  changePassword,
  deactivateAccount,
  getSavedGigs,
  toggleSavedGig,
} from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// Protected
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/change-password", verifyToken, changePassword);
router.delete("/account", verifyToken, deactivateAccount);
router.get("/saved-gigs", verifyToken, getSavedGigs);
router.post("/saved-gigs/:gigId", verifyToken, toggleSavedGig);

// Public
router.get("/:id", getPublicProfile);

export default router;