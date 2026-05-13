"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const User_model_1 = __importDefault(require("../models/User.model"));
if (env_1.env.GOOGLE_CLIENT_ID && env_1.env.GOOGLE_CLIENT_SECRET) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: env_1.env.GOOGLE_CLIENT_ID,
        clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
        callbackURL: env_1.env.GOOGLE_CALLBACK_URL,
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
                return done(new Error("No email from Google profile"));
            }
            let user = await User_model_1.default.findOne({ googleId: profile.id });
            if (!user) {
                user = await User_model_1.default.findOne({ email });
                if (user) {
                    user.googleId = profile.id;
                    user.provider = "google";
                    user.isVerified = true;
                    if (!user.avatar && profile.photos?.[0]?.value) {
                        user.avatar = profile.photos[0].value;
                    }
                    await user.save();
                }
                else {
                    user = await User_model_1.default.create({
                        name: profile.displayName,
                        email,
                        googleId: profile.id,
                        provider: "google",
                        avatar: profile.photos?.[0]?.value ?? "",
                        isVerified: true,
                        role: "freelancer",
                    });
                }
            }
            const passportUser = {
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            };
            return done(null, passportUser);
        }
        catch (error) {
            return done(error);
        }
    }));
}
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map