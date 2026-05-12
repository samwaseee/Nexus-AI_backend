import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendCreated, sendNoContent } from "../utils/ApiResponse";
import { reviewService } from "../services/review.service";

// GET /api/v1/reviews/gig/:gigId
export const getGigReviews = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await reviewService.getGigReviews(req.params.gigId, page, limit);
  sendSuccess(res, result.reviews, "Reviews fetched", 200, result.meta);
});

// POST /api/v1/reviews/gig/:gigId
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(
    req.params.gigId,
    req.user!.userId,
    req.body
  );
  sendCreated(res, review, "Review submitted successfully");
});

// PUT /api/v1/reviews/:id
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.updateReview(
    req.params.id,
    req.user!.userId,
    req.body
  );
  sendSuccess(res, review, "Review updated");
});

// DELETE /api/v1/reviews/:id
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  await reviewService.deleteReview(req.params.id, req.user!.userId, req.user!.role);
  sendNoContent(res);
});

// POST /api/v1/reviews/:id/helpful
export const markHelpful = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.markHelpful(req.params.id, req.user!.userId);
  sendSuccess(res, review, "Helpfulness toggled");
});