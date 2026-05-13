import { IGig } from "../models/Gig.model";
import { PaginationMeta } from "../utils/ApiResponse";
import { CreateGigInput, GigQueryInput } from "../validations/gig.validation";
export declare class GigService {
    createGig(freelancerId: string, data: CreateGigInput): Promise<IGig>;
    getGigs(query: GigQueryInput): Promise<{
        gigs: IGig[];
        meta: PaginationMeta;
    }>;
    getGigById(id: string): Promise<IGig>;
    getGigBySlug(slug: string): Promise<IGig>;
    updateGig(id: string, freelancerId: string, data: Partial<CreateGigInput>): Promise<IGig>;
    deleteGig(id: string, freelancerId: string, role: string): Promise<void>;
    getRelatedGigs(gigId: string, category: string, limit?: number): Promise<IGig[]>;
    getMyGigs(freelancerId: string, query: Partial<GigQueryInput>): Promise<{
        gigs: IGig[];
        meta: PaginationMeta;
    }>;
}
export declare const gigService: GigService;
//# sourceMappingURL=gig.service.d.ts.map