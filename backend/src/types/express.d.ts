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
      createdAt?: Date;
      updatedAt?: Date;
    };
    isAuthenticated?: () => boolean;
    logout?: (callback: (err: any) => void) => void;
  }
}

// Also augment express module for compatibility
declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      avatar?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    };
    isAuthenticated?: () => boolean;
    logout?: (callback: (err: any) => void) => void;
  }
}
