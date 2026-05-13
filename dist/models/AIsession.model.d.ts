import mongoose, { Document } from "mongoose";
export type AIFeatureType = "pitch_builder" | "career_analyzer" | "recommendations" | "chat";
export interface IAISession extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    feature: AIFeatureType;
    inputTokens: number;
    outputTokens: number;
    durationMs: number;
    prompt: string;
    response: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
declare const AISession: mongoose.Model<IAISession, {}, {}, {}, mongoose.Document<unknown, {}, IAISession, {}, {}> & IAISession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default AISession;
//# sourceMappingURL=AIsession.model.d.ts.map