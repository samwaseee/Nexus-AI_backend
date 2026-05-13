export interface PitchBuilderInput {
    name: string;
    role: string;
    skills: string[];
    yearsOfExperience: number;
    tone: "professional" | "friendly" | "bold";
    targetAudience: string;
    keyAchievement?: string;
}
export interface CareerAnalyzerInput {
    skills: string[];
    currentRole: string;
    yearsOfExperience: number;
    targetRole?: string;
    location?: string;
}
export interface RecommendationInput {
    skills: string[];
    currentRole: string;
    interests: string[];
    recentActivity: string[];
}
export declare const pitchBuilderPrompt: (input: PitchBuilderInput) => string;
export declare const careerAnalyzerPrompt: (input: CareerAnalyzerInput) => string;
export declare const recommendationPrompt: (input: RecommendationInput) => string;
export declare const chatSystemPrompt: (userContext: {
    name: string;
    role: string;
    skills: string[];
    headline?: string;
    yearsOfExperience?: number;
}) => string;
//# sourceMappingURL=promptTemplates.d.ts.map