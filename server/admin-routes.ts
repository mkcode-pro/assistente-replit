import type { Express } from "express";
import { storage } from "./storage";
import { 
  insertAdminSchema, 
  insertSystemSettingSchema, 
  insertUserCalculationSchema,
  insertAiProductSchema,
  insertAiProtocolSchema,
  insertAiKnowledgeBaseSchema
} from "@shared/schema";
import { ConfigManager } from "./services/config-manager";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import rateLimit from "express-rate-limit";

declare module 'express-session' {
  interface SessionData {
    adminId?: number;
    adminUsername?: string;
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: { error: "Muitas solicitações do painel administrativo. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

export function registerAdminRoutes(app: Express) {
  // Initialize default admin user if not exists
  const initializeAdmin = async () => {
    const admin = await storage.getAdmin("admin");
    if (!admin) {
      await storage.createAdmin({
        username: "admin",
        password: await hashPassword("senha123")
      });
      console.log("Admin padrão criado: admin/senha123");
    }

    // Initialize default system settings
    const settings = [
      { key: "system_prompt", value: "Você é um assistente especializado em protocolos ergogênicos...", description: "Prompt do sistema para IA" },
      { key: "rate_limit_chat", value: "10", description: "Limite de mensagens por minuto no chat" },
      { key: "rate_limit_window", value: "60000", description: "Janela de tempo para rate limiting (ms)" },
      { key: "api_cost_per_1k_tokens", value: "0.002", description: "Custo por 1000 tokens da API" }
    ];

    for (const setting of settings) {
      const existing = await storage.getSetting(setting.key);
      if (!existing) {
        await storage.setSetting(setting);
      }
    }
  };

  initializeAdmin();

  app.use("/api/admin", adminRateLimit);

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
      }
      
      console.log(`Tentativa de login do admin: ${username}`);
      
      const admin = await storage.getAdmin(username);
      if (!admin) {
        console.log(`Admin não encontrado: ${username}`);
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const passwordValid = await comparePasswords(password, admin.password);
      if (!passwordValid) {
        console.log(`Senha inválida para admin: ${username}`);
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      await storage.updateAdminLastLogin(username);
      
      // Initialize session if it doesn't exist
      if (!req.session) {
        return res.status(500).json({ error: "Erro de sessão. Tente novamente." });
      }
      
      // Store admin session
      req.session.adminId = admin.id;
      req.session.adminUsername = admin.username;
      
      console.log(`Login do admin bem-sucedido: ${username}`);
      
      res.json({ 
        id: admin.id, 
        username: admin.username, 
        lastLogin: admin.lastLogin 
      });
    } catch (error: any) {
      console.error("Erro no login do admin:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    if (req.session) {
      req.session.adminId = undefined;
      req.session.adminUsername = undefined;
    }
    res.json({ success: true });
  });

  // Middleware to check admin authentication
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session || !req.session.adminId) {
      return res.status(401).json({ error: "Acesso negado" });
    }
    next();
  };

