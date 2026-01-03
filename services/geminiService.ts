
import { GoogleGenAI } from "@google/genai";

// Fixed: Correctly initialize GoogleGenAI with the API key from environment variables as a named parameter
export const generateArticleSummary = async (content: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Resuma o seguinte conteúdo de notícia em no máximo duas frases impactantes: ${content}`,
    });
    // Fixed: response.text is a property, not a method
    return response.text?.trim() || "Sem resumo disponível.";
  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    return "Erro ao processar resumo.";
  }
};

// Fixed: Correctly initialize GoogleGenAI with the API key from environment variables as a named parameter
export const analyzeReport = async (description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise esta denúncia de um cidadão e classifique sua urgência em Baixa, Média ou Alta, explicando o porquê brevemente: ${description}`,
    });
    // Fixed: response.text is a property, not a method
    return response.text?.trim() || "Análise indisponível.";
  } catch (error) {
    console.error("Erro ao analisar denúncia:", error);
    return "Erro na análise.";
  }
};
