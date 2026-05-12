import mongoose from "mongoose";
import Review, { IReview } from "../models/Review.model";
import Gig from "../models/Gig.model";
import { ApiError } from "../utils/ApiError";
import { buildPaginationMeta } from "../utils/ApiResponse";
import { CreateReviewInput } from "../validations/review.validation";

export class ReviewService {
  async createReview(
    gigId: string,
    reviewerId: string,
    data: CreateReviewInput
  ): Promise<IReview> {
    const gig = await Gig.findById(gigId);
    if (!gig) throw ApiError.notFound("Gig not found");
    if (gig.freelancer.toString() === reviewerId) {
      throw ApiError.badRequest("You cannot review your own gig");
    }

    const existing = await Review.findOne({
      gig: gigId,
      reviewer: reviewerId,
    });
    if (existing) throw ApiError.conflict("You have already reviewed this gig");

    const review = await Review.create({
      gig: new mongoose.Types.ObjectId(gigId),
      reviewer: new mongoose.Types.ObjectId(reviewerId),
      freelancer: gig.freelancer,
      ...data,
    });

    await review.populate("reviewer", "name avatar");
    return review;
  }

  async getGigReviews(gigId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const filter = { gig: new mongoose.Types.ObjectId(gigId) };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("reviewer", "name avatar")
        .lean(),
      Review.countDocuments(filter),
    ]);

    return { reviews, meta: buildPaginationMeta(page, limit, total) };
  }

  async updateReview(
    reviewId: string,
    reviewerId: string,
    data: Partial<CreateReviewInput>
  ): Promise<IReview> {
    const review = await Review.findOne({ _id: reviewId, reviewer: reviewerId });
    if (!review) throw ApiError.notFound("Review not found or not authorized");
    Object.assign(review, data);
    await review.save();
    return review;
  }

  async deleteReview(reviewId: string, reviewerId: string, role: string): Promise<void> {
    const filter =
      role === "admin"
        ? { _id: reviewId }
        : { _id: reviewId, reviewer: reviewerId };
    const review = await Review.findOneAndDelete(filter);
    if (!review) throw ApiError.notFound("Review not found or not authorized");
  }

  async markHelpful(reviewId: string, userId: string): Promise<IReview> {
    const review = await Review.findById(reviewId);
    if (!review) throw ApiError.notFound("Review not found");

    const uid = new mongoose.Types.ObjectId(userId);
    const alreadyMarked = review.helpful.some((id) => id.equals(uid));

    if (alreadyMarked) {
      review.helpful = review.helpful.filter((id) => !id.equals(uid));
    } else {
      review.helpful.push(uid);
    }

    await review.save();
    return review;
  }
}

export const reviewService = new ReviewService();