"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markHelpful = exports.deleteReview = exports.updateReview = exports.createReview = exports.getGigReviews = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const review_service_1 = require("../services/review.service");
exports.getGigReviews = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await review_service_1.reviewService.getGigReviews(req.params.gigId, page, limit);
    (0, ApiResponse_1.sendSuccess)(res, result.reviews, "Reviews fetched", 200, result.meta);
});
exports.createReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const review = await review_service_1.reviewService.createReview(req.params.gigId, req.user.userId, req.body);
    (0, ApiResponse_1.sendCreated)(res, review, "Review submitted successfully");
});
exports.updateReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const review = await review_service_1.reviewService.updateReview(req.params.id, req.user.userId, req.body);
    (0, ApiResponse_1.sendSuccess)(res, review, "Review updated");
});
exports.deleteReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await review_service_1.reviewService.deleteReview(req.params.id, req.user.userId, req.user.role);
    (0, ApiResponse_1.sendNoContent)(res);
});
exports.markHelpful = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const review = await review_service_1.reviewService.markHelpful(req.params.id, req.user.userId);
    (0, ApiResponse_1.sendSuccess)(res, review, "Helpfulness toggled");
});
//# sourceMappingURL=review.controller.js.map