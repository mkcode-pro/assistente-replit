import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertConversationSchema } from "@shared/schema";
import { generateInitialAnalysis, generateSingleConsultation } from "./services/gemini";
import rateLimit from "express-rate-limit";
import { registerAdminRoutes } from "./admin-routes";

// Rate limit will be configured dynamically
let chatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { error: "Muitas solicitações. Tente novamente em 1 minuto." },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Register admin routes
  registerAdminRoutes(app);
  
  // Update rate limit based on configuration
  const { ConfigManager } = await import("./services/config-manager");
  const rateLimitMinutes = parseInt(await ConfigManager.get("rate_limit_minutes", "1"));
  const rateLimitRequests = parseInt(await ConfigManager.get("rate_limit_requests", "10"));
  
  chatRateLimit = rateLimit({
    windowMs: rateLimitMinutes * 60 * 1000,
    max: rateLimitRequests,
    message: { error: `Muitas solicitações. Tente novamente em ${rateLimitMinutes} minuto(s).` },
    standardHeaders: true,
    legacyHeaders: false,
  });
  
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

  // Single consultation endpoint
  app.post("/api/consultation", chatRateLimit, async (req, res) => {
    try {
      const messageData = insertConversationSchema.parse(req.body);
      
      // Get user profile
      const user = await storage.getUser(messageData.sessionId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Clear any previous consultation for this session
      await storage.clearConversations(messageData.sessionId);

      // Save user consultation question
      await storage.addMessage(messageData);

      // Generate single consultation response
      const userProfile = {
        gender: user.gender,
        goal: user.goal,
        preferences: user.preferences || [],
        age: user.age,
        experience: user.experience
      };

      const consultationResponse = await generateSingleConsultation(
        messageData.message,
        userProfile
      );

      // Save AI consultation response
      const aiMessage = await storage.addMessage({
        sessionId: messageData.sessionId,
        message: consultationResponse,
        sender: "ai"
      });

      // Mark consultation as completed
      res.json({ 
        ...aiMessage, 
        consultationComplete: true,
        canDownload: true
      });
    } catch (error: any) {
      console.error("Consultation error:", error);
      res.status(500).json({ error: "Erro interno do servidor. Tente novamente." });
    }
  });

  // Download consultation protocol as PDF/Text
  app.get("/api/consultation/:sessionId/download", async (req, res) => {
    try {
      const conversations = await storage.getConversations(req.params.sessionId);
      const user = await storage.getUser(req.params.sessionId);
      
      if (!conversations.length || !user) {
        return res.status(404).json({ error: "Consulta não encontrada" });
      }

      const userQuestion = conversations.find(c => c.sender === "user");
      const aiResponse = conversations.find(c => c.sender === "ai");

      if (!aiResponse) {
        return res.status(404).json({ error: "Protocolo não encontrado" });
      }

      const protocolContent = {
        consultaData: new Date().toLocaleDateString('pt-BR'),
        perfilUsuario: {
          idade: user.age,
          genero: user.gender,
          objetivo: user.goal,
          experiencia: user.experience,
          preferencias: user.preferences
        },
        pergunta: userQuestion?.message || "Consulta geral",
        protocolo: aiResponse.message,
        observacoes: "Este protocolo foi gerado por IA e deve ser acompanhado por profissional da saúde."
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="protocolo-imperio-pharma.json"');
      res.json(protocolContent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
