import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  gender: text("gender").notNull(),
  goal: text("goal").notNull(), 
  preferences: text("preferences").array(),
  age: integer("age").notNull(),
  experience: integer("experience").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  sender: text("sender").notNull(), // 'user' or 'ai'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  tokensUsed: integer("tokens_used").default(0),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  category: text("category").default("general"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const apiUsage = pgTable("api_usage", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  endpoint: text("endpoint").notNull(),
  tokensUsed: integer("tokens_used").default(0),
  cost: text("cost"), // stored as string to avoid float precision issues
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const userCalculations = pgTable("user_calculations", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  calculationType: text("calculation_type").notNull(), // 'tmb', 'macros', 'calories'
  inputs: jsonb("inputs").notNull(),
  results: jsonb("results").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Novas tabelas para base de conhecimento da IA
export const aiProducts = pgTable("ai_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  dosageInfo: text("dosage_info"),
  contraindications: text("contraindications"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiProtocols = pgTable("ai_protocols", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'bulking', 'cutting', 'strength', etc.
  targetGoal: text("target_goal").notNull(),
  targetGender: text("target_gender"), // 'male', 'female', 'both'
  minExperience: integer("min_experience").default(0),
  maxExperience: integer("max_experience"),
  protocolSteps: jsonb("protocol_steps").notNull(), // Array of steps
  duration: text("duration"),
  warnings: text("warnings"),
  pctRequired: boolean("pct_required").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiKnowledgeBase = pgTable("ai_knowledge_base", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'general_guidelines', 'safety_info', 'interaction_warnings'
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(), // For easier searching
  priority: integer("priority").default(1), // 1=low, 5=high priority
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  timestamp: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  updatedAt: true,
}).extend({
  category: z.string().optional()
});

export const insertApiUsageSchema = createInsertSchema(apiUsage).omit({
  id: true,
  timestamp: true,
});

export const insertUserCalculationSchema = createInsertSchema(userCalculations).omit({
  id: true,
  timestamp: true,
});

export const insertAiProductSchema = createInsertSchema(aiProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiProtocolSchema = createInsertSchema(aiProtocols).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiKnowledgeBaseSchema = createInsertSchema(aiKnowledgeBase).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertApiUsage = z.infer<typeof insertApiUsageSchema>;
export type ApiUsage = typeof apiUsage.$inferSelect;
export type InsertUserCalculation = z.infer<typeof insertUserCalculationSchema>;
export type UserCalculation = typeof userCalculations.$inferSelect;
export type InsertAiProduct = z.infer<typeof insertAiProductSchema>;
export type AiProduct = typeof aiProducts.$inferSelect;
export type InsertAiProtocol = z.infer<typeof insertAiProtocolSchema>;
export type AiProtocol = typeof aiProtocols.$inferSelect;
export type InsertAiKnowledgeBase = z.infer<typeof insertAiKnowledgeBaseSchema>;
export type AiKnowledgeBase = typeof aiKnowledgeBase.$inferSelect;
