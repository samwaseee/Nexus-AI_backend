import mongoose, { Document } from "mongoose";
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
declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, {}> & IConversation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Conversation;
//# sourceMappingURL=Conversation.model.d.ts.map