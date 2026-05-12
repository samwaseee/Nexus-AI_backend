import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  isActive: boolean;
  totalMessages: number;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationSchema = new Schema<IConversation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, default: "New conversation", maxlength: 100 },
    messages: {
      type: [messageSchema],
      default: [],
      validate: {
        validator: (arr: IMessage[]) => arr.length <= 200,
        message: "Conversation cannot exceed 200 messages",
      },
    },
    isActive: { type: Boolean, default: true },
    totalMessages: { type: Number, default: 0 },
  },
  { timestamps: true }
);

conversationSchema.index({ user: 1, createdAt: -1 });

conversationSchema.pre("save", function (next) {
  this.totalMessages = this.messages.length;
  next();
});

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
export default Conversation;