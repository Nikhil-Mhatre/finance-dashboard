// src/routes/auth.ts - FIXED VERSION
import { Router } from "express";
import passport from "passport";

const router: Router = Router();

/**
 * Initiate Google OAuth flow
 * @route GET /auth/google
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * Google OAuth callback
 * @route GET /auth/google/callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login?error=oauth_failed",
  }),
  (req, res) => {
    // Successful authentication
    console.log(`✅ OAuth login successful for: ${req.user?.email}`);
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  }
);

/**
 * Get current authenticated user
 * @route GET /auth/me
 */
router.get("/me", (req, res) => {
  // Safe check for isAuthenticated method
  const isAuthenticated = req.isAuthenticated?.() ?? false;

  if (!isAuthenticated) {
    return res.status(401).json({
      status: "error",
      message: "Not authenticated",
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    status: "success",
    data: {
      user: req.user,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Logout user
 * @route POST /auth/logout
 */
router.post("/logout", (req, res) => {
  // Safe check for logout method
  if (!req.logout) {
    return res.status(500).json({
      status: "error",
      message: "Logout method not available",
      timestamp: new Date().toISOString(),
    });
  }

  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Logout failed",
        timestamp: new Date().toISOString(),
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Session destruction error:", err);
      }
      res.clearCookie("finance.sid");
      res.json({
        status: "success",
        message: "Logout successful",
        timestamp: new Date().toISOString(),
      });
    });
  });
});

/**
 * Check authentication status
 * @route GET /auth/status
 */
router.get("/status", (req, res) => {
  const isAuthenticated = req.isAuthenticated?.() ?? false;

  res.json({
    status: "success",
    data: {
      isAuthenticated,
      user: isAuthenticated ? req.user : null,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
