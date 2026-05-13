"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gig_controller_1 = require("../controllers/gig.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const gig_validation_1 = require("../validations/gig.validation");
const router = (0, express_1.Router)();
router.get("/", gig_controller_1.getGigs);
router.get("/slug/:slug", gig_controller_1.getGigBySlug);
router.get("/:id/related", gig_controller_1.getRelatedGigs);
router.get("/:id", gig_controller_1.getGigById);
router.get("/freelancer/my-gigs", auth_middleware_1.verifyToken, role_middleware_1.requireFreelancer, gig_controller_1.getMyGigs);
router.post("/", auth_middleware_1.verifyToken, role_middleware_1.requireFreelancer, (0, validate_middleware_1.validate)(gig_validation_1.createGigSchema), gig_controller_1.createGig);
router.put("/:id", auth_middleware_1.verifyToken, role_middleware_1.requireAdminOrFreelancer, (0, validate_middleware_1.validate)(gig_validation_1.updateGigSchema), gig_controller_1.updateGig);
router.delete("/:id", auth_middleware_1.verifyToken, role_middleware_1.requireAdminOrFreelancer, gig_controller_1.deleteGig);
exports.default = router;
//# sourceMappingURL=gig.routes.js.map