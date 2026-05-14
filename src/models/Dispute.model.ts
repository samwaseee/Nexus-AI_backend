import mongoose, { Schema, Document } from "mongoose";

export interface IDispute extends Document {
  orderId: string; 
  client: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  reason: string;
  amount: number;
  status: "open" | "resolved_client" | "resolved_freelancer";
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    freelancer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["open", "resolved_client", "resolved_freelancer"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDispute>("Dispute", DisputeSchema);