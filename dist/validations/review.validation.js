"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    title: zod_1.z.string().min(5, "Title must be at least 5 characters").max(100),
    comment: zod_1.z.string().min(20, "Comment must be at least 20 characters").max(1000),
});
exports.updateReviewSchema = exports.createReviewSchema.partial();
//# sourceMappingURL=review.validation.js.map