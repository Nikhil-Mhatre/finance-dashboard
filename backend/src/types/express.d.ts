// src/types/express.d.ts
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      avatar?: string | null;
    };
    // Passport injects isAuthenticated at runtime; add it for type safety
    isAuthenticated?: () => boolean;
  }
}