  // Dashboard statistics
  app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
    try {
      const [totalUsers, totalConversations, activeUsersToday, usersByObjective] = await Promise.all([
        storage.getTotalUsers(),
        storage.getTotalConversations(),
        storage.getActiveUsersToday(),
        storage.getUsersByObjective()
      ]);

      // Get recent activity (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const recentApiUsage = await storage.getApiUsage(yesterday, new Date());
      
      const totalTokensUsed = recentApiUsage.reduce((sum, usage) => sum + (usage.tokensUsed || 0), 0);
      const estimatedCost = (totalTokensUsed / 1000) * 0.002; // $0.002 per 1K tokens

      res.json({
        totalUsers,
        totalConversations,
        activeUsersToday,
        usersByObjective,
        apiUsage: {
          tokensUsed24h: totalTokensUsed,
          estimatedCost24h: estimatedCost.toFixed(4),
          requestCount24h: recentApiUsage.length
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User management
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/users/:sessionId", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.sessionId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      
      const conversations = await storage.getConversations(req.params.sessionId);
      const calculations = await storage.getUserCalculations(req.params.sessionId);
      
      res.json({ user, conversations, calculations });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Conversation management
  app.get("/api/admin/conversations", requireAdmin, async (req, res) => {
    try {
      const { search, startDate, endDate } = req.query;
      
      let conversations;
      if (search) {
        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;
        conversations = await storage.searchConversations(search as string, start, end);
      } else {
        conversations = await storage.getAllConversations();
      }
      
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // System settings
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settingData = insertSystemSettingSchema.parse(req.body);
      const setting = await storage.setSetting(settingData);
      res.json(setting);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // API usage analytics
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();
      
      const apiUsage = await storage.getApiUsage(start, end);
      const usersByObjective = await storage.getUsersByObjective();
      
      // Process usage by day
      const usageByDay = apiUsage.reduce((acc: any, usage) => {
        const day = usage.timestamp.toISOString().split('T')[0];
        if (!acc[day]) {
          acc[day] = { requests: 0, tokens: 0, cost: 0 };
        }
        acc[day].requests++;
        acc[day].tokens += usage.tokensUsed || 0;
        acc[day].cost += parseFloat(usage.cost || '0');
        return acc;
      }, {});

      res.json({
        usageByDay,
        usersByObjective,
        totalRequests: apiUsage.length,
        totalTokens: apiUsage.reduce((sum, usage) => sum + (usage.tokensUsed || 0), 0),
        totalCost: apiUsage.reduce((sum, usage) => sum + parseFloat(usage.cost || '0'), 0)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Calculator routes
  app.post("/api/calculators/tmb", async (req, res) => {
    try {
      const { sessionId, age, weight, height, gender, activityLevel } = req.body;
      
      // TMB calculation using Harris-Benedict equation
      let tmb;
      if (gender === 'masculino') {
        tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }

      // Activity level multipliers
      const activityMultipliers: { [key: string]: number } = {
        sedentario: 1.2,
        leve: 1.375,
        moderado: 1.55,
        intenso: 1.725,
        muito_intenso: 1.9
      };

      const tdee = tmb * (activityMultipliers[activityLevel] || 1.2);

      const results = {
        tmb: Math.round(tmb),
        tdee: Math.round(tdee),
        activityLevel,
        recommendations: {
          cutting: Math.round(tdee * 0.8),
          manutencao: Math.round(tdee),
          ganho: Math.round(tdee * 1.2)
        }
      };

      // Save calculation
      await storage.saveCalculation({
        sessionId,
        calculationType: 'tmb',
        inputs: { age, weight, height, gender, activityLevel },
        results
      });

      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/calculators/macros", async (req, res) => {
    try {
      const { sessionId, calories, objective, weight } = req.body;
      
      let proteinRatio, carbRatio, fatRatio;
      
      switch (objective) {
        case 'ganho_massa':
          proteinRatio = 0.30;
          carbRatio = 0.45;
          fatRatio = 0.25;
          break;
        case 'cutting':
          proteinRatio = 0.40;
          carbRatio = 0.30;
          fatRatio = 0.30;
          break;
        case 'recomposicao':
          proteinRatio = 0.35;
          carbRatio = 0.40;
          fatRatio = 0.25;
          break;
        default:
          proteinRatio = 0.30;
          carbRatio = 0.40;
          fatRatio = 0.30;
      }

      const results = {
        calorias: calories,
        proteina: {
          gramas: Math.round((calories * proteinRatio) / 4),
          calorias: Math.round(calories * proteinRatio),
          percentual: Math.round(proteinRatio * 100)
        },
        carboidrato: {
          gramas: Math.round((calories * carbRatio) / 4),
          calorias: Math.round(calories * carbRatio),
          percentual: Math.round(carbRatio * 100)
        },
        gordura: {
          gramas: Math.round((calories * fatRatio) / 9),
          calorias: Math.round(calories * fatRatio),
          percentual: Math.round(fatRatio * 100)
        },
        proteinaPorKg: Math.round(((calories * proteinRatio) / 4) / weight * 100) / 100
      };

      // Save calculation
      await storage.saveCalculation({
        sessionId,
        calculationType: 'macros',
        inputs: { calories, objective, weight },
        results
      });

      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/calculators/calories", async (req, res) => {
    try {
      const { sessionId, objective, currentCalories, weight, targetWeight } = req.body;
      
      let adjustment;
      const weeklyChange = 0.5; // 0.5kg per week safe rate
      const caloriesPerKg = 7700; // approximately 7700 calories per kg
      const weeklyCalorieAdjustment = (weeklyChange * caloriesPerKg) / 7; // daily adjustment

      switch (objective) {
        case 'cutting':
          adjustment = -weeklyCalorieAdjustment;
          break;
        case 'ganho_massa':
          adjustment = weeklyCalorieAdjustment;
          break;
        default:
          adjustment = 0;
      }

      const targetCalories = Math.round(currentCalories + adjustment);
      const weeksToGoal = targetWeight ? Math.abs(targetWeight - weight) / weeklyChange : 0;

      const results = {
        caloriaAtual: currentCalories,
        caloriaMeta: targetCalories,
        ajuste: Math.round(adjustment),
        objetivo: objective,
        tempoEstimado: Math.round(weeksToGoal),
        deficitOuSuperavit: adjustment < 0 ? 'déficit' : adjustment > 0 ? 'superávit' : 'manutenção'
      };

      // Save calculation
      await storage.saveCalculation({
        sessionId,
        calculationType: 'calories',
        inputs: { objective, currentCalories, weight, targetWeight },
        results
      });

      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user calculations
  app.get("/api/calculators/:sessionId", async (req, res) => {
    try {
      const calculations = await storage.getUserCalculations(req.params.sessionId);
      res.json(calculations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Knowledge Base Management Routes

  // Products management
  app.get("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const productData = insertAiProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      await ConfigManager.invalidateKnowledgeCache();
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertAiProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      await ConfigManager.invalidateKnowledgeCache();
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      await ConfigManager.invalidateKnowledgeCache();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protocols management
  app.get("/api/admin/protocols", requireAdmin, async (req, res) => {
    try {
      const protocols = await storage.getAllProtocols();
      res.json(protocols);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/protocols", requireAdmin, async (req, res) => {
    try {
      const protocolData = insertAiProtocolSchema.parse(req.body);
      const protocol = await storage.createProtocol(protocolData);
      await ConfigManager.invalidateKnowledgeCache();
      res.json(protocol);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/protocols/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const protocolData = insertAiProtocolSchema.partial().parse(req.body);
      const protocol = await storage.updateProtocol(id, protocolData);
      await ConfigManager.invalidateKnowledgeCache();
      res.json(protocol);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/protocols/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProtocol(id);
      await ConfigManager.invalidateKnowledgeCache();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Knowledge base management
  app.get("/api/admin/knowledge", requireAdmin, async (req, res) => {
    try {
      const knowledge = await storage.getAllKnowledgeBase();
      res.json(knowledge);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/knowledge", requireAdmin, async (req, res) => {
    try {
      const knowledgeData = insertAiKnowledgeBaseSchema.parse(req.body);
      const knowledge = await storage.createKnowledge(knowledgeData);
      await ConfigManager.invalidateKnowledgeCache();
      res.json(knowledge);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/knowledge/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const knowledgeData = insertAiKnowledgeBaseSchema.partial().parse(req.body);
      const knowledge = await storage.updateKnowledge(id, knowledgeData);
      await ConfigManager.invalidateKnowledgeCache();
      res.json(knowledge);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/knowledge/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteKnowledge(id);
      await ConfigManager.invalidateKnowledgeCache();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}