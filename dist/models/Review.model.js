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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Gig_model_1 = __importDefault(require("./Gig.model"));
const reviewSchema = new mongoose_1.Schema({
    gig: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Gig",
        required: true,
        index: true,
    },
    reviewer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    freelancer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
    },
    title: {
        type: String,
        required: [true, "Review title is required"],
        trim: true,
        maxlength: [100, "Review title cannot exceed 100 characters"],
    },
    comment: {
        type: String,
        required: [true, "Review comment is required"],
        maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpful: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
reviewSchema.index({ gig: 1, reviewer: 1 }, { unique: true });
reviewSchema.post("save", async function (doc) {
    if (doc) {
        await updateGigRating(doc.gig);
    }
});
reviewSchema.post("deleteOne", { document: true, query: false }, async function (doc) {
    if (doc) {
        await updateGigRating(doc.gig);
    }
});
async function updateGigRating(gigId) {
    const Review = mongoose_1.default.model("Review");
    const stats = await Review.aggregate([
        { $match: { gig: gigId } },
        {
            $group: {
                _id: "$gig",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 },
            },
        },
    ]);
    if (stats.length > 0) {
        await Gig_model_1.default.findByIdAndUpdate(gigId, {
            averageRating: Math.round(stats[0].avgRating * 10) / 10,
            totalReviews: stats[0].count,
        });
    }
    else {
        await Gig_model_1.default.findByIdAndUpdate(gigId, {
            averageRating: 0,
            totalReviews: 0,
        });
    }
}
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
//# sourceMappingURL=Review.model.js.map