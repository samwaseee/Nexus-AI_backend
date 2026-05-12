import mongoose, { Document, Schema } from "mongoose";
import Gig from "./Gig.model";

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

const reviewSchema = new Schema<IReview>(
  {
    gig: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true,
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
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
    helpful: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// ─── One review per user per gig ──────────────────────────────────────────
reviewSchema.index({ gig: 1, reviewer: 1 }, { unique: true });

// ─── Auto-update gig average rating after save ───────────────────────────
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

async function updateGigRating(gigId: mongoose.Types.ObjectId) {
  const Review = mongoose.model("Review");
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
    await Gig.findByIdAndUpdate(gigId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count,
    });
  } else {
    await Gig.findByIdAndUpdate(gigId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
}

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;