import { users, conversations, type User, type InsertUser, type Conversation, type InsertConversation } from "@shared/schema";

export interface IStorage {
  getUser(sessionId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getConversations(sessionId: string): Promise<Conversation[]>;
  addMessage(conversation: InsertConversation): Promise<Conversation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversations: Map<string, Conversation[]>;
  private currentUserId: number;
  private currentConversationId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
  }

  async getUser(sessionId: string): Promise<User | undefined> {
    return this.users.get(sessionId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      preferences: insertUser.preferences || null
    };
    this.users.set(insertUser.sessionId, user);
    this.conversations.set(insertUser.sessionId, []);
    return user;
  }

  async getConversations(sessionId: string): Promise<Conversation[]> {
    return this.conversations.get(sessionId) || [];
  }

  async addMessage(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = {
      ...insertConversation,
      id,
      timestamp: new Date()
    };
    
    const existing = this.conversations.get(insertConversation.sessionId) || [];
    existing.push(conversation);
    this.conversations.set(insertConversation.sessionId, existing);
    
    return conversation;
  }
}

export const storage = new MemStorage();
