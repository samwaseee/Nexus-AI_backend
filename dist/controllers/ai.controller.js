"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsageStats = exports.deleteConversation = exports.getConversation = exports.getConversations = exports.chatHandler = exports.getRecommendationsHandler = exports.analyzeCareerHandler = exports.buildPitch = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ai_service_1 = require("../services/ai.service");
const User_model_1 = __importDefault(require("../models/User.model"));
const Conversation_model_1 = __importDefault(require("../models/Conversation.model"));
const ApiError_1 = require("../utils/ApiError");
exports.buildPitch = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, ai_service_1.generatePitch)(req.user.userId, req.body);
    (0, ApiResponse_1.sendSuccess)(res, { content: result }, "Pitch generated successfully");
});
exports.analyzeCareerHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, ai_service_1.analyzeCareer)(req.user.userId, req.body);
    (0, ApiResponse_1.sendSuccess)(res, result, "Career analysis complete");
});
exports.getRecommendationsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, ai_service_1.getRecommendations)(req.user.userId, req.body);
    (0, ApiResponse_1.sendSuccess)(res, result, "Recommendations generated");
});
exports.chatHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { message, history, conversationId } = req.body;
    const user = await User_model_1.default.findById(req.user.userId).select("name role skills headline");
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    const userContext = {
        name: user.name,
        role: user.role,
        skills: user.skills,
        headline: user.headline,
    };
    const aiResponse = await (0, ai_service_1.chat)(req.user.userId, userContext, history ?? [], message);
    let savedConversationId = conversationId;
    try {
        if (conversationId) {
            await Conversation_model_1.default.findByIdAndUpdate(conversationId, {
                $push: {
                    messages: [
                        { role: "user", content: message },
                        { role: "assistant", content: aiResponse },
                    ],
                },
            });
        }
        else {
            const conv = await Conversation_model_1.default.create({
                user: req.user.userId,
                title: message.substring(0, 60),
                messages: [
                    { role: "user", content: message },
                    { role: "assistant", content: aiResponse },
                ],
            });
            savedConversationId = conv._id.toString();
        }
    }
    catch {
    }
    (0, ApiResponse_1.sendSuccess)(res, { response: aiResponse, conversationId: savedConversationId }, "Chat response generated");
});
exports.getConversations = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const conversations = await Conversation_model_1.default.find({
        user: req.user.userId,
        isActive: true,
    })
        .sort({ updatedAt: -1 })
        .select("title totalMessages updatedAt createdAt")
        .limit(20);
    (0, ApiResponse_1.sendSuccess)(res, conversations, "Conversations fetched");
});
exports.getConversation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const conversation = await Conversation_model_1.default.findOne({
        _id: req.params.id,
        user: req.user.userId,
    });
    if (!conversation)
        throw ApiError_1.ApiError.notFound("Conversation not found");
    (0, ApiResponse_1.sendSuccess)(res, conversation, "Conversation fetched");
});
exports.deleteConversation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await Conversation_model_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, { isActive: false });
    (0, ApiResponse_1.sendSuccess)(res, null, "Conversation deleted");
});
exports.getUsageStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const stats = await (0, ai_service_1.getAIUsageStats)(req.user.userId);
    (0, ApiResponse_1.sendSuccess)(res, stats, "AI usage stats fetched");
});
//# sourceMappingURL=ai.controller.js.map