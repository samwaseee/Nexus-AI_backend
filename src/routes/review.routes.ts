import { Router } from "express";
import {
  getGigReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} from "../controllers/review.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createReviewSchema, updateReviewSchema } from "../validations/review.validation";

const router = Router();

// Public
router.get("/gig/:gigId", getGigReviews);

// Protected
router.post("/gig/:gigId", verifyToken, validate(createReviewSchema), createReview);
router.put("/:id", verifyToken, validate(updateReviewSchema), updateReview);
router.delete("/:id", verifyToken, deleteReview);
router.post("/:id/helpful", verifyToken, markHelpful);

export default router;