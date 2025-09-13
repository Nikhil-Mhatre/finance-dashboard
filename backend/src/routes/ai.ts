/**
 * AI Routes
 * Handles AI-generated financial insights and recommendations
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  generateFinancialInsights,
  getUserInsights,
} from "../services/aiService";

const router: Router = Router();

/**
 * Get AI-generated insights for user
 * @route GET /api/ai/insights
 * @header Authorization: Bearer {token}
 * @returns {Object} AI insights and recommendations
 */
router.get("/insights", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;

    // Get existing insights
    let insights = await getUserInsights(userId);

    // If no recent insights, generate new ones
    if (insights.length === 0) {
      console.log("🤖 No recent insights found, generating new ones...");
      insights = await generateFinancialInsights(userId);
    }

    console.log(
      `🧠 Retrieved ${insights.length} AI insights for user: ${req.user!.email}`
    );

    res.json({
      status: "success",
      data: insights,
      message: "AI insights retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Get insights error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve AI insights",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Generate new AI analysis
 * @route POST /api/ai/analyze
 * @header Authorization: Bearer {token}
 * @returns {Object} Newly generated AI insights
 */
router.post("/analyze", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;

    console.log("🤖 Generating fresh AI analysis...");
    const insights = await generateFinancialInsights(userId);

    console.log(
      `🧠 Generated ${insights.length} new AI insights for user: ${
        req.user!.email
      }`
    );

    res.json({
      status: "success",
      data: insights,
      message: "AI analysis completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Generate analysis error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate AI analysis",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Get AI insights summary for dashboard
 * @route GET /api/ai/summary
 * @header Authorization: Bearer {token}
 * @returns {Object} AI insights summary
 */
router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const insights = await getUserInsights(userId);

    // Create summary
    const summary = {
      totalInsights: insights.length,
      highConfidenceInsights: insights.filter((i) => i.confidence >= 0.8)
        .length,
      insightTypes: insights.reduce(
        (acc, insight) => {
          acc[insight.type] = (acc[insight.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      latestInsight: insights[0] || null,
      averageConfidence:
        insights.length > 0
          ? insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length
          : 0,
    };

    res.json({
      status: "success",
      data: summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Get insights summary error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve insights summary",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
