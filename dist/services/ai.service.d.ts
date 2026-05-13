import { chatSystemPrompt, PitchBuilderInput, CareerAnalyzerInput, RecommendationInput } from "../utils/promptTemplates";
export declare const generatePitch: (userId: string, input: PitchBuilderInput) => Promise<string>;
export declare const analyzeCareer: (userId: string, input: CareerAnalyzerInput) => Promise<Record<string, unknown>>;
export declare const getRecommendations: (userId: string, input: RecommendationInput) => Promise<Record<string, unknown>>;
interface ChatMessage {
    role: "user" | "model";
    parts: [{
        text: string;
    }];
}
export declare const chat: (userId: string, userContext: Parameters<typeof chatSystemPrompt>[0], history: ChatMessage[], userMessage: string) => Promise<string>;
export declare const getAIUsageStats: (userId: string) => Promise<{
    breakdown: any[];
    total: number;
}>;
export {};
//# sourceMappingURL=ai.service.d.ts.map