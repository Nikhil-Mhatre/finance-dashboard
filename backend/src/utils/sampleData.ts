/**
 * Sample Data Generator
 * Creates realistic sample transactions and accounts for new users
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Sample transaction templates
 */
const sampleTransactions = [
  // Income
  {
    description: "Salary Payment",
    amount: 5000,
    type: "INCOME",
    category: "SALARY",
  },
  {
    description: "Freelance Project",
    amount: 1200,
    type: "INCOME",
    category: "FREELANCE",
  },
  {
    description: "Investment Dividend",
    amount: 150,
    type: "INCOME",
    category: "DIVIDEND_INCOME",
  },

  // Expenses - Food & Dining
  {
    description: "Grocery Store",
    amount: -125,
    type: "EXPENSE",
    category: "FOOD_DINING",
  },
  {
    description: "Restaurant Dinner",
    amount: -68,
    type: "EXPENSE",
    category: "FOOD_DINING",
  },
  {
    description: "Coffee Shop",
    amount: -12,
    type: "EXPENSE",
    category: "FOOD_DINING",
  },
  {
    description: "Fast Food",
    amount: -18,
    type: "EXPENSE",
    category: "FOOD_DINING",
  },

  // Transportation
  {
    description: "Gas Station",
    amount: -55,
    type: "EXPENSE",
    category: "TRANSPORTATION",
  },
  {
    description: "Uber Ride",
    amount: -23,
    type: "EXPENSE",
    category: "TRANSPORTATION",
  },
  {
    description: "Parking Fee",
    amount: -8,
    type: "EXPENSE",
    category: "TRANSPORTATION",
  },

  // Bills & Utilities
  {
    description: "Electric Bill",
    amount: -120,
    type: "EXPENSE",
    category: "BILLS_UTILITIES",
  },
  {
    description: "Internet Service",
    amount: -65,
    type: "EXPENSE",
    category: "BILLS_UTILITIES",
  },
  {
    description: "Phone Bill",
    amount: -45,
    type: "EXPENSE",
    category: "BILLS_UTILITIES",
  },

  // Entertainment
  {
    description: "Netflix Subscription",
    amount: -15,
    type: "EXPENSE",
    category: "ENTERTAINMENT",
  },
  {
    description: "Movie Theater",
    amount: -32,
    type: "EXPENSE",
    category: "ENTERTAINMENT",
  },
  {
    description: "Spotify Premium",
    amount: -10,
    type: "EXPENSE",
    category: "ENTERTAINMENT",
  },

  // Shopping
  {
    description: "Amazon Purchase",
    amount: -87,
    type: "EXPENSE",
    category: "SHOPPING",
  },
  {
    description: "Clothing Store",
    amount: -145,
    type: "EXPENSE",
    category: "SHOPPING",
  },
  {
    description: "Home Depot",
    amount: -76,
    type: "EXPENSE",
    category: "SHOPPING",
  },

  // Healthcare
  {
    description: "Doctor Visit",
    amount: -200,
    type: "EXPENSE",
    category: "HEALTHCARE",
  },
  {
    description: "Pharmacy",
    amount: -35,
    type: "EXPENSE",
    category: "HEALTHCARE",
  },

  // Other
  {
    description: "Gym Membership",
    amount: -40,
    type: "EXPENSE",
    category: "PERSONAL_CARE",
  },
  {
    description: "Book Purchase",
    amount: -25,
    type: "EXPENSE",
    category: "EDUCATION",
  },
];

/**
 * Generate sample data for a user
 * Creates realistic transactions over the past 3 months
 *
 * @param {string} userId - User ID to create data for
 * @returns {Promise<void>}
 */
export async function generateSampleData(userId: string): Promise<void> {
  try {
    console.log(`🎲 Generating sample data for user: ${userId}`);

    // Get user's accounts
    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    if (accounts.length === 0) {
      console.log("❌ No accounts found for user");
      return;
    }

    const checkingAccount = accounts.find((acc) => acc.type === "CHECKING");
    const savingsAccount = accounts.find((acc) => acc.type === "SAVINGS");

    if (!checkingAccount) {
      console.log("❌ No checking account found");
      return;
    }

    // Generate transactions for the past 3 months
    const transactions = [];
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    // Generate 50-80 transactions
    const transactionCount = Math.floor(Math.random() * 30) + 50;

    for (let i = 0; i < transactionCount; i++) {
      // Random date within the past 3 months
      const randomDate = new Date(
        threeMonthsAgo.getTime() +
          Math.random() * (now.getTime() - threeMonthsAgo.getTime())
      );

      // Pick random transaction template
      const template =
        sampleTransactions[
          Math.floor(Math.random() * sampleTransactions.length)
        ];

      // Add some variation to amounts
      const variation = 0.8 + Math.random() * 0.4; // ±20% variation
      const amount = Math.round(template.amount * variation * 100) / 100;

      // Choose account (mostly checking, sometimes savings)
      const accountId =
        Math.random() > 0.85 && savingsAccount
          ? savingsAccount.id
          : checkingAccount.id;

      transactions.push({
        userId,
        accountId,
        amount,
        description: template.description,
        type: template.type as any,
        category: template.category as any,
        date: randomDate,
      });
    }

    // Sort by date (oldest first)
    transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Create transactions in batches
    const batchSize = 10;
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      await prisma.transaction.createMany({
        data: batch,
      });
    }

    // Calculate and update account balances
    let checkingBalance = 0;
    let savingsBalance = 0;

    transactions.forEach((transaction) => {
      if (transaction.accountId === checkingAccount.id) {
        checkingBalance += transaction.amount;
      } else if (
        savingsAccount &&
        transaction.accountId === savingsAccount.id
      ) {
        savingsBalance += transaction.amount;
      }
    });

    // Update account balances
    await prisma.account.update({
      where: { id: checkingAccount.id },
      data: { balance: Math.max(0, checkingBalance) },
    });

    if (savingsAccount) {
      await prisma.account.update({
        where: { id: savingsAccount.id },
        data: { balance: Math.max(0, savingsBalance) },
      });
    }

    console.log(`✅ Generated ${transactions.length} sample transactions`);
    console.log(`💰 Checking balance: $${checkingBalance.toFixed(2)}`);
    if (savingsAccount) {
      console.log(`🏦 Savings balance: $${savingsBalance.toFixed(2)}`);
    }
  } catch (error) {
    console.error("❌ Error generating sample data:", error);
    throw error;
  }
}

/**
 * Check if user has any transactions
 *
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} True if user has transactions
 */
export async function userHasTransactions(userId: string): Promise<boolean> {
  const count = await prisma.transaction.count({
    where: { userId },
  });
  return count > 0;
}
