/**
 * Redis Connection and Functionality Test Script
 * Tests all Redis features for AI Finance Dashboard
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import Redis from "ioredis";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface TestResult {
  test: string;
  status: "PASS" | "FAIL";
  message: string;
  duration?: number;
}

class RedisTest {
  private redis: Redis;
  private subscriber: Redis;
  private results: TestResult[] = [];

  constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    console.log(`🔗 Connecting to Redis: ${redisUrl}`);

    this.redis = new Redis(redisUrl, {
      // retryDelayOnFailover: 100, // These options are not directly available in ioredis constructor options
      // maxRetriesPerRequest: 3, // They are usually part of connection options or client configuration
    });

    this.subscriber = new Redis(redisUrl);
  }

  private async addResult(
    test: string,
    status: "PASS" | "FAIL",
    message: string,
    duration?: number
  ) {
    this.results.push({ test, status, message, duration });
    const emoji = status === "PASS" ? "✅" : "❌";
    const durationStr = duration ? ` (${duration}ms)` : "";
    console.log(`${emoji} ${test}: ${message}${durationStr}`);
  }

  private async runTest(
    testName: string,
    testFn: () => Promise<void>
  ): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      const duration = Date.now() - startTime;
      await this.addResult(testName, "PASS", "Success", duration);
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.addResult(
        testName,
        "FAIL",
        `Error: ${error.message}`,
        duration
      );
    }
  }

  async testConnection(): Promise<void> {
    await this.runTest("Connection Test", async () => {
      const result = await this.redis.ping();
      if (result !== "PONG") {
        throw new Error("Ping response was not PONG");
      }
    });
  }

  async testBasicOperations(): Promise<void> {
    await this.runTest("Basic SET/GET", async () => {
      const testKey = "test-key";
      const testValue = "Hello Redis from TypeScript!";

      await this.redis.set(testKey, testValue);
      const retrieved = await this.redis.get(testKey);

      if (retrieved !== testValue) {
        throw new Error(`Expected: ${testValue}, Got: ${retrieved}`);
      }

      // Clean up
      await this.redis.del(testKey);
    });
  }

  async testJSONOperations(): Promise<void> {
    await this.runTest("JSON Storage", async () => {
      const userData = {
        id: 123,
        name: "Test User",
        email: "test@example.com",
        balance: 1500.5,
        accounts: ["checking", "savings"],
      };

      const userKey = "user:123";
      await this.redis.set(userKey, JSON.stringify(userData));

      const retrieved = await this.redis.get(userKey);
      if (!retrieved) {
        throw new Error("Failed to retrieve user data");
      }

      const parsedUser = JSON.parse(retrieved);

      if (
        parsedUser.id !== userData.id ||
        parsedUser.balance !== userData.balance
      ) {
        throw new Error("Retrieved data does not match stored data");
      }

      // Clean up
      await this.redis.del(userKey);
    });
  }

  async testExpiration(): Promise<void> {
    await this.runTest("TTL/Expiration", async () => {
      const expiryKey = "expiry-test";
      const expiryValue = "This will expire";

      // Set with 2 second expiry
      await this.redis.setex(expiryKey, 2, expiryValue);

      // Should exist immediately
      const immediate = await this.redis.get(expiryKey);
      if (immediate !== expiryValue) {
        throw new Error("Key should exist immediately after setting");
      }

      // Wait 3 seconds and check again
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const afterExpiry = await this.redis.get(expiryKey);
      if (afterExpiry !== null) {
        throw new Error("Key should have expired after 2 seconds");
      }
    });
  }

  async testDashboardCache(): Promise<void> {
    await this.runTest("Dashboard Cache Simulation", async () => {
      const userId = "test-user-456";
      const dashboardData = {
        totalBalance: 5000.0,
        monthlyIncome: 3200.0,
        monthlyExpenses: 2800.0,
        transactionCount: 45,
        lastUpdated: new Date().toISOString(),
      };

      const cacheKey = `dashboard:${userId}`;

      // Cache dashboard data
      await this.redis.setex(cacheKey, 300, JSON.stringify(dashboardData));

      // Retrieve and verify
      const cached = await this.redis.get(cacheKey);
      if (!cached) {
        throw new Error("Failed to retrieve cached dashboard data");
      }

      const parsedData = JSON.parse(cached);
      if (parsedData.totalBalance !== dashboardData.totalBalance) {
        throw new Error("Cached data corruption detected");
      }

      // Clean up
      await this.redis.del(cacheKey);
    });
  }

  async testAIInsightsCache(): Promise<void> {
    await this.runTest("AI Insights Cache Simulation", async () => {
      const userId = "test-user-789";
      const aiInsights = [
        {
          id: "insight-1",
          title: "Spending Pattern Analysis",
          content:
            "Your spending on dining out has increased by 25% this month.",
          confidence: 0.85,
          category: "SPENDING_PATTERN",
        },
        {
          id: "insight-2",
          title: "Savings Opportunity",
          content:
            "You could save $200/month by optimizing subscription services.",
          confidence: 0.92,
          category: "SAVINGS_OPPORTUNITY",
        },
      ];

      const insightsKey = `ai-insights:${userId}`;

      // Cache AI insights (1 hour TTL)
      await this.redis.setex(insightsKey, 3600, JSON.stringify(aiInsights));

      // Retrieve and verify
      const cached = await this.redis.get(insightsKey);
      if (!cached) {
        throw new Error("Failed to retrieve cached AI insights");
      }

      const parsedInsights = JSON.parse(cached);
      if (!Array.isArray(parsedInsights) || parsedInsights.length !== 2) {
        throw new Error("AI insights data corruption detected");
      }

      if (parsedInsights[0].confidence !== aiInsights[0].confidence) {
        throw new Error("AI insights confidence data mismatch");
      }

      // Clean up
      await this.redis.del(insightsKey);
    });
  }

  async testPubSub(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const testChannel = "test-channel-finance";
      const testMessage = {
        type: "NEW_TRANSACTION",
        userId: "test-user-pubsub",
        data: {
          id: "txn-123",
          amount: -25.5,
          description: "Coffee Shop Purchase",
          category: "FOOD_DINING",
        },
      };

      let testPassed = false;
      const timeout = setTimeout(() => {
        if (!testPassed) {
          this.addResult(
            "Pub/Sub Messaging",
            "FAIL",
            "Timeout - message not received"
          );
          reject(new Error("Pub/Sub test timeout"));
        }
      }, 5000);

      try {
        // Subscribe to test channel
        await this.subscriber.subscribe(testChannel);

        this.subscriber.on("message", (channel, message) => {
          try {
            if (channel === testChannel) {
              const parsedMessage = JSON.parse(message);

              if (
                parsedMessage.type === testMessage.type &&
                parsedMessage.userId === testMessage.userId &&
                parsedMessage.data.amount === testMessage.data.amount
              ) {
                clearTimeout(timeout);
                testPassed = true;
                this.addResult(
                  "Pub/Sub Messaging",
                  "PASS",
                  "Message received successfully"
                );
                resolve();
              } else {
                clearTimeout(timeout);
                this.addResult(
                  "Pub/Sub Messaging",
                  "FAIL",
                  "Message content mismatch"
                );
                reject(new Error("Message content mismatch"));
              }
            }
          } catch (error) {
            clearTimeout(timeout);
            this.addResult(
              "Pub/Sub Messaging",
              "FAIL",
              `Parse error: ${error.message}`
            );
            reject(error);
          }
        });

        // Wait a bit for subscription to be established
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Publish test message
        await this.redis.publish(testChannel, JSON.stringify(testMessage));
      } catch (error) {
        clearTimeout(timeout);
        this.addResult(
          "Pub/Sub Messaging",
          "FAIL",
          `Setup error: ${error.message}`
        );
        reject(error);
      }
    });
  }

  async testHashOperations(): Promise<void> {
    await this.runTest("Hash Operations", async () => {
      const sessionKey = "session:test-session-id";
      const sessionData = {
        userId: "789",
        loginTime: Date.now().toString(),
        ipAddress: "192.168.1.1",
        userAgent: "Test Browser",
      };

      // Store session data as hash
      await this.redis.hmset(sessionKey, sessionData);

      // Set expiration
      await this.redis.expire(sessionKey, 86400); // 24 hours

      // Retrieve session data
      const retrievedData = await this.redis.hgetall(sessionKey);

      if (retrievedData.userId !== sessionData.userId) {
        throw new Error("Session data mismatch");
      }

      // Check if expiration was set
      const ttl = await this.redis.ttl(sessionKey);
      if (ttl <= 0) {
        throw new Error("Session expiration not set properly");
      }

      // Clean up
      await this.redis.del(sessionKey);
    });
  }

  async testMultipleOperations(): Promise<void> {
    await this.runTest("Multiple Operations (Pipeline)", async () => {
      const pipeline = this.redis.pipeline();

      // Queue multiple operations
      pipeline.set("multi:1", "value1");
      pipeline.set("multi:2", "value2");
      pipeline.set("multi:3", "value3");
      pipeline.get("multi:1");
      pipeline.get("multi:2");
      pipeline.get("multi:3");

      // Execute all operations atomically
      const results = await pipeline.exec();

      if (!results || results.length !== 6) {
        throw new Error("Pipeline execution failed");
      }

      // Verify results
      const getValue1 = results[3][1]; // Fourth operation (get multi:1)
      const getValue2 = results[4][1]; // Fifth operation (get multi:2)
      const getValue3 = results[5][1]; // Sixth operation (get multi:3)

      if (
        getValue1 !== "value1" ||
        getValue2 !== "value2" ||
        getValue3 !== "value3"
      ) {
        throw new Error("Pipeline results verification failed");
      }

      // Clean up
      await this.redis.del("multi:1", "multi:2", "multi:3");
    });
  }

  async runAllTests(): Promise<void> {
    console.log("🧪 Starting Redis Integration Tests...\n");

    try {
      await this.testConnection();
      await this.testBasicOperations();
      await this.testJSONOperations();
      await this.testExpiration();
      await this.testDashboardCache();
      await this.testAIInsightsCache();
      await this.testHashOperations();
      await this.testMultipleOperations();
      await this.testPubSub();
    } catch (error) {
      console.error("❌ Test execution failed:", error.message);
    }

    // Print summary
    this.printSummary();

    // Close connections
    await this.cleanup();
  }

  private printSummary(): void {
    console.log("\n📊 Test Results Summary");
    console.log("========================");

    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log("\n❌ Failed Tests:");
      this.results
        .filter((r) => r.status === "FAIL")
        .forEach((r) => console.log(`  - ${r.test}: ${r.message}`));
    }

    console.log("\n🏁 Redis testing completed!");
  }

  private async cleanup(): Promise<void> {
    try {
      await this.redis.quit();
      await this.subscriber.quit();
      console.log("🧹 Redis connections closed");
    } catch (error) {
      console.error("⚠️ Error during cleanup:", error.message);
    }
  }
}

// Run tests if script is executed directly
if (require.main === module) {
  const redisTest = new RedisTest();

  redisTest
    .runAllTests()
    .then(() => {
      console.log("✨ All tests completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Test suite failed:", error.message);
      process.exit(1);
    });
}

export { RedisTest };
