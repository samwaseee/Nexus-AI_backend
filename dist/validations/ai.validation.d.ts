import { z } from "zod";
export declare const pitchBuilderSchema: z.ZodObject<{
    name: z.ZodString;
    role: z.ZodString;
    skills: z.ZodArray<z.ZodString, "many">;
    yearsOfExperience: z.ZodNumber;
    tone: z.ZodDefault<z.ZodEnum<["professional", "friendly", "bold"]>>;
    targetAudience: z.ZodString;
    keyAchievement: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    role: string;
    skills: string[];
    yearsOfExperience: number;
    tone: "bold" | "professional" | "friendly";
    targetAudience: string;
    keyAchievement?: string | undefined;
}, {
    name: string;
    role: string;
    skills: string[];
    yearsOfExperience: number;
    targetAudience: string;
    tone?: "bold" | "professional" | "friendly" | undefined;
    keyAchievement?: string | undefined;
}>;
export declare const careerAnalyzerSchema: z.ZodObject<{
    skills: z.ZodArray<z.ZodString, "many">;
    currentRole: z.ZodString;
    yearsOfExperience: z.ZodNumber;
    targetRole: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skills: string[];
    yearsOfExperience: number;
    currentRole: string;
    location?: string | undefined;
    targetRole?: string | undefined;
}, {
    skills: string[];
    yearsOfExperience: number;
    currentRole: string;
    location?: string | undefined;
    targetRole?: string | undefined;
}>;
export declare const recommendationSchema: z.ZodObject<{
    skills: z.ZodArray<z.ZodString, "many">;
    currentRole: z.ZodString;
    interests: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    recentActivity: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    skills: string[];
    currentRole: string;
    interests: string[];
    recentActivity: string[];
}, {
    skills: string[];
    currentRole: string;
    interests?: string[] | undefined;
    recentActivity?: string[] | undefined;
}>;
export declare const chatMessageSchema: z.ZodObject<{
    message: z.ZodString;
    conversationId: z.ZodOptional<z.ZodString>;
    history: z.ZodDefault<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "model"]>;
        parts: z.ZodArray<z.ZodObject<{
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            text: string;
        }, {
            text: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        role: "model" | "user";
        parts: {
            text: string;
        }[];
    }, {
        role: "model" | "user";
        parts: {
            text: string;
        }[];
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    message: string;
    history: {
        role: "model" | "user";
        parts: {
            text: string;
        }[];
    }[];
    conversationId?: string | undefined;
}, {
    message: string;
    history?: {
        role: "model" | "user";
        parts: {
            text: string;
        }[];
    }[] | undefined;
    conversationId?: string | undefined;
}>;
//# sourceMappingURL=ai.validation.d.ts.map