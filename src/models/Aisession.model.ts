import mongoose, { Document, Schema } from "mongoose";

export type AIFeatureType =
  | "pitch_builder"
  | "career_analyzer"
  | "recommendations"
  | "chat";

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

const aiSessionSchema = new Schema<IAISession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    feature: {
      type: String,
      enum: ["pitch_builder", "career_analyzer", "recommendations", "chat"],
      required: true,
    },
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    durationMs: { type: Number, default: 0 },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

aiSessionSchema.index({ user: 1, feature: 1 });
aiSessionSchema.index({ createdAt: -1 });

const AISession = mongoose.model<IAISession>("AISession", aiSessionSchema);
export default AISession;