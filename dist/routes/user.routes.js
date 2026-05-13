"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/profile", auth_middleware_1.verifyToken, user_controller_1.getProfile);
router.put("/profile", auth_middleware_1.verifyToken, user_controller_1.updateProfile);
router.post("/change-password", auth_middleware_1.verifyToken, user_controller_1.changePassword);
router.delete("/account", auth_middleware_1.verifyToken, user_controller_1.deactivateAccount);
router.get("/:id", user_controller_1.getPublicProfile);
exports.default = router;
//# sourceMappingURL=user.routes.js.map