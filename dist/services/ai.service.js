"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIUsageStats = exports.chat = exports.getRecommendations = exports.analyzeCareer = exports.generatePitch = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../config/env");
const promptTemplates_1 = require("../utils/promptTemplates");
const ApiError_1 = require("../utils/ApiError");
const AIsession_model_1 = __importDefault(require("../models/AIsession.model"));
const genAI = new generative_ai_1.GoogleGenerativeAI(env_1.env.GEMINI_API_KEY);
const getModel = (modelName = "gemini-1.5-flash") => {
    return genAI.getGenerativeModel({ model: modelName });
};
const saveSession = async (userId, feature, prompt, response, durationMs) => {
    try {
        await AIsession_model_1.default.create({
            user: userId,
            feature,
            prompt: prompt.substring(0, 1000),
            response: response.substring(0, 2000),
            durationMs,
        });
    }
    catch {
    }
};
const generatePitch = async (userId, input) => {
    const model = getModel();
    const prompt = (0, promptTemplates_1.pitchBuilderPrompt)(input);
    const start = Date.now();
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        await saveSession(userId, "pitch_builder", prompt, text, Date.now() - start);
        return text;
    }
    catch (err) {
        throw ApiError_1.ApiError.internal("AI pitch generation failed. Please try again.");
    }
};
exports.generatePitch = generatePitch;
const analyzeCareer = async (userId, input) => {
    const model = getModel();
    const prompt = (0, promptTemplates_1.careerAnalyzerPrompt)(input);
    const start = Date.now();
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        await saveSession(userId, "career_analyzer", prompt, text, Date.now() - start);
        return parsed;
    }
    catch (err) {
        if (err instanceof SyntaxError) {
            throw ApiError_1.ApiError.internal("AI returned malformed data. Please try again.");
        }
        throw ApiError_1.ApiError.internal("Career analysis failed. Please try again.");
    }
};
exports.analyzeCareer = analyzeCareer;
const getRecommendations = async (userId, input) => {
    const model = getModel();
    const prompt = (0, promptTemplates_1.recommendationPrompt)(input);
    const start = Date.now();
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        await saveSession(userId, "recommendations", prompt, text, Date.now() - start);
        return parsed;
    }
    catch (err) {
        if (err instanceof SyntaxError) {
            throw ApiError_1.ApiError.internal("AI returned malformed data. Please try again.");
        }
        throw ApiError_1.ApiError.internal("Recommendations failed. Please try again.");
    }
};
exports.getRecommendations = getRecommendations;
const chat = async (userId, userContext, history, userMessage) => {
    const model = getModel();
    const systemPrompt = (0, promptTemplates_1.chatSystemPrompt)(userContext);
    const start = Date.now();
    try {
        const chatSession = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Please acknowledge your role and be ready to help." }],
                },
                {
                    role: "model",
                    parts: [{ text: systemPrompt }],
                },
                ...history.slice(-10),
            ],
            generationConfig: {
                maxOutputTokens: 512,
                temperature: 0.7,
            },
        });
        const result = await chatSession.sendMessage(userMessage);
        const responseText = result.response.text();
        await saveSession(userId, "chat", userMessage, responseText, Date.now() - start);
        return responseText;
    }
    catch (err) {
        throw ApiError_1.ApiError.internal("Chat failed. Please try again.");
    }
};
exports.chat = chat;
const getAIUsageStats = async (userId) => {
    const stats = await AIsession_model_1.default.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: "$feature",
                count: { $sum: 1 },
                avgDuration: { $avg: "$durationMs" },
                lastUsed: { $max: "$createdAt" },
            },
        },
    ]);
    const total = await AIsession_model_1.default.countDocuments({ user: userId });
    return { breakdown: stats, total };
};
exports.getAIUsageStats = getAIUsageStats;
//# sourceMappingURL=ai.service.js.map