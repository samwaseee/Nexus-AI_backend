import mongoose, { Document } from "mongoose";
export interface IBlogPost extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: mongoose.Types.ObjectId;
    category: string;
    tags: string[];
    status: "draft" | "published";
    readTime: number;
    views: number;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const BlogPost: mongoose.Model<IBlogPost, {}, {}, {}, mongoose.Document<unknown, {}, IBlogPost, {}, {}> & IBlogPost & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default BlogPost;
//# sourceMappingURL=BlogPost.model.d.ts.map