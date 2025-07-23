import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertConversationSchema } from "@shared/schema";
import { generateAIResponse, generateInitialAnalysis } from "./services/gemini";
import rateLimit from "express-rate-limit";
import { registerAdminRoutes } from "./admin-routes";

const chatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { error: "Muitas solicitações. Tente novamente em 1 minuto." },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Register admin routes
  registerAdminRoutes(app);
  
  // Create user profile
  app.post("/api/profile", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUser(userData.sessionId);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get user profile
  app.get("/api/profile/:sessionId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.sessionId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get conversation history
  app.get("/api/conversations/:sessionId", async (req, res) => {
    try {
      const conversations = await storage.getConversations(req.params.sessionId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send message to AI
  app.post("/api/chat", chatRateLimit, async (req, res) => {
    try {
      const messageData = insertConversationSchema.parse(req.body);
      
      // Get user profile
      const user = await storage.getUser(messageData.sessionId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Save user message
      await storage.addMessage(messageData);

      // Get conversation history
      const history = await storage.getConversations(messageData.sessionId);
      
      // Generate AI response
      const userProfile = {
        gender: user.gender,
        goal: user.goal,
        preferences: user.preferences || [],
        age: user.age,
        experience: user.experience
      };

      const aiResponse = await generateAIResponse(
        messageData.message,
        userProfile,
        history.map(h => ({ message: h.message, sender: h.sender }))
      );

      // Save AI response
      const aiMessage = await storage.addMessage({
        sessionId: messageData.sessionId,
        message: aiResponse,
        sender: "ai"
      });

      res.json(aiMessage);
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Erro interno do servidor. Tente novamente." });
    }
  });

  // Get initial AI analysis
  app.post("/api/analysis", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      const user = await storage.getUser(sessionId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const userProfile = {
        gender: user.gender,
        goal: user.goal,
        preferences: user.preferences || [],
        age: user.age,
        experience: user.experience
      };

      const analysis = await generateInitialAnalysis(userProfile);
      
      // Save AI analysis as first message
      const aiMessage = await storage.addMessage({
        sessionId,
        message: analysis,
        sender: "ai"
      });

      res.json(aiMessage);
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Erro ao gerar análise. Tente novamente." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
