import mongoose, { Document } from "mongoose";
export interface IReview extends Document {
    _id: mongoose.Types.ObjectId;
    gig: mongoose.Types.ObjectId;
    reviewer: mongoose.Types.ObjectId;
    freelancer: mongoose.Types.ObjectId;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    helpful: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const Review: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview, {}, {}> & IReview & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Review;
//# sourceMappingURL=Review.model.d.ts.map