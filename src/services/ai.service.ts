import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { env } from "../config/env";
import {
  pitchBuilderPrompt,
  careerAnalyzerPrompt,
  recommendationPrompt,
  chatSystemPrompt,
  PitchBuilderInput,
  CareerAnalyzerInput,
  RecommendationInput,
} from "../utils/promptTemplates";
import { ApiError } from "../utils/ApiError";
import AISession from "../models/AIsession.model";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const getModel = (modelName = "gemini-1.5-flash"): GenerativeModel => {
  return genAI.getGenerativeModel({ model: modelName });
};

// ─── Helper: save AI session for analytics ───────────────────────────────
const saveSession = async (
  userId: string,
  feature: string,
  prompt: string,
  response: string,
  durationMs: number
) => {
  try {
    await AISession.create({
      user: userId,
      feature,
      prompt: prompt.substring(0, 1000),
      response: response.substring(0, 2000),
      durationMs,
    });
  } catch {
    // non-critical — don't fail the request if logging fails
  }
};

// ─── 1. Pitch Builder ────────────────────────────────────────────────────
export const generatePitch = async (
  userId: string,
  input: PitchBuilderInput
): Promise<string> => {
  const model = getModel();
  const prompt = pitchBuilderPrompt(input);
  const start = Date.now();

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    await saveSession(userId, "pitch_builder", prompt, text, Date.now() - start);
    return text;
  } catch (err) {
    throw ApiError.internal("AI pitch generation failed. Please try again.");
  }
};

// ─── 2. Career Analyzer ──────────────────────────────────────────────────
export const analyzeCareer = async (
  userId: string,
  input: CareerAnalyzerInput
): Promise<Record<string, unknown>> => {
  const model = getModel();
  const prompt = careerAnalyzerPrompt(input);
  const start = Date.now();

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Strip markdown code fences if Gemini wraps it
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    await saveSession(userId, "career_analyzer", prompt, text, Date.now() - start);
    return parsed;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw ApiError.internal("AI returned malformed data. Please try again.");
    }
    throw ApiError.internal("Career analysis failed. Please try again.");
  }
};

// ─── 3. Smart Recommendations ────────────────────────────────────────────
export const getRecommendations = async (
  userId: string,
  input: RecommendationInput
): Promise<Record<string, unknown>> => {
  const model = getModel();
  const prompt = recommendationPrompt(input);
  const start = Date.now();

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    await saveSession(userId, "recommendations", prompt, text, Date.now() - start);
    return parsed;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw ApiError.internal("AI returned malformed data. Please try again.");
    }
    throw ApiError.internal("Recommendations failed. Please try again.");
  }
};

// ─── 4. Chat Coach ───────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}

export const chat = async (
  userId: string,
  userContext: Parameters<typeof chatSystemPrompt>[0],
  history: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const model = getModel();
  const systemPrompt = chatSystemPrompt(userContext);
  const start = Date.now();

  try {
    // Gemini uses chat sessions with history
    const chatSession = model.startChat({
      history: [
        // Inject system context as the first turn
        {
          role: "user",
          parts: [{ text: "Please acknowledge your role and be ready to help." }],
        },
        {
          role: "model",
          parts: [{ text: systemPrompt }],
        },
        // Then the actual conversation history
        ...history.slice(-10), // last 10 messages to stay within token limits
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
  } catch (err) {
    throw ApiError.internal("Chat failed. Please try again.");
  }
};

// ─── Analytics: get AI usage stats for a user ────────────────────────────
export const getAIUsageStats = async (userId: string) => {
  const stats = await AISession.aggregate([
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

  const total = await AISession.countDocuments({ user: userId });

  return { breakdown: stats, total };
};