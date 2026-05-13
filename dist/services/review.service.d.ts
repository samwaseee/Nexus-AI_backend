import mongoose from "mongoose";
import { IReview } from "../models/Review.model";
import { CreateReviewInput } from "../validations/review.validation";
export declare class ReviewService {
    createReview(gigId: string, reviewerId: string, data: CreateReviewInput): Promise<IReview>;
    getGigReviews(gigId: string, page?: number, limit?: number): Promise<{
        reviews: (mongoose.FlattenMaps<IReview> & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: import("../utils/ApiResponse").PaginationMeta;
    }>;
    updateReview(reviewId: string, reviewerId: string, data: Partial<CreateReviewInput>): Promise<IReview>;
    deleteReview(reviewId: string, reviewerId: string, role: string): Promise<void>;
    markHelpful(reviewId: string, userId: string): Promise<IReview>;
}
export declare const reviewService: ReviewService;
//# sourceMappingURL=review.service.d.ts.map