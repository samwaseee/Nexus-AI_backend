"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken, role_middleware_1.requireAdmin);
router.get("/stats", admin_controller_1.getPlatformStats);
router.get("/users", admin_controller_1.getAllUsers);
router.patch("/users/:id/toggle-status", admin_controller_1.toggleUserStatus);
router.patch("/users/:id/role", admin_controller_1.updateUserRole);
router.delete("/users/:id", admin_controller_1.deleteUser);
router.get("/gigs", admin_controller_1.getAllGigs);
router.patch("/gigs/:id/status", admin_controller_1.updateGigStatus);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map