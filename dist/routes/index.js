"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const gig_routes_1 = __importDefault(require("./gig.routes"));
const talent_routes_1 = __importDefault(require("./talent.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const ai_routes_1 = __importDefault(require("./ai.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const blog_routes_1 = __importDefault(require("./blog.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/gigs", gig_routes_1.default);
router.use("/talent", talent_routes_1.default);
router.use("/reviews", review_routes_1.default);
router.use("/ai", ai_routes_1.default);
router.use("/admin", admin_routes_1.default);
router.use("/blog", blog_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map