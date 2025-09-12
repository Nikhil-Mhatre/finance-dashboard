// src/config/oauth.ts
/**
 * OAuth Configuration
 * Google OAuth 2.0 setup and configuration
 */

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import passport from "passport";

const prisma = new PrismaClient();

/**
 * Google OAuth Strategy Configuration
 */
export function configureGoogleOAuth() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(`🔐 OAuth callback for: ${profile.emails?.[0]?.value}`);

          // Check if user already exists with Google ID
          let user = await prisma.user.findUnique({
            where: { googleId: profile.id },
          });

          if (user) {
            console.log(`✅ Existing OAuth user found: ${user.email}`);
            return done(null, user);
          }

          // Check if user exists with same email (link accounts)
          const existingEmailUser = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value },
          });

          if (existingEmailUser) {
            // Link Google account to existing user
            user = await prisma.user.update({
              where: { id: existingEmailUser.id },
              data: {
                googleId: profile.id,
                avatar: profile.photos?.[0]?.value,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
              },
            });
            console.log(
              `🔗 Linked Google account to existing user: ${user.email}`
            );
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                googleId: profile.id,
                email: profile.emails?.[0]?.value!,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                avatar: profile.photos?.[0]?.value,
              },
            });

            // Create default accounts for new user
            await prisma.account.createMany({
              data: [
                {
                  userId: user.id,
                  name: "Primary Checking",
                  type: "CHECKING",
                  balance: 0,
                  currency: "USD",
                },
                {
                  userId: user.id,
                  name: "Savings Account",
                  type: "SAVINGS",
                  balance: 0,
                  currency: "USD",
                },
              ],
            });

            console.log(`🆕 New OAuth user created: ${user.email}`);
          }

          return done(null, user);
        } catch (error) {
          console.error("❌ OAuth strategy error:", error);
          return done(error, undefined);
        }
      }
    )
  );

  // Session serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
