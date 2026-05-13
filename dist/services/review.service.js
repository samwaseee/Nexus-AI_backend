"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = exports.ReviewService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Review_model_1 = __importDefault(require("../models/Review.model"));
const Gig_model_1 = __importDefault(require("../models/Gig.model"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
class ReviewService {
    async createReview(gigId, reviewerId, data) {
        const gig = await Gig_model_1.default.findById(gigId);
        if (!gig)
            throw ApiError_1.ApiError.notFound("Gig not found");
        if (gig.freelancer.toString() === reviewerId) {
            throw ApiError_1.ApiError.badRequest("You cannot review your own gig");
        }
        const existing = await Review_model_1.default.findOne({
            gig: gigId,
            reviewer: reviewerId,
        });
        if (existing)
            throw ApiError_1.ApiError.conflict("You have already reviewed this gig");
        const review = await Review_model_1.default.create({
            gig: new mongoose_1.default.Types.ObjectId(gigId),
            reviewer: new mongoose_1.default.Types.ObjectId(reviewerId),
            freelancer: gig.freelancer,
            ...data,
        });
        await review.populate("reviewer", "name avatar");
        return review;
    }
    async getGigReviews(gigId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const filter = { gig: new mongoose_1.default.Types.ObjectId(gigId) };
        const [reviews, total] = await Promise.all([
            Review_model_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("reviewer", "name avatar")
                .lean(),
            Review_model_1.default.countDocuments(filter),
        ]);
        return { reviews, meta: (0, ApiResponse_1.buildPaginationMeta)(page, limit, total) };
    }
    async updateReview(reviewId, reviewerId, data) {
        const review = await Review_model_1.default.findOne({ _id: reviewId, reviewer: reviewerId });
        if (!review)
            throw ApiError_1.ApiError.notFound("Review not found or not authorized");
        Object.assign(review, data);
        await review.save();
        return review;
    }
    async deleteReview(reviewId, reviewerId, role) {
        const filter = role === "admin"
            ? { _id: reviewId }
            : { _id: reviewId, reviewer: reviewerId };
        const review = await Review_model_1.default.findOneAndDelete(filter);
        if (!review)
            throw ApiError_1.ApiError.notFound("Review not found or not authorized");
    }
    async markHelpful(reviewId, userId) {
        const review = await Review_model_1.default.findById(reviewId);
        if (!review)
            throw ApiError_1.ApiError.notFound("Review not found");
        const uid = new mongoose_1.default.Types.ObjectId(userId);
        const alreadyMarked = review.helpful.some((id) => id.equals(uid));
        if (alreadyMarked) {
            review.helpful = review.helpful.filter((id) => !id.equals(uid));
        }
        else {
            review.helpful.push(uid);
        }
        await review.save();
        return review;
    }
}
exports.ReviewService = ReviewService;
exports.reviewService = new ReviewService();
//# sourceMappingURL=review.service.js.map