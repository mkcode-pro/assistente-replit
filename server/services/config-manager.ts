import { storage } from "../storage";
import type { AiProduct, AiProtocol, AiKnowledgeBase } from "@shared/schema";

export class ConfigManager {
  private static cache: Map<string, string> = new Map();
  private static lastFetch: number = 0;
  private static CACHE_TTL = 60000; // 1 minute cache
  
  // Cache for knowledge base data
  private static productsCache: AiProduct[] = [];
  private static protocolsCache: AiProtocol[] = [];
  private static knowledgeCache: AiKnowledgeBase[] = [];
  private static lastKnowledgeFetch: number = 0;
  private static KNOWLEDGE_CACHE_TTL = 300000; // 5 minutes cache for knowledge base

  static async get(key: string, defaultValue: string = ""): Promise<string> {
    // Check cache first
    const now = Date.now();
    if (now - this.lastFetch > this.CACHE_TTL) {
      await this.refreshCache();
    }

    return this.cache.get(key) || defaultValue;
  }

  static async refreshCache(): Promise<void> {
    try {
      const settings = await storage.getAllSettings();
      this.cache.clear();
      
      for (const setting of settings) {
        this.cache.set(setting.key, setting.value);
      }
      
      this.lastFetch = Date.now();
    } catch (error) {
      console.error("Erro ao atualizar cache de configurações:", error);
    }
  }

  static async initialize(): Promise<void> {
    // Initialize default settings if they don't exist
    const defaultSettings = [
      {
        key: "ai_system_prompt",
        value: `Você é um assistente especializado em protocolos ergogênicos do Império Pharma. 

INSTRUÇÕES CRÍTICAS:
- SEMPRE responda em português brasileiro (PT-BR)
- Foque EXCLUSIVAMENTE em protocolos ergogênicos
- Seja profissional, científico e responsável
- Sempre inclua avisos de segurança e recomendações médicas

ESTRUTURA DE RESPOSTA:
1. 📊 ANÁLISE: Análise do perfil do usuário
2. 🎯 PROTOCOLO: Recomendações específicas baseadas em evidências
3. 🛡️ SUPORTE: Orientações durante o protocolo
4. 🔄 PCT: Terapia pós-ciclo quando aplicável
5. ⚠️ AVISOS: Orientações de segurança e consulta médica

Mantenha respostas concisas, científicas e sempre em português brasileiro.`,
        description: "Instruções do sistema para a IA",
        category: "ai"
      },
      {
        key: "ai_temperature",
        value: "0.7",
        description: "Temperatura da IA (0.0 - 1.0)",
        category: "ai"
      },
      {
        key: "ai_model",
        value: "gemini-2.5-flash",
        description: "Modelo de IA a ser usado",
        category: "ai"
      },
      {
        key: "rate_limit_minutes",
        value: "1",
        description: "Janela de tempo para rate limiting (minutos)",
        category: "security"
      },
      {
        key: "rate_limit_requests",
        value: "10",
        description: "Número máximo de requisições por janela",
        category: "security"
      },
      {
        key: "app_name",
        value: "IMPÉRIO PHARMA",
        description: "Nome da aplicação",
        category: "general"
      },
      {
        key: "app_subtitle",
        value: "Consultoria em Protocolos Ergogênicos",
        description: "Subtítulo da aplicação",
        category: "general"
      },
      {
        key: "welcome_message",
        value: "Bem-vindo ao sistema de consultoria em protocolos ergogênicos. Como posso ajudá-lo hoje?",
        description: "Mensagem de boas-vindas",
        category: "general"
      }
    ];

    for (const setting of defaultSettings) {
      const existing = await storage.getSetting(setting.key);
      if (!existing) {
        await storage.setSetting(setting);
      }
    }

    await this.refreshCache();
  }

  // Knowledge base methods
  static async getActiveProducts(): Promise<AiProduct[]> {
    const now = Date.now();
    if (now - this.lastKnowledgeFetch > this.KNOWLEDGE_CACHE_TTL) {
      await this.refreshKnowledgeCache();
    }
    return this.productsCache;
  }

  static async getActiveProtocols(): Promise<AiProtocol[]> {
    const now = Date.now();
    if (now - this.lastKnowledgeFetch > this.KNOWLEDGE_CACHE_TTL) {
      await this.refreshKnowledgeCache();
    }
    return this.protocolsCache;
  }

  static async getProtocolsByProfile(goal: string, gender?: string, experience?: number): Promise<AiProtocol[]> {
    return await storage.getProtocolsByProfile(goal, gender, experience);
  }

  static async getActiveKnowledgeBase(): Promise<AiKnowledgeBase[]> {
    const now = Date.now();
    if (now - this.lastKnowledgeFetch > this.KNOWLEDGE_CACHE_TTL) {
      await this.refreshKnowledgeCache();
    }
    return this.knowledgeCache;
  }

  static async getKnowledgeByCategory(category: string): Promise<AiKnowledgeBase[]> {
    return await storage.getKnowledgeByCategory(category);
  }

  private static async refreshKnowledgeCache(): Promise<void> {
    try {
      const [products, protocols, knowledge] = await Promise.all([
        storage.getActiveProducts(),
        storage.getActiveProtocols(),
        storage.getActiveKnowledgeBase()
      ]);
      
      this.productsCache = products;
      this.protocolsCache = protocols;
      this.knowledgeCache = knowledge;
      this.lastKnowledgeFetch = Date.now();
    } catch (error) {
      console.error("Erro ao atualizar cache da base de conhecimento:", error);
    }
  }

  static async invalidateKnowledgeCache(): Promise<void> {
    this.lastKnowledgeFetch = 0;
  }
}