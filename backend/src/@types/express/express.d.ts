// src/@types/express/index.d.ts
import "express-serve-static-core";

declare global {
  namespace Express {
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

    interface User {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      avatar?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
}

// For module augmentation
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

export {};
