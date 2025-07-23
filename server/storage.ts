import { 
  users, 
  conversations, 
  admins,
  systemSettings,
  apiUsage,
  userCalculations,
  type User, 
  type InsertUser, 
  type Conversation, 
  type InsertConversation,
  type Admin,
  type InsertAdmin,
  type SystemSetting,
  type InsertSystemSetting,
  type ApiUsage,
  type InsertApiUsage,
  type UserCalculation,
  type InsertUserCalculation
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and, gte, lte } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(sessionId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Conversation methods
  getConversations(sessionId: string): Promise<Conversation[]>;
  addMessage(conversation: InsertConversation): Promise<Conversation>;
  getAllConversations(): Promise<Conversation[]>;
  searchConversations(query: string, startDate?: Date, endDate?: Date): Promise<Conversation[]>;
  
  // Admin methods
  getAdmin(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdminLastLogin(username: string): Promise<void>;
  
  // System settings methods
  getSetting(key: string): Promise<SystemSetting | undefined>;
  setSetting(setting: InsertSystemSetting): Promise<SystemSetting>;
  getAllSettings(): Promise<SystemSetting[]>;
  
  // API usage tracking
  trackApiUsage(usage: InsertApiUsage): Promise<ApiUsage>;
  getApiUsage(startDate?: Date, endDate?: Date): Promise<ApiUsage[]>;
  
  // User calculations
  saveCalculation(calculation: InsertUserCalculation): Promise<UserCalculation>;
  getUserCalculations(sessionId: string): Promise<UserCalculation[]>;
  
  // Analytics
  getTotalUsers(): Promise<number>;
  getTotalConversations(): Promise<number>;
  getActiveUsersToday(): Promise<number>;
  getUsersByObjective(): Promise<{ objective: string; count: number }[]>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(sessionId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.sessionId, sessionId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Conversation methods
  async getConversations(sessionId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.sessionId, sessionId))
      .orderBy(conversations.timestamp);
  }

  async addMessage(insertConversation: InsertConversation): Promise<Conversation> {
    const messageData = {
      ...insertConversation,
      tokensUsed: insertConversation.tokensUsed || 0
    };
    const [conversation] = await db.insert(conversations).values(messageData).returning();
    return conversation;
  }

  async getAllConversations(): Promise<Conversation[]> {
    return await db.select().from(conversations).orderBy(desc(conversations.timestamp));
  }

  async searchConversations(query: string, startDate?: Date, endDate?: Date): Promise<Conversation[]> {
    let whereClause = sql`LOWER(${conversations.message}) LIKE LOWER(${'%' + query + '%'})`;
    
    if (startDate && endDate) {
      whereClause = and(
        whereClause,
        gte(conversations.timestamp, startDate),
        lte(conversations.timestamp, endDate)
      )!;
    }
    
    return await db
      .select()
      .from(conversations)
      .where(whereClause)
      .orderBy(desc(conversations.timestamp));
  }

  // Admin methods
  async getAdmin(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  async updateAdminLastLogin(username: string): Promise<void> {
    await db
      .update(admins)
      .set({ lastLogin: new Date() })
      .where(eq(admins.username, username));
  }

  // System settings methods
  async getSetting(key: string): Promise<SystemSetting | undefined> {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return setting || undefined;
  }

  async setSetting(insertSetting: InsertSystemSetting): Promise<SystemSetting> {
    const existing = await this.getSetting(insertSetting.key);
    if (existing) {
      const [setting] = await db
        .update(systemSettings)
        .set({ value: insertSetting.value, description: insertSetting.description, updatedAt: new Date() })
        .where(eq(systemSettings.key, insertSetting.key))
        .returning();
      return setting;
    } else {
      const [setting] = await db.insert(systemSettings).values(insertSetting).returning();
      return setting;
    }
  }

  async getAllSettings(): Promise<SystemSetting[]> {
    return await db.select().from(systemSettings).orderBy(systemSettings.key);
  }

  // API usage tracking
  async trackApiUsage(insertUsage: InsertApiUsage): Promise<ApiUsage> {
    const [usage] = await db.insert(apiUsage).values(insertUsage).returning();
    return usage;
  }

  async getApiUsage(startDate?: Date, endDate?: Date): Promise<ApiUsage[]> {
    if (startDate && endDate) {
      return await db
        .select()
        .from(apiUsage)
        .where(
          and(
            gte(apiUsage.timestamp, startDate),
            lte(apiUsage.timestamp, endDate)
          )!
        )
        .orderBy(desc(apiUsage.timestamp));
    }
    
    return await db.select().from(apiUsage).orderBy(desc(apiUsage.timestamp));
  }

  // User calculations
  async saveCalculation(insertCalculation: InsertUserCalculation): Promise<UserCalculation> {
    const [calculation] = await db.insert(userCalculations).values(insertCalculation).returning();
    return calculation;
  }

  async getUserCalculations(sessionId: string): Promise<UserCalculation[]> {
    return await db
      .select()
      .from(userCalculations)
      .where(eq(userCalculations.sessionId, sessionId))
      .orderBy(desc(userCalculations.timestamp));
  }

  // Analytics
  async getTotalUsers(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(users);
    return result.count;
  }

  async getTotalConversations(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(conversations);
    return result.count;
  }

  async getActiveUsersToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [result] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, today));
    
    return result.count;
  }

  async getUsersByObjective(): Promise<{ objective: string; count: number }[]> {
    const results = await db
      .select({
        objective: users.goal,
        count: count()
      })
      .from(users)
      .groupBy(users.goal);
    
    return results.map(r => ({ objective: r.objective, count: r.count }));
  }
}

export const storage = new DatabaseStorage();
