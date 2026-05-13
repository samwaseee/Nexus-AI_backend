"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const user_service_1 = require("../services/user.service");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.userService.getTalentList(req.query);
    (0, ApiResponse_1.sendSuccess)(res, result.users, "Talent fetched", 200, result.meta);
}));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await user_service_1.userService.getPublicProfile(req.params.id);
    (0, ApiResponse_1.sendSuccess)(res, user, "Freelancer profile fetched");
}));
exports.default = router;
//# sourceMappingURL=talent.routes.js.map