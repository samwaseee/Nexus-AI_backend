import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import {
  generatePitch,
  analyzeCareer,
  getRecommendations,
  chat,
  getAIUsageStats,
} from "../services/ai.service";
import User from "../models/User.model";
import Conversation from "../models/Conversation.model";
import { ApiError } from "../utils/ApiError";

// POST /api/v1/ai/pitch
export const buildPitch = asyncHandler(async (req: Request, res: Response) => {
  const result = await generatePitch(req.user!.userId, req.body);
  sendSuccess(res, { content: result }, "Pitch generated successfully");
});

// POST /api/v1/ai/analyze
export const analyzeCareerHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await analyzeCareer(req.user!.userId, req.body);
  sendSuccess(res, result, "Career analysis complete");
});

// POST /api/v1/ai/recommendations
export const getRecommendationsHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await getRecommendations(req.user!.userId, req.body);
  sendSuccess(res, result, "Recommendations generated");
});

// POST /api/v1/ai/chat
export const chatHandler = asyncHandler(async (req: Request, res: Response) => {
  const { message, history, conversationId } = req.body;

  const user = await User.findById(req.user!.userId).select(
    "name role skills headline"
  );
  if (!user) throw ApiError.notFound("User not found");

  const userContext = {
    name: user.name,
    role: user.role,
    skills: user.skills,
    headline: user.headline,
  };

  const aiResponse = await chat(req.user!.userId, userContext, history ?? [], message);

  // Persist conversation if conversationId provided (or create new)
  let savedConversationId = conversationId;
  try {
    if (conversationId) {
      await Conversation.findByIdAndUpdate(conversationId, {
        $push: {
          messages: [
            { role: "user", content: message },
            { role: "assistant", content: aiResponse },
          ],
        },
      });
    } else {
      const conv = await Conversation.create({
        user: req.user!.userId,
        title: message.substring(0, 60),
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: aiResponse },
        ],
      });
      savedConversationId = conv._id.toString();
    }
  } catch {
    // non-critical — still return the response
  }

  sendSuccess(
    res,
    { response: aiResponse, conversationId: savedConversationId },
    "Chat response generated"
  );
});

// GET /api/v1/ai/conversations
export const getConversations = asyncHandler(async (req: Request, res: Response) => {
  const conversations = await Conversation.find({
    user: req.user!.userId,
    isActive: true,
  })
    .sort({ updatedAt: -1 })
    .select("title totalMessages updatedAt createdAt")
    .limit(20);

  sendSuccess(res, conversations, "Conversations fetched");
});

// GET /api/v1/ai/conversations/:id
export const getConversation = asyncHandler(async (req: Request, res: Response) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    user: req.user!.userId,
  });
  if (!conversation) throw ApiError.notFound("Conversation not found");
  sendSuccess(res, conversation, "Conversation fetched");
});

// DELETE /api/v1/ai/conversations/:id
export const deleteConversation = asyncHandler(async (req: Request, res: Response) => {
  await Conversation.findOneAndUpdate(
    { _id: req.params.id, user: req.user!.userId },
    { isActive: false }
  );
  sendSuccess(res, null, "Conversation deleted");
});

// GET /api/v1/ai/usage — AI usage stats for the user
export const getUsageStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getAIUsageStats(req.user!.userId);
  sendSuccess(res, stats, "AI usage stats fetched");
});