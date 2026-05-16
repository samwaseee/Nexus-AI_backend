import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import gigRoutes from "./gig.routes";
import talentRoutes from "./talent.routes";
import reviewRoutes from "./review.routes";
import aiRoutes from "./ai.routes";
import adminRoutes from "./admin.routes";
import blogRoutes from "./blog.routes";
import orderRoutes from "./order.route";
import docsRoutes from "./docs.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/gigs", gigRoutes);
router.use("/talent", talentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/ai", aiRoutes);
router.use("/admin", adminRoutes);
router.use("/blog", blogRoutes);
router.use("/orders", orderRoutes);
router.use("/docs", docsRoutes);

export default router;