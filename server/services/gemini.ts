import { GoogleGenAI } from "@google/genai";
import { storage } from "../storage";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

const DEFAULT_SYSTEM_PROMPT = `Você é um assistente especializado em protocolos ergogênicos do Império Pharma. 

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

Mantenha respostas concisas, científicas e sempre em português brasileiro.`;

async function getSystemPrompt(): Promise<string> {
  try {
    const setting = await storage.getSetting("system_prompt");
    return setting?.value || DEFAULT_SYSTEM_PROMPT;
  } catch (error) {
    console.error("Erro ao carregar system prompt:", error);
    return DEFAULT_SYSTEM_PROMPT;
  }
}

export interface UserProfile {
  gender: string;
  goal: string;
  preferences: string[];
  age: number;
  experience: number;
}

export async function generateAIResponse(
  message: string, 
  userProfile: UserProfile,
  conversationHistory: Array<{message: string, sender: string}>
): Promise<string> {
  try {
    const systemPrompt = await getSystemPrompt();
    
    const contextualPrompt = `
PERFIL DO USUÁRIO:
- Gênero: ${userProfile.gender}
- Objetivo: ${userProfile.goal}
- Preferências: ${userProfile.preferences.join(', ')}
- Idade: ${userProfile.age} anos
- Experiência: ${userProfile.experience} anos

HISTÓRICO DA CONVERSA:
${conversationHistory.slice(-5).map(h => `${h.sender}: ${h.message}`).join('\n')}

PERGUNTA ATUAL: ${message}

Responda em português brasileiro com base no perfil e histórico fornecidos.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
      contents: contextualPrompt,
    });

    return response.text || "Desculpe, não consegui processar sua solicitação. Tente novamente.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Erro na IA. Tente novamente em alguns instantes.");
  }
}

export async function generateInitialAnalysis(userProfile: UserProfile): Promise<string> {
  const prompt = `Analise este perfil de usuário e forneça uma análise inicial personalizada:

PERFIL:
- Gênero: ${userProfile.gender}
- Objetivo: ${userProfile.goal}
- Preferências: ${userProfile.preferences.join(', ')}
- Idade: ${userProfile.age} anos
- Experiência: ${userProfile.experience} anos

Forneça uma análise completa seguindo a estrutura de resposta padrão.`;

  try {
    const systemPrompt = await getSystemPrompt();
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
      contents: prompt,
    });

    return response.text || "Análise inicial não disponível. Como posso ajudá-lo com seu protocolo?";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Bem-vindo! Vou analisar seu perfil e criar um protocolo personalizado. Como posso ajudá-lo hoje?";
  }
}
