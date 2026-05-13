"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const review_validation_1 = require("../validations/review.validation");
const router = (0, express_1.Router)();
router.get("/gig/:gigId", review_controller_1.getGigReviews);
router.post("/gig/:gigId", auth_middleware_1.verifyToken, (0, validate_middleware_1.validate)(review_validation_1.createReviewSchema), review_controller_1.createReview);
router.put("/:id", auth_middleware_1.verifyToken, (0, validate_middleware_1.validate)(review_validation_1.updateReviewSchema), review_controller_1.updateReview);
router.delete("/:id", auth_middleware_1.verifyToken, review_controller_1.deleteReview);
router.post("/:id/helpful", auth_middleware_1.verifyToken, review_controller_1.markHelpful);
exports.default = router;
//# sourceMappingURL=review.routes.js.map