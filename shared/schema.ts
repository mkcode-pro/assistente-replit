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
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
