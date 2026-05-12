import { z } from "zod";

const packageSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(5),
  deliveryDays: z.number().min(1),
  revisions: z.number().min(0).default(1),
  features: z.array(z.string()).default([]),
});

export const createGigSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(120),
  description: z.string().min(50, "Description must be at least 50 characters").max(5000),
  shortDescription: z.string().min(20).max(200),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).max(10, "Max 10 tags"),
  skills: z.array(z.string()).max(15),
  images: z.array(z.string()).max(5).default([]),
  startingPrice: z.number().min(5),
  packages: z.object({
    basic: packageSchema,
    standard: packageSchema.optional(),
    premium: packageSchema.optional(),
  }),
  experienceLevel: z.enum(["entry", "intermediate", "expert"]).default("intermediate"),
  deliveryTime: z.enum(["1_day", "3_days", "1_week", "2_weeks", "1_month"]).default("1_week"),
  revisions: z.number().min(0).default(1),
  isRemote: z.boolean().default(true),
  location: z.string().optional(),
});

export const updateGigSchema = createGigSchema.partial();

export const gigQuerySchema = z.object({
  page: z.string().optional().transform(Number).pipe(z.number().min(1).default(1)),
  limit: z.string().optional().transform(Number).pipe(z.number().min(1).max(50).default(12)),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional().transform(Number).optional(),
  maxPrice: z.string().optional().transform(Number).optional(),
  rating: z.string().optional().transform(Number).optional(),
  experienceLevel: z.enum(["entry", "intermediate", "expert"]).optional(),
  deliveryTime: z.enum(["1_day", "3_days", "1_week", "2_weeks", "1_month"]).optional(),
  sortBy: z.enum(["newest", "oldest", "price_asc", "price_desc", "rating", "trending"]).default("newest"),
  skills: z.string().optional(),
});

export type CreateGigInput = z.infer<typeof createGigSchema>;
export type GigQueryInput = z.infer<typeof gigQuerySchema>;