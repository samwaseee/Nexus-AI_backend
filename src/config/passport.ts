import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";
import User from "../models/User.model";

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email from Google profile"));
          }

          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              user.provider = "google";
              user.isVerified = true;
              if (!user.avatar && profile.photos?.[0]?.value) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            } else {
              user = await User.create({
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
            userId: user._id.toString(), // Convert ObjectId to string
            email: user.email,
            role: user.role,
          };

          return done(null, passportUser);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}

export default passport;
