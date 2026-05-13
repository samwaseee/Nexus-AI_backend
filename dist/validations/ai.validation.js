"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessageSchema = exports.recommendationSchema = exports.careerAnalyzerSchema = exports.pitchBuilderSchema = void 0;
const zod_1 = require("zod");
exports.pitchBuilderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    role: zod_1.z.string().min(1, "Role is required"),
    skills: zod_1.z.array(zod_1.z.string()).min(1, "At least one skill is required").max(15),
    yearsOfExperience: zod_1.z.number().min(0).max(50),
    tone: zod_1.z.enum(["professional", "friendly", "bold"]).default("professional"),
    targetAudience: zod_1.z.string().min(1, "Target audience is required"),
    keyAchievement: zod_1.z.string().optional(),
});
exports.careerAnalyzerSchema = zod_1.z.object({
    skills: zod_1.z.array(zod_1.z.string()).min(1).max(20),
    currentRole: zod_1.z.string().min(1),
    yearsOfExperience: zod_1.z.number().min(0).max(50),
    targetRole: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
exports.recommendationSchema = zod_1.z.object({
    skills: zod_1.z.array(zod_1.z.string()).min(1).max(20),
    currentRole: zod_1.z.string().min(1),
    interests: zod_1.z.array(zod_1.z.string()).default([]),
    recentActivity: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.chatMessageSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, "Message cannot be empty").max(1000),
    conversationId: zod_1.z.string().optional(),
    history: zod_1.z
        .array(zod_1.z.object({
        role: zod_1.z.enum(["user", "model"]),
        parts: zod_1.z.array(zod_1.z.object({ text: zod_1.z.string() })),
    }))
        .default([]),
});
//# sourceMappingURL=ai.validation.js.map