import { Router } from "express";
import {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
  getAllGigs,
  updateGigStatus,
  getAllDisputes,
  resolveDispute,
} from "../controllers/admin.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

// All admin routes require auth + admin role
router.use(verifyToken, requireAdmin);

// Stats
router.get("/stats", getPlatformStats);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:id/toggle-status", toggleUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Gig management
router.get("/gigs", getAllGigs);
router.patch("/gigs/:id/status", updateGigStatus);

// ─── Disputes ────────────────────────────────────────────────────────
router.get("/disputes", getAllDisputes);
router.patch("/disputes/:id/resolve", resolveDispute);

export default router;