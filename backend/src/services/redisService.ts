/**
 * Redis Service for AI Finance Dashboard
 * Handles caching, real-time updates, and session management
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import Redis from "ioredis";

class RedisService {
  private client: Redis;
  private isConnected: boolean = false;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      //   retryDelayOnFailover: 100,
      //   maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on("connect", () => {
      console.log("✅ Redis connected successfully");
      this.isConnected = true;
    });

    this.client.on("error", (error) => {
      console.error("❌ Redis connection error:", error);
      this.isConnected = false;
    });

    this.client.on("close", () => {
      console.log("⚠️ Redis connection closed");
      this.isConnected = false;
    });
  }

  async connect() {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  // Cache user dashboard data
  async cacheDashboardData(userId: string, data: any, ttl: number = 300) {
    try {
      const key = `dashboard:${userId}`;
      await this.client.setex(key, ttl, JSON.stringify(data));
      console.log(`📊 Cached dashboard data for user: ${userId}`);
    } catch (error) {
      console.error("Cache write error:", error);
    }
  }

  async getDashboardData(userId: string) {
    try {
      const key = `dashboard:${userId}`;
      const cached = await this.client.get(key);
      if (cached) {
        console.log(`🎯 Cache hit for dashboard: ${userId}`);
        return JSON.parse(cached);
      }
      console.log(`💾 Cache miss for dashboard: ${userId}`);
      return null;
    } catch (error) {
      console.error("Cache read error:", error);
      return null;
    }
  }

  // Cache AI insights
  async cacheAIInsights(userId: string, insights: any) {
    try {
      const key = `ai-insights:${userId}`;
      await this.client.setex(key, 3600, JSON.stringify(insights)); // 1 hour
      console.log(`🤖 Cached AI insights for user: ${userId}`);
    } catch (error) {
      console.error("AI insights cache error:", error);
    }
  }

  async getAIInsights(userId: string) {
    try {
      const key = `ai-insights:${userId}`;
      const cached = await this.client.get(key);
      if (cached) {
        console.log(`🎯 AI insights cache hit: ${userId}`);
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error("AI insights cache read error:", error);
      return null;
    }
  }

  // Cache user session data
  async cacheUserSession(
    sessionId: string,
    userData: any,
    ttl: number = 86400
  ) {
    try {
      const key = `session:${sessionId}`;
      await this.client.setex(key, ttl, JSON.stringify(userData));
      console.log(`🔐 Cached session: ${sessionId}`);
    } catch (error) {
      console.error("Session cache error:", error);
    }
  }

  async getUserSession(sessionId: string) {
    try {
      const key = `session:${sessionId}`;
      const session = await this.client.get(key);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error("Session read error:", error);
      return null;
    }
  }

  // Cache transaction data
  async cacheTransactionHistory(
    userId: string,
    transactions: any[],
    ttl: number = 600
  ) {
    try {
      const key = `transactions:${userId}`;
      await this.client.setex(key, ttl, JSON.stringify(transactions));
      console.log(`💳 Cached transactions for user: ${userId}`);
    } catch (error) {
      console.error("Transaction cache error:", error);
    }
  }

  async getTransactionHistory(userId: string) {
    try {
      const key = `transactions:${userId}`;
      const cached = await this.client.get(key);
      if (cached) {
        console.log(`🎯 Transaction cache hit: ${userId}`);
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error("Transaction cache read error:", error);
      return null;
    }
  }

  // Real-time updates using Pub/Sub
  async publishUpdate(channel: string, data: any) {
    try {
      await this.client.publish(channel, JSON.stringify(data));
      console.log(`📡 Published to ${channel}:`, data);
    } catch (error) {
      console.error("Publish error:", error);
    }
  }

  async subscribe(channel: string, callback: (message: any) => void) {
    try {
      const subscriber = this.client.duplicate();
      await subscriber.subscribe(channel);

      subscriber.on("message", (channel, message) => {
        try {
          const data = JSON.parse(message);
          callback(data);
        } catch (error) {
          console.error("Message parse error:", error);
        }
      });

      console.log(`📻 Subscribed to channel: ${channel}`);
    } catch (error) {
      console.error("Subscribe error:", error);
    }
  }

  // Clear user caches on data updates
  async invalidateUserCache(userId: string) {
    try {
      const keys = [
        `dashboard:${userId}`,
        `ai-insights:${userId}`,
        `transactions:${userId}`,
      ];

      for (const key of keys) {
        await this.client.del(key);
      }

      console.log(`🗑️ Invalidated cache for user: ${userId}`);
    } catch (error) {
      console.error("Cache invalidation error:", error);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.client.ping();
      return {
        status: "healthy",
        connected: this.isConnected,
        ping: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "error",
        connected: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async disconnect() {
    await this.client.quit();
    console.log("👋 Redis disconnected");
  }
}

export const redisService = new RedisService();
