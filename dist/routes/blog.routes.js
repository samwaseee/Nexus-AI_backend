"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const BlogPost_model_1 = __importDefault(require("../models/BlogPost.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const ApiError_1 = require("../utils/ApiError");
const slugify_1 = require("../utils/slugify");
const ApiResponse_2 = require("../utils/ApiResponse");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const filter = { status: "published" };
    if (category)
        filter.category = category;
    const [posts, total] = await Promise.all([
        BlogPost_model_1.default.find(filter)
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "name avatar")
            .select("-content"),
        BlogPost_model_1.default.countDocuments(filter),
    ]);
    (0, ApiResponse_1.sendSuccess)(res, posts, "Posts fetched", 200, (0, ApiResponse_2.buildPaginationMeta)(page, limit, total));
}));
router.get("/:slug", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const post = await BlogPost_model_1.default.findOne({ slug: req.params.slug, status: "published" })
        .populate("author", "name avatar headline");
    if (!post)
        throw ApiError_1.ApiError.notFound("Blog post not found");
    await BlogPost_model_1.default.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    (0, ApiResponse_1.sendSuccess)(res, post, "Post fetched");
}));
router.post("/", auth_middleware_1.verifyToken, role_middleware_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const slug = (0, slugify_1.uniqueSlug)(req.body.title);
    const post = await BlogPost_model_1.default.create({
        ...req.body,
        slug,
        author: req.user.userId,
        publishedAt: req.body.status === "published" ? new Date() : undefined,
    });
    (0, ApiResponse_1.sendCreated)(res, post, "Blog post created");
}));
router.put("/:id", auth_middleware_1.verifyToken, role_middleware_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const post = await BlogPost_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post)
        throw ApiError_1.ApiError.notFound("Post not found");
    (0, ApiResponse_1.sendSuccess)(res, post, "Post updated");
}));
router.delete("/:id", auth_middleware_1.verifyToken, role_middleware_1.requireAdmin, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await BlogPost_model_1.default.findByIdAndDelete(req.params.id);
    res.status(204).send();
}));
exports.default = router;
//# sourceMappingURL=blog.routes.js.map