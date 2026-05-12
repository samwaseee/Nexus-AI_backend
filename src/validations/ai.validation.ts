import { z } from "zod";

export const pitchBuilderSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1, "Role is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required").max(15),
  yearsOfExperience: z.number().min(0).max(50),
  tone: z.enum(["professional", "friendly", "bold"]).default("professional"),
  targetAudience: z.string().min(1, "Target audience is required"),
  keyAchievement: z.string().optional(),
});

export const careerAnalyzerSchema = z.object({
  skills: z.array(z.string()).min(1).max(20),
  currentRole: z.string().min(1),
  yearsOfExperience: z.number().min(0).max(50),
  targetRole: z.string().optional(),
  location: z.string().optional(),
});

export const recommendationSchema = z.object({
  skills: z.array(z.string()).min(1).max(20),
  currentRole: z.string().min(1),
  interests: z.array(z.string()).default([]),
  recentActivity: z.array(z.string()).default([]),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000),
  conversationId: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        parts: z.array(z.object({ text: z.string() })),
      })
    )
    .default([]),
});