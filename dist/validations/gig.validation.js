"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gigQuerySchema = exports.updateGigSchema = exports.createGigSchema = void 0;
const zod_1 = require("zod");
const packageSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    price: zod_1.z.number().min(5),
    deliveryDays: zod_1.z.number().min(1),
    revisions: zod_1.z.number().min(0).default(1),
    features: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.createGigSchema = zod_1.z.object({
    title: zod_1.z.string().min(10, "Title must be at least 10 characters").max(120),
    description: zod_1.z.string().min(50, "Description must be at least 50 characters").max(5000),
    shortDescription: zod_1.z.string().min(20).max(200),
    category: zod_1.z.string().min(1, "Category is required"),
    subcategory: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).max(10, "Max 10 tags"),
    skills: zod_1.z.array(zod_1.z.string()).max(15),
    images: zod_1.z.array(zod_1.z.string()).max(5).default([]),
    startingPrice: zod_1.z.number().min(5),
    packages: zod_1.z.object({
        basic: packageSchema,
        standard: packageSchema.optional(),
        premium: packageSchema.optional(),
    }),
    experienceLevel: zod_1.z.enum(["entry", "intermediate", "expert"]).default("intermediate"),
    deliveryTime: zod_1.z.enum(["1_day", "3_days", "1_week", "2_weeks", "1_month"]).default("1_week"),
    revisions: zod_1.z.number().min(0).default(1),
    isRemote: zod_1.z.boolean().default(true),
    location: zod_1.z.string().optional(),
});
exports.updateGigSchema = exports.createGigSchema.partial();
exports.gigQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(Number).pipe(zod_1.z.number().min(1).default(1)),
    limit: zod_1.z.string().optional().transform(Number).pipe(zod_1.z.number().min(1).max(50).default(12)),
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    minPrice: zod_1.z.string().optional().transform(Number).optional(),
    maxPrice: zod_1.z.string().optional().transform(Number).optional(),
    rating: zod_1.z.string().optional().transform(Number).optional(),
    experienceLevel: zod_1.z.enum(["entry", "intermediate", "expert"]).optional(),
    deliveryTime: zod_1.z.enum(["1_day", "3_days", "1_week", "2_weeks", "1_month"]).optional(),
    sortBy: zod_1.z.enum(["newest", "oldest", "price_asc", "price_desc", "rating", "trending"]).default("newest"),
    skills: zod_1.z.string().optional(),
});
//# sourceMappingURL=gig.validation.js.map