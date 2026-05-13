import mongoose from "mongoose";
import { IUser } from "../models/User.model";
export interface TalentQueryInput {
    page?: string;
    limit?: string;
    search?: string;
    skills?: string;
    availability?: string;
    minRate?: string;
    maxRate?: string;
    sortBy?: string;
}
export declare class TalentService {
    getTalentList(query: TalentQueryInput): Promise<{
        users: (mongoose.FlattenMaps<IUser> & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: import("../utils/ApiResponse").PaginationMeta;
    }>;
    getTalentProfile(userId: string): Promise<mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTalentGigs(userId: string): Promise<(mongoose.FlattenMaps<import("../models/Gig.model").IGig> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
export declare const talentService: TalentService;
//# sourceMappingURL=talent.services.d.ts.map