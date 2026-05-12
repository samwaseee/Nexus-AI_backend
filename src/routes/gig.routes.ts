import { Router } from "express";
import {
  getGigs,
  getGigById,
  getGigBySlug,
  createGig,
  updateGig,
  deleteGig,
  getRelatedGigs,
  getMyGigs,
} from "../controllers/gig.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { requireFreelancer, requireAdminOrFreelancer } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createGigSchema, updateGigSchema } from "../validations/gig.validation";

const router = Router();

// Public routes
router.get("/", getGigs);
router.get("/slug/:slug", getGigBySlug);
router.get("/:id/related", getRelatedGigs);
router.get("/:id", getGigById);

// Protected routes
router.get("/freelancer/my-gigs", verifyToken, requireFreelancer, getMyGigs);
router.post("/", verifyToken, requireFreelancer, validate(createGigSchema), createGig);
router.put("/:id", verifyToken, requireAdminOrFreelancer, validate(updateGigSchema), updateGig);
router.delete("/:id", verifyToken, requireAdminOrFreelancer, deleteGig);

export default router;