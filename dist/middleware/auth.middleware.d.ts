import { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface User {
            userId: string;
            email: string;
            role: string;
        }
    }
}
export declare const verifyToken: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuth: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map