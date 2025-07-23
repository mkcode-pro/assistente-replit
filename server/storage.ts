import { 
  users, 
  conversations, 
  admins,
  systemSettings,
  apiUsage,
  userCalculations,
  aiProducts,
  aiProtocols,
  aiKnowledgeBase,
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
  type InsertUserCalculation,
  type AiProduct,
  type InsertAiProduct,
  type AiProtocol,
  type InsertAiProtocol,
  type AiKnowledgeBase,
  type InsertAiKnowledgeBase
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
  
  // AI Knowledge Base methods
  getAllProducts(): Promise<AiProduct[]>;
  getActiveProducts(): Promise<AiProduct[]>;
  createProduct(product: InsertAiProduct): Promise<AiProduct>;
  updateProduct(id: number, product: Partial<InsertAiProduct>): Promise<AiProduct>;
  deleteProduct(id: number): Promise<void>;
  
  getAllProtocols(): Promise<AiProtocol[]>;
  getActiveProtocols(): Promise<AiProtocol[]>;
  getProtocolsByProfile(goal: string, gender?: string, experience?: number): Promise<AiProtocol[]>;
  createProtocol(protocol: InsertAiProtocol): Promise<AiProtocol>;
  updateProtocol(id: number, protocol: Partial<InsertAiProtocol>): Promise<AiProtocol>;
  deleteProtocol(id: number): Promise<void>;
  
  getAllKnowledgeBase(): Promise<AiKnowledgeBase[]>;
  getActiveKnowledgeBase(): Promise<AiKnowledgeBase[]>;
  getKnowledgeByCategory(category: string): Promise<AiKnowledgeBase[]>;
  createKnowledge(knowledge: InsertAiKnowledgeBase): Promise<AiKnowledgeBase>;
  updateKnowledge(id: number, knowledge: Partial<InsertAiKnowledgeBase>): Promise<AiKnowledgeBase>;
  deleteKnowledge(id: number): Promise<void>;
  
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
        .set({ 
          value: insertSetting.value, 
          description: insertSetting.description,
          category: insertSetting.category || 'general',
          updatedAt: new Date() 
        })
        .where(eq(systemSettings.key, insertSetting.key))
        .returning();
      return setting;
    } else {
      const [setting] = await db.insert(systemSettings).values({
        ...insertSetting,
        category: insertSetting.category || 'general'
      }).returning();
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

  // AI Products methods
  async getAllProducts(): Promise<AiProduct[]> {
    return await db.select().from(aiProducts).orderBy(aiProducts.name);
  }

  async getActiveProducts(): Promise<AiProduct[]> {
    return await db.select().from(aiProducts).where(eq(aiProducts.isActive, true)).orderBy(aiProducts.name);
  }

  async createProduct(insertProduct: InsertAiProduct): Promise<AiProduct> {
    const [product] = await db.insert(aiProducts).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertAiProduct>): Promise<AiProduct> {
    const [product] = await db
      .update(aiProducts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(aiProducts.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(aiProducts).where(eq(aiProducts.id, id));
  }

  // AI Protocols methods
  async getAllProtocols(): Promise<AiProtocol[]> {
    return await db.select().from(aiProtocols).orderBy(aiProtocols.title);
  }

  async getActiveProtocols(): Promise<AiProtocol[]> {
    return await db.select().from(aiProtocols).where(eq(aiProtocols.isActive, true)).orderBy(aiProtocols.title);
  }

  async getProtocolsByProfile(goal: string, gender?: string, experience?: number): Promise<AiProtocol[]> {
    let whereConditions = [
      eq(aiProtocols.isActive, true),
      eq(aiProtocols.targetGoal, goal)
    ];

    if (gender) {
      whereConditions.push(
        sql`${aiProtocols.targetGender} = ${gender} OR ${aiProtocols.targetGender} = 'both'`
      );
    }

    if (experience !== undefined) {
      whereConditions.push(
        sql`${aiProtocols.minExperience} <= ${experience}`,
        sql`(${aiProtocols.maxExperience} IS NULL OR ${aiProtocols.maxExperience} >= ${experience})`
      );
    }

    return await db
      .select()
      .from(aiProtocols)
      .where(and(...whereConditions)!)
      .orderBy(aiProtocols.title);
  }

  async createProtocol(insertProtocol: InsertAiProtocol): Promise<AiProtocol> {
    const [protocol] = await db.insert(aiProtocols).values(insertProtocol).returning();
    return protocol;
  }

  async updateProtocol(id: number, updateData: Partial<InsertAiProtocol>): Promise<AiProtocol> {
    const [protocol] = await db
      .update(aiProtocols)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(aiProtocols.id, id))
      .returning();
    return protocol;
  }

  async deleteProtocol(id: number): Promise<void> {
    await db.delete(aiProtocols).where(eq(aiProtocols.id, id));
  }

  // AI Knowledge Base methods
  async getAllKnowledgeBase(): Promise<AiKnowledgeBase[]> {
    return await db.select().from(aiKnowledgeBase).orderBy(aiKnowledgeBase.priority, aiKnowledgeBase.title);
  }

  async getActiveKnowledgeBase(): Promise<AiKnowledgeBase[]> {
    return await db
      .select()
      .from(aiKnowledgeBase)
      .where(eq(aiKnowledgeBase.isActive, true))
      .orderBy(aiKnowledgeBase.priority, aiKnowledgeBase.title);
  }

  async getKnowledgeByCategory(category: string): Promise<AiKnowledgeBase[]> {
    return await db
      .select()
      .from(aiKnowledgeBase)
      .where(and(eq(aiKnowledgeBase.category, category), eq(aiKnowledgeBase.isActive, true))!)
      .orderBy(aiKnowledgeBase.priority, aiKnowledgeBase.title);
  }

  async createKnowledge(insertKnowledge: InsertAiKnowledgeBase): Promise<AiKnowledgeBase> {
    const [knowledge] = await db.insert(aiKnowledgeBase).values(insertKnowledge).returning();
    return knowledge;
  }

  async updateKnowledge(id: number, updateData: Partial<InsertAiKnowledgeBase>): Promise<AiKnowledgeBase> {
    const [knowledge] = await db
      .update(aiKnowledgeBase)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(aiKnowledgeBase.id, id))
      .returning();
    return knowledge;
  }

  async deleteKnowledge(id: number): Promise<void> {
    await db.delete(aiKnowledgeBase).where(eq(aiKnowledgeBase.id, id));
  }
}

export const storage = new DatabaseStorage();
