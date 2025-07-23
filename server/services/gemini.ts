import { GoogleGenAI } from "@google/genai";
import { ConfigManager } from "./config-manager";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

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
    // Get configurations from database
    const systemPrompt = await ConfigManager.get("ai_system_prompt", "Você é um assistente especializado em protocolos ergogênicos.");
    const temperature = parseFloat(await ConfigManager.get("ai_temperature", "0.7"));
    const model = await ConfigManager.get("ai_model", "gemini-2.5-flash");

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
      model,
      config: {
        systemInstruction: systemPrompt,
        temperature,
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
  // Get configurations from database
  const systemPrompt = await ConfigManager.get("ai_system_prompt", "Você é um assistente especializado em protocolos ergogênicos.");
  const temperature = parseFloat(await ConfigManager.get("ai_temperature", "0.8"));
  const model = await ConfigManager.get("ai_model", "gemini-2.5-flash");
  const welcomeMessage = await ConfigManager.get("welcome_message", "Bem-vindo! Como posso ajudá-lo?");

  const prompt = `Analise este perfil de usuário e forneça uma análise inicial personalizada:

PERFIL:
- Gênero: ${userProfile.gender}
- Objetivo: ${userProfile.goal}
- Preferências: ${userProfile.preferences.join(', ')}
- Idade: ${userProfile.age} anos
- Experiência: ${userProfile.experience} anos

Forneça uma análise completa seguindo a estrutura de resposta padrão.`;

  try {
    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction: systemPrompt,
        temperature,
      },
      contents: prompt,
    });

    return response.text || welcomeMessage;
  } catch (error) {
    console.error("Gemini API error:", error);
    return welcomeMessage;
  }
}
