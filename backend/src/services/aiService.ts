/**
 * AI Service - Gemini Integration
 * Handles AI-powered financial insights and recommendations
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Initialize Gemini AI client
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Financial insight types
 */
export interface FinancialInsight {
  id: string;
  title: string;
  content: string;
  type:
    | "SPENDING_PATTERN"
    | "BUDGET_RECOMMENDATION"
    | "INVESTMENT_ADVICE"
    | "SAVING_OPPORTUNITY"
    | "RISK_ASSESSMENT"
    | "MARKET_ANALYSIS";
  confidence: number;
  isRelevant: boolean;
  createdAt: Date;
}

/**
 * Generate AI-powered financial insights for a user
 *
 * @param {string} userId - User ID to generate insights for
 * @returns {Promise<FinancialInsight[]>} Array of AI-generated insights
 */
export async function generateFinancialInsights(
  userId: string
): Promise<FinancialInsight[]> {
  try {
    console.log(`🤖 Generating AI insights for user: ${userId}`);

    // Check if Gemini API key is set
    const apiKey = process.env.GEMINI_API_KEY;
    console.log(
      `🔑 API Key exists: ${!!apiKey}, Length: ${apiKey?.length || 0}`
    );

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.log("❌ Invalid Gemini API key detected");
      return [
        {
          id: "api-key-missing",
          title: "AI Service Configuration Issue",
          content:
            "Gemini API key is not properly configured. Please check your environment variables and restart the server.",
          type: "SPENDING_PATTERN",
          confidence: 0.0,
          isRelevant: true,
          createdAt: new Date(),
        },
      ];
    }

    // Get user's financial data
    const financialData = await getUserFinancialData(userId);
    console.log(
      `📊 Financial data retrieved: ${financialData.transactions.length} transactions`
    );

    if (!financialData.transactions.length) {
      console.log("📝 No transactions found, returning welcome message");
      return [
        {
          id: "welcome-insight",
          title: "Welcome to AI Financial Insights! 🎉",
          content:
            "Start adding transactions to receive personalized AI-powered recommendations about your spending patterns, budgeting opportunities, and financial goals. Our AI will analyze your data to provide actionable insights for better financial health.",
          type: "SPENDING_PATTERN",
          confidence: 1.0,
          isRelevant: true,
          createdAt: new Date(),
        },
      ];
    }

    // Prepare data for AI analysis
    const prompt = createFinancialAnalysisPrompt(financialData);
    console.log(`📝 Generated prompt length: ${prompt.length} characters`);

    // Get AI model
    console.log("🤖 Initializing Gemini model...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate insights
    console.log("🧠 Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    console.log(
      `✅ Received AI response length: ${aiResponse.length} characters`
    );
    console.log(`🔍 AI Response preview: ${aiResponse.substring(0, 200)}...`);

    // Parse and structure AI response
    const insights = parseAIResponse(aiResponse, userId);
    console.log(`🎯 Parsed ${insights.length} insights`);

    // Save insights to database
    await saveInsightsToDatabase(insights, userId);

    console.log(`✅ Generated ${insights.length} AI insights successfully`);
    return insights;
  } catch (error) {
    console.error("❌ AI insight generation error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return fallback insights if AI fails
    return [
      {
        id: "fallback-insight",
        title: "AI Analysis Temporarily Unavailable",
        content:
          "Our AI analysis service encountered an error. Please check the server logs and try again in a few minutes.",
        type: "SPENDING_PATTERN",
        confidence: 0.5,
        isRelevant: true,
        createdAt: new Date(),
      },
    ];
  }
}

/**
 * Get comprehensive financial data for a user
 *
 * @param {string} userId - User ID
 * @returns {Promise<object>} User's financial data
 */
async function getUserFinancialData(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  try {
    // Get user data
    const [user, accounts, transactions, budgets] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, email: true },
      }),
      prisma.account.findMany({
        where: { userId, isActive: true },
      }),
      prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: threeMonthsAgo },
        },
        orderBy: { date: "desc" },
      }),
      prisma.budget.findMany({
        where: { userId, isActive: true },
      }),
    ]);

    console.log(`📊 Raw transactions fetched: ${transactions.length}`);

    // Calculate summary statistics
    const totalBalance = accounts.reduce(
      (sum, acc) => sum + parseFloat(acc.balance.toString()),
      0
    );

    const monthlyTransactions = transactions.filter(
      (t) => t.date >= startOfMonth
    );
    const monthlyIncome = monthlyTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0);

    // Category breakdown - FIX THE BUG HERE
    const categoryBreakdown = transactions
      .filter((t) => t.type === "EXPENSE" && t.category) // Add category check
      .reduce((acc, t) => {
        const category = t.category;
        const amount = Math.abs(parseFloat(t.amount.toString()));
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {} as Record<string, number>);

    console.log(`📈 Category breakdown calculated:`, categoryBreakdown);

    const summary = {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      monthlyNet: monthlyIncome - monthlyExpenses,
      categoryBreakdown,
    };

    return {
      user,
      accounts,
      transactions,
      budgets,
      summary,
      categoryBreakdown, // Include both in summary and as top-level
    };
  } catch (error) {
    console.error("❌ Error fetching financial data:", error);

    // Return safe defaults
    return {
      user: null,
      accounts: [],
      transactions: [],
      budgets: [],
      summary: {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        monthlyNet: 0,
        categoryBreakdown: {},
      },
      categoryBreakdown: {},
    };
  }
}

/**
 * Create a comprehensive prompt for AI financial analysis
 *
 * @param {object} financialData - User's financial data
 * @returns {string} Formatted prompt for AI
 */
/**
 * Create a comprehensive prompt for AI financial analysis - FIXED
 *
 * @param {object} financialData - User's financial data
 * @returns {string} Formatted prompt for AI
 */
