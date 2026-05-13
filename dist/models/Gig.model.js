"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const gigPackageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 5 },
    deliveryDays: { type: Number, required: true, min: 1 },
    revisions: { type: Number, default: 1 },
    features: [{ type: String }],
});
const gigSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [120, "Title cannot exceed 120 characters"],
    },
    slug: { type: String, unique: true, lowercase: true },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    shortDescription: {
        type: String,
        required: [true, "Short description is required"],
        maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    category: { type: String, required: [true, "Category is required"], index: true },
    subcategory: { type: String },
    tags: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    freelancer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    images: [{ type: String }],
    startingPrice: { type: Number, required: true, min: 5 },
    packages: {
        basic: { type: gigPackageSchema, required: true },
        standard: { type: gigPackageSchema },
        premium: { type: gigPackageSchema },
    },
    experienceLevel: {
        type: String,
        enum: ["entry", "intermediate", "expert"],
        default: "intermediate",
    },
    deliveryTime: {
        type: String,
        enum: ["1_day", "3_days", "1_week", "2_weeks", "1_month"],
        default: "1_week",
    },
    revisions: { type: Number, default: 1 },
    status: {
        type: String,
        enum: ["active", "paused", "draft", "archived"],
        default: "active",
        index: true,
    },
    isRemote: { type: Boolean, default: true },
    location: { type: String },
    views: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    aiDemandScore: { type: Number, min: 0, max: 100 },
    trendingScore: { type: Number, min: 0, max: 100 },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
gigSchema.index({ title: "text", description: "text", tags: "text" });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ startingPrice: 1 });
gigSchema.index({ averageRating: -1 });
gigSchema.index({ createdAt: -1 });
gigSchema.index({ trendingScore: -1 });
const Gig = mongoose_1.default.model("Gig", gigSchema);
exports.default = Gig;
//# sourceMappingURL=Gig.model.js.map