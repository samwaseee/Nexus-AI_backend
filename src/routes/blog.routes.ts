import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../utils/ApiResponse";
import BlogPost from "../models/BlogPost.model";
import { verifyToken } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import { ApiError } from "../utils/ApiError";
import { uniqueSlug } from "../utils/slugify";
import { buildPaginationMeta } from "../utils/ApiResponse";

const router = Router();

// GET /api/v1/blog — public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const category = req.query.category as string;

    const filter: Record<string, unknown> = { status: "published" };
    if (category) filter.category = category;

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name avatar")
        .select("-content"),
      BlogPost.countDocuments(filter),
    ]);

    sendSuccess(res, posts, "Posts fetched", 200, buildPaginationMeta(page, limit, total));
  })
);

// GET /api/v1/blog/:slug — public
router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const post = await BlogPost.findOne({ slug: req.params.slug, status: "published" })
      .populate("author", "name avatar headline");
    if (!post) throw ApiError.notFound("Blog post not found");
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    sendSuccess(res, post, "Post fetched");
  })
);

// POST /api/v1/blog — admin only
router.post(
  "/",
  verifyToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const slug = uniqueSlug(req.body.title);
    const post = await BlogPost.create({
      ...req.body,
      slug,
      author: req.user!.userId,
      publishedAt: req.body.status === "published" ? new Date() : undefined,
    });
    sendCreated(res, post, "Blog post created");
  })
);

// PUT /api/v1/blog/:id — admin only
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) throw ApiError.notFound("Post not found");
    sendSuccess(res, post, "Post updated");
  })
);

// DELETE /api/v1/blog/:id — admin only
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(204).send();
  })
);

export default router;