function createFinancialAnalysisPrompt(financialData: any): string {
  const { user, summary, categoryBreakdown, transactions } = financialData;

  // Add defensive checks for all data
  const safeUser = user || {};
  const safeSummary = summary || {};
  const safeCategoryBreakdown =
    categoryBreakdown || safeSummary.categoryBreakdown || {};
  const safeTransactions = transactions || [];

  console.log("🔍 Debug - categoryBreakdown:", safeCategoryBreakdown);
  console.log("🔍 Debug - summary:", safeSummary);

  return `
Act as a personal finance advisor and analyze the following financial data for ${
    safeUser?.firstName || "the user"
  }:

FINANCIAL SUMMARY:
- Total Balance: $${(safeSummary.totalBalance || 0).toFixed(2)}
- Monthly Income: $${(safeSummary.monthlyIncome || 0).toFixed(2)}
- Monthly Expenses: $${(safeSummary.monthlyExpenses || 0).toFixed(2)}
- Monthly Net: $${(safeSummary.monthlyNet || 0).toFixed(2)}

SPENDING BY CATEGORY (Last 3 months):
${
  Object.keys(safeCategoryBreakdown).length > 0
    ? Object.entries(safeCategoryBreakdown)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 8)
        .map(
          ([category, amount]) =>
            `- ${category.replace(/_/g, " ")}: $${(amount as number).toFixed(
              2
            )}`
        )
        .join("\n")
    : "- No category data available yet"
}

RECENT TRANSACTION PATTERNS:
${
  safeTransactions.length > 0
    ? safeTransactions
        .slice(0, 10)
        .map(
          (t: any) =>
            `- ${new Date(t.date).toISOString().split("T")[0]}: ${
              t.description
            } - $${Math.abs(parseFloat(t.amount.toString())).toFixed(2)} (${(
              t.category || "UNCATEGORIZED"
            ).replace(/_/g, " ")})`
        )
        .join("\n")
    : "- No recent transactions available"
}

Please provide 3-5 specific, actionable financial insights in JSON format. Each insight should include:
- title: Engaging, specific title (max 60 characters)
- content: Detailed actionable advice (100-200 words)
- type: One of [SPENDING_PATTERN, BUDGET_RECOMMENDATION, SAVING_OPPORTUNITY, RISK_ASSESSMENT]
- confidence: Number between 0.0-1.0

Focus on:
1. Spending pattern analysis with specific recommendations
2. Budget optimization opportunities
3. Saving potential identification
4. Risk assessment for current financial habits
5. Actionable next steps

Respond ONLY with valid JSON array format:
[{"title": "...", "content": "...", "type": "...", "confidence": 0.85}, ...]
`;
}

/**
 * Parse AI response and create structured insights
 *
 * @param {string} aiResponse - Raw AI response
 * @param {string} userId - User ID
 * @returns {FinancialInsight[]} Parsed insights
 */
function parseAIResponse(
  aiResponse: string,
  userId: string
): FinancialInsight[] {
  try {
    // Clean the response and extract JSON
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const parsedInsights = JSON.parse(jsonMatch[0]);

    return parsedInsights.map((insight: any, index: number) => ({
      id: `ai-insight-${Date.now()}-${index}`,
      title: insight.title || "Financial Insight",
      content: insight.content || "No content provided",
      type: insight.type || "SPENDING_PATTERN",
      confidence: Math.min(Math.max(insight.confidence || 0.7, 0), 1),
      isRelevant: true,
      createdAt: new Date(),
    }));
  } catch (error) {
    console.error("❌ Error parsing AI response:", error);

    // Return fallback insights
    return [
      {
        id: `fallback-${Date.now()}`,
        title: "📊 Spending Analysis Available",
        content:
          "Based on your transaction history, we can see regular spending patterns. Consider reviewing your monthly expenses and identifying areas where you might reduce unnecessary spending. Track your progress by setting specific spending limits for different categories.",
        type: "SPENDING_PATTERN",
        confidence: 0.8,
        isRelevant: true,
        createdAt: new Date(),
      },
    ];
  }
}

/**
 * Save AI-generated insights to database
 *
 * @param {FinancialInsight[]} insights - Insights to save
 * @param {string} userId - User ID
 */
async function saveInsightsToDatabase(
  insights: FinancialInsight[],
  userId: string
): Promise<void> {
  try {
    // Delete old insights (keep only recent ones)
    await prisma.aIInsight.deleteMany({
      where: {
        userId,
        createdAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Older than 7 days
        },
      },
    });

    // Save new insights
    const insightData = insights.map((insight) => ({
      id: insight.id,
      userId,
      title: insight.title,
      content: insight.content,
      type: insight.type,
      confidence: insight.confidence,
      isRelevant: insight.isRelevant,
    }));

    await prisma.aIInsight.createMany({
      data: insightData,
    });

    console.log(`💾 Saved ${insights.length} insights to database`);
  } catch (error) {
    console.error("❌ Error saving insights to database:", error);
  }
}

/**
 * Get saved insights for a user
 *
 * @param {string} userId - User ID
 * @returns {Promise<FinancialInsight[]>} Saved insights
 */
export async function getUserInsights(
  userId: string
): Promise<FinancialInsight[]> {
  try {
    const insights = await prisma.aIInsight.findMany({
      where: {
        userId,
        isRelevant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return insights.map((insight) => ({
      id: insight.id,
      title: insight.title,
      content: insight.content,
      type: insight.type as any,
      confidence: insight.confidence,
      isRelevant: insight.isRelevant,
      createdAt: insight.createdAt,
    }));
  } catch (error) {
    console.error("❌ Error fetching user insights:", error);
    return [];
  }
}
