import { IUser } from "../models/User.model";
import { RegisterInput, LoginInput } from "../validations/auth.validation";
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        user: Partial<IUser>;
        accessToken: string;
        refreshToken: string;
    }>;
    login(data: LoginInput): Promise<{
        user: Partial<IUser>;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    handleOAuthUser(oauthUser: IUser): Promise<{
        user: Partial<IUser>;
        accessToken: string;
        refreshToken: string;
    }>;
    setTokenCookies(res: import("express").Response, accessToken: string, refreshToken: string): void;
    clearTokenCookies(res: import("express").Response): void;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map