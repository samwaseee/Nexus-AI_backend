import { Request, Response, NextFunction } from "express";
type Role = "freelancer" | "client" | "admin";
export declare const requireRole: (...allowedRoles: Role[]) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireFreelancer: (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireClient: (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireAdminOrFreelancer: (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=role.middleware.d.ts.map