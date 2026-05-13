import { z } from "zod";
export declare const createGigSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    shortDescription: z.ZodString;
    category: z.ZodString;
    subcategory: z.ZodOptional<z.ZodString>;
    tags: z.ZodArray<z.ZodString, "many">;
    skills: z.ZodArray<z.ZodString, "many">;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    startingPrice: z.ZodNumber;
    packages: z.ZodObject<{
        basic: z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            price: z.ZodNumber;
            deliveryDays: z.ZodNumber;
            revisions: z.ZodDefault<z.ZodNumber>;
            features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        }, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        }>;
        standard: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            price: z.ZodNumber;
            deliveryDays: z.ZodNumber;
            revisions: z.ZodDefault<z.ZodNumber>;
            features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        }, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        }>>;
        premium: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            price: z.ZodNumber;
            deliveryDays: z.ZodNumber;
            revisions: z.ZodDefault<z.ZodNumber>;
            features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        }, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        basic: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        };
        standard?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        } | undefined;
        premium?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        } | undefined;
    }, {
        basic: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        };
        standard?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        } | undefined;
        premium?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        } | undefined;
    }>;
    experienceLevel: z.ZodDefault<z.ZodEnum<["entry", "intermediate", "expert"]>>;
    deliveryTime: z.ZodDefault<z.ZodEnum<["1_day", "3_days", "1_week", "2_weeks", "1_month"]>>;
    revisions: z.ZodDefault<z.ZodNumber>;
    isRemote: z.ZodDefault<z.ZodBoolean>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skills: string[];
    description: string;
    revisions: number;
    title: string;
    shortDescription: string;
    category: string;
    tags: string[];
    images: string[];
    startingPrice: number;
    packages: {
        basic: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        };
        standard?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        } | undefined;
        premium?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        } | undefined;
    };
    experienceLevel: "entry" | "intermediate" | "expert";
    deliveryTime: "1_day" | "3_days" | "1_week" | "2_weeks" | "1_month";
    isRemote: boolean;
    location?: string | undefined;
    subcategory?: string | undefined;
}, {
    skills: string[];
    description: string;
    title: string;
    shortDescription: string;
    category: string;
    tags: string[];
    startingPrice: number;
    packages: {
        basic: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        };
        standard?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        } | undefined;
        premium?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        } | undefined;
    };
    location?: string | undefined;
    revisions?: number | undefined;
    subcategory?: string | undefined;
    images?: string[] | undefined;
    experienceLevel?: "entry" | "intermediate" | "expert" | undefined;
    deliveryTime?: "1_day" | "3_days" | "1_week" | "2_weeks" | "1_month" | undefined;
    isRemote?: boolean | undefined;
}>;
export declare const updateGigSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    shortDescription: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    subcategory: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    images: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    startingPrice: z.ZodOptional<z.ZodNumber>;
    packages: z.ZodOptional<z.ZodObject<{
        basic: z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            price: z.ZodNumber;
            deliveryDays: z.ZodNumber;
            revisions: z.ZodDefault<z.ZodNumber>;
            features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        }, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        }>;
        standard: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            price: z.ZodNumber;
            deliveryDays: z.ZodNumber;
            revisions: z.ZodDefault<z.ZodNumber>;
            features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        }, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        }>>;
        premium: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            price: z.ZodNumber;
            deliveryDays: z.ZodNumber;
            revisions: z.ZodDefault<z.ZodNumber>;
            features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        }, {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        basic: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        };
        standard?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        } | undefined;
        premium?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        } | undefined;
    }, {
        basic: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        };
        standard?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        } | undefined;
        premium?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        } | undefined;
    }>>;
    experienceLevel: z.ZodOptional<z.ZodDefault<z.ZodEnum<["entry", "intermediate", "expert"]>>>;
    deliveryTime: z.ZodOptional<z.ZodDefault<z.ZodEnum<["1_day", "3_days", "1_week", "2_weeks", "1_month"]>>>;
    revisions: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isRemote: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    location?: string | undefined;
    skills?: string[] | undefined;
    description?: string | undefined;
    revisions?: number | undefined;
    title?: string | undefined;
    shortDescription?: string | undefined;
    category?: string | undefined;
    subcategory?: string | undefined;
    tags?: string[] | undefined;
    images?: string[] | undefined;
    startingPrice?: number | undefined;
    packages?: {
        basic: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        };
        standard?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        } | undefined;
        premium?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions: number;
            features: string[];
        } | undefined;
    } | undefined;
    experienceLevel?: "entry" | "intermediate" | "expert" | undefined;
    deliveryTime?: "1_day" | "3_days" | "1_week" | "2_weeks" | "1_month" | undefined;
    isRemote?: boolean | undefined;
}, {
    location?: string | undefined;
    skills?: string[] | undefined;
    description?: string | undefined;
    revisions?: number | undefined;
    title?: string | undefined;
    shortDescription?: string | undefined;
    category?: string | undefined;
    subcategory?: string | undefined;
    tags?: string[] | undefined;
    images?: string[] | undefined;
    startingPrice?: number | undefined;
    packages?: {
        basic: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        };
        standard?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        } | undefined;
        premium?: {
            name: string;
            description: string;
            price: number;
            deliveryDays: number;
            revisions?: number | undefined;
            features?: string[] | undefined;
        } | undefined;
    } | undefined;
    experienceLevel?: "entry" | "intermediate" | "expert" | undefined;
    deliveryTime?: "1_day" | "3_days" | "1_week" | "2_weeks" | "1_month" | undefined;
    isRemote?: boolean | undefined;
}>;
export declare const gigQuerySchema: z.ZodObject<{
    page: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, z.ZodDefault<z.ZodNumber>>;
    limit: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, z.ZodDefault<z.ZodNumber>>;
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>>;
    maxPrice: z.ZodOptional<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>>;
    rating: z.ZodOptional<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>>;
    experienceLevel: z.ZodOptional<z.ZodEnum<["entry", "intermediate", "expert"]>>;
    deliveryTime: z.ZodOptional<z.ZodEnum<["1_day", "3_days", "1_week", "2_weeks", "1_month"]>>;
    sortBy: z.ZodDefault<z.ZodEnum<["newest", "oldest", "price_asc", "price_desc", "rating", "trending"]>>;
    skills: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sortBy: "newest" | "rating" | "oldest" | "price_asc" | "price_desc" | "trending";
    skills?: string | undefined;
    search?: string | undefined;
    category?: string | undefined;
    experienceLevel?: "entry" | "intermediate" | "expert" | undefined;
    deliveryTime?: "1_day" | "3_days" | "1_week" | "2_weeks" | "1_month" | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    rating?: number | undefined;
}, {
    skills?: string | undefined;
    search?: string | undefined;
    limit?: string | undefined;
    category?: string | undefined;
    experienceLevel?: "entry" | "intermediate" | "expert" | undefined;
    deliveryTime?: "1_day" | "3_days" | "1_week" | "2_weeks" | "1_month" | undefined;
    page?: string | undefined;
    minPrice?: string | undefined;
    maxPrice?: string | undefined;
    rating?: string | undefined;
    sortBy?: "newest" | "rating" | "oldest" | "price_asc" | "price_desc" | "trending" | undefined;
}>;
export type CreateGigInput = z.infer<typeof createGigSchema>;
export type GigQueryInput = z.infer<typeof gigQuerySchema>;
//# sourceMappingURL=gig.validation.d.ts.map