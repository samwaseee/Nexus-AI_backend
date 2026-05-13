import { Response } from "express";
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export declare class ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T | null;
    meta?: PaginationMeta;
    constructor(statusCode: number, message: string, data?: T | null, meta?: PaginationMeta);
}
export declare const sendSuccess: <T>(res: Response, data: T, message?: string, statusCode?: number, meta?: PaginationMeta) => Response;
export declare const sendCreated: <T>(res: Response, data: T, message?: string) => Response;
export declare const sendNoContent: (res: Response) => Response;
export declare const buildPaginationMeta: (page: number, limit: number, total: number) => PaginationMeta;
//# sourceMappingURL=ApiResponse.d.ts.map