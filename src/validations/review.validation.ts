import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  comment: z.string().min(20, "Comment must be at least 20 characters").max(1000),
});

export const updateReviewSchema = createReviewSchema.partial();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;