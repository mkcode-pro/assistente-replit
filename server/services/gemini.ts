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

export async function generateSingleConsultation(
  message: string, 
  userProfile: UserProfile
): Promise<string> {
  try {
    // Get configurations from database
    const systemPrompt = await ConfigManager.get("ai_system_prompt", "Você é um assistente especializado em protocolos ergogênicos.");
    const temperature = parseFloat(await ConfigManager.get("ai_temperature", "0.7"));
    const model = await ConfigManager.get("ai_model", "gemini-2.5-flash");

    // Get knowledge base data
    const [products, protocols, generalKnowledge, safetyInfo] = await Promise.all([
      ConfigManager.getActiveProducts(),
      ConfigManager.getProtocolsByProfile(userProfile.goal, userProfile.gender, userProfile.experience),
      ConfigManager.getKnowledgeByCategory("general_guidelines"),
      ConfigManager.getKnowledgeByCategory("safety_info")
    ]);

    // Build knowledge context
    const productsContext = products.length > 0 ? `
PRODUTOS DISPONÍVEIS:
${products.map(p => `- ${p.name} (${p.category}): ${p.description}${p.dosageInfo ? ' | Dosagem: ' + p.dosageInfo : ''}${p.contraindications ? ' | Contraindicações: ' + p.contraindications : ''}`).join('\n')}
` : '';

    const protocolsContext = protocols.length > 0 ? `
PROTOCOLOS RECOMENDADOS PARA SEU PERFIL:
${protocols.map(p => `- ${p.title}: ${JSON.stringify(p.protocolSteps)}${p.warnings ? ' | Avisos: ' + p.warnings : ''}`).join('\n')}
` : '';

    const safetyContext = safetyInfo.length > 0 ? `
INFORMAÇÕES DE SEGURANÇA:
${safetyInfo.map(s => `- ${s.title}: ${s.content}`).join('\n')}
` : '';

    const consultationPrompt = `
SISTEMA DE CONSULTA ÚNICA - PROTOCOLO ERGOGÊNICO

PERFIL DO CLIENTE:
- Gênero: ${userProfile.gender}
- Objetivo: ${userProfile.goal}
- Preferências: ${userProfile.preferences.join(', ')}
- Idade: ${userProfile.age} anos
- Experiência: ${userProfile.experience} anos

${productsContext}${protocolsContext}${safetyContext}

CONSULTA: ${message}

INSTRUÇÕES PARA RESPOSTA:
1. Esta é uma consulta única e completa
2. Forneça um protocolo detalhado e específico
3. Use APENAS os produtos listados acima
4. Inclua todas as informações necessárias em uma única resposta
5. Estruture a resposta de forma clara e profissional
6. Inclua dosagens, timing, duração e avisos de segurança
7. Finalize indicando que a consulta está completa

IMPORTANTE: Esta é uma consulta completa e única. Não sugira continuidade de conversa.`;

    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction: systemPrompt,
        temperature,
      },
      contents: consultationPrompt,
    });

    return response.text || "Desculpe, não consegui processar sua solicitação. Tente novamente.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Erro na IA. Tente novamente em alguns instantes.");
  }
}

export async function generateInitialAnalysis(userProfile: UserProfile): Promise<string> {
  try {
    // Get configurations from database
    const systemPrompt = await ConfigManager.get("ai_system_prompt", "Você é um assistente especializado em protocolos ergogênicos.");
    const temperature = parseFloat(await ConfigManager.get("ai_temperature", "0.8"));
    const model = await ConfigManager.get("ai_model", "gemini-2.5-flash");
    const welcomeMessage = await ConfigManager.get("welcome_message", "Bem-vindo! Como posso ajudá-lo?");

    // Get relevant protocols and knowledge for this profile
    const [protocols, generalKnowledge] = await Promise.all([
      ConfigManager.getProtocolsByProfile(userProfile.goal, userProfile.gender, userProfile.experience),
      ConfigManager.getKnowledgeByCategory("general_guidelines")
    ]);

    const protocolsContext = protocols.length > 0 ? `
PROTOCOLOS DISPONÍVEIS PARA SEU PERFIL:
${protocols.slice(0, 3).map(p => `- ${p.title}: Duração ${p.duration || 'variável'}`).join('\n')}
` : '';

    const prompt = `${welcomeMessage}

Analise este perfil de usuário e forneça uma análise inicial personalizada:

PERFIL:
- Gênero: ${userProfile.gender}
- Objetivo: ${userProfile.goal}
- Preferências: ${userProfile.preferences.join(', ')}
- Idade: ${userProfile.age} anos
- Experiência: ${userProfile.experience} anos

${protocolsContext}

Forneça uma análise completa seguindo a estrutura de resposta padrão e mencione brevemente os protocolos mais adequados para este perfil.`;

    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction: systemPrompt,
        temperature,
      },
      contents: prompt,
    });

    return response.text || "Bem-vindo ao Império Pharma! Vou analisar seu perfil e fornecer recomendações personalizadas.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Erro na IA. Tente novamente em alguns instantes.");
  }
}
