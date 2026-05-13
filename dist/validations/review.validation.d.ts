import { z } from "zod";
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    title: z.ZodString;
    comment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    comment: string;
    title: string;
    rating: number;
}, {
    comment: string;
    title: string;
    rating: number;
}>;
export declare const updateReviewSchema: z.ZodObject<{
    rating: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    comment?: string | undefined;
    title?: string | undefined;
    rating?: number | undefined;
}, {
    comment?: string | undefined;
    title?: string | undefined;
    rating?: number | undefined;
}>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
//# sourceMappingURL=review.validation.d.ts.map