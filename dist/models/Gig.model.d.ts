import mongoose, { Document } from "mongoose";
export type GigStatus = "active" | "paused" | "draft" | "archived";
export type ExperienceLevel = "entry" | "intermediate" | "expert";
export type DeliveryTime = "1_day" | "3_days" | "1_week" | "2_weeks" | "1_month";
export interface IGig extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    category: string;
    subcategory?: string;
    tags: string[];
    skills: string[];
    freelancer: mongoose.Types.ObjectId;
    images: string[];
    startingPrice: number;
    packages: {
        basic: GigPackage;
        standard?: GigPackage;
        premium?: GigPackage;
    };
    experienceLevel: ExperienceLevel;
    deliveryTime: DeliveryTime;
    revisions: number;
    status: GigStatus;
    isRemote: boolean;
    location?: string;
    views: number;
    averageRating: number;
    totalReviews: number;
    totalOrders: number;
    aiDemandScore?: number;
    trendingScore?: number;
    createdAt: Date;
    updatedAt: Date;
}
interface GigPackage {
    name: string;
    description: string;
    price: number;
    deliveryDays: number;
    revisions: number;
    features: string[];
}
declare const Gig: mongoose.Model<IGig, {}, {}, {}, mongoose.Document<unknown, {}, IGig, {}, {}> & IGig & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Gig;
//# sourceMappingURL=Gig.model.d.ts.map