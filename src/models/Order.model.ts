import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  gig: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  status: "pending" | "in_progress" | "completed" | "cancelled" | "in_dispute";
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    gig: { type: Schema.Types.ObjectId, ref: "Gig", required: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    freelancer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled", "in_dispute"],
      default: "pending",
    },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);