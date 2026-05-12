import { Router } from "express";
import {
  buildPitch,
  analyzeCareerHandler,
  getRecommendationsHandler,
  chatHandler,
  getConversations,
  getConversation,
  deleteConversation,
  getUsageStats,
} from "../controllers/ai.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { aiRateLimiter } from "../middleware/rateLimit.middleware";
import {
  pitchBuilderSchema,
  careerAnalyzerSchema,
  recommendationSchema,
  chatMessageSchema,
} from "../validations/ai.validation";

const router = Router();

// All AI routes require auth + rate limiting
router.use(verifyToken);
router.use(aiRateLimiter);

router.post("/pitch", validate(pitchBuilderSchema), buildPitch);
router.post("/analyze", validate(careerAnalyzerSchema), analyzeCareerHandler);
router.post("/recommendations", validate(recommendationSchema), getRecommendationsHandler);
router.post("/chat", validate(chatMessageSchema), chatHandler);

// Conversation management
router.get("/conversations", getConversations);
router.get("/conversations/:id", getConversation);
router.delete("/conversations/:id", deleteConversation);

// Usage stats
router.get("/usage", getUsageStats);

export default router;