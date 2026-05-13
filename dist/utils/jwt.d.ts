import { JwtPayload } from "jsonwebtoken";
export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}
export interface DecodedToken extends JwtPayload, TokenPayload {
}
export declare const signAccessToken: (payload: TokenPayload) => string;
export declare const signRefreshToken: (payload: TokenPayload) => string;
export declare const verifyAccessToken: (token: string) => DecodedToken;
export declare const verifyRefreshToken: (token: string) => DecodedToken;
export declare const generateTokenPair: (payload: TokenPayload) => {
    accessToken: string;
    refreshToken: string;
};
//# sourceMappingURL=jwt.d.ts.map