"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimit_middleware_1 = require("../middleware/rateLimit.middleware");
const auth_validation_1 = require("../validations/auth.validation");
const router = (0, express_1.Router)();
router.post("/register", rateLimit_middleware_1.authRateLimiter, (0, validate_middleware_1.validate)(auth_validation_1.registerSchema), auth_controller_1.register);
router.post("/login", rateLimit_middleware_1.authRateLimiter, (0, validate_middleware_1.validate)(auth_validation_1.loginSchema), auth_controller_1.login);
router.post("/logout", auth_middleware_1.verifyToken, auth_controller_1.logout);
router.post("/refresh-token", (0, validate_middleware_1.validate)(auth_validation_1.refreshTokenSchema, "body"), auth_controller_1.refreshToken);
router.get("/me", auth_middleware_1.verifyToken, auth_controller_1.getMe);
router.get("/google", auth_controller_1.googleAuth);
router.get("/google/callback", auth_controller_1.googleAuthCallback, auth_controller_1.googleCallback);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map