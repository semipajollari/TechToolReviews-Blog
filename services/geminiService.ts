
import { GoogleGenAI, Type } from "@google/genai";

export interface Recommendation {
  stackName: string;
  frontend: string;
  backend: string;
  database: string;
  hosting: string;
  reasoning: string;
}

const TIMEOUT_MS = 30000;

export const getTechStackRecommendation = async (userInput: string): Promise<Recommendation | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn('Gemini API key not configured');
    return null;
  }

  // Sanitize input
  const sanitizedInput = userInput.trim().slice(0, 500);
  if (sanitizedInput.length < 10) {
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS);
    });

    const requestPromise = ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Suggest a modern tech stack for the following business idea: "${sanitizedInput}". Be specific for 2025-2026 tech trends.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stackName: { type: Type.STRING },
            frontend: { type: Type.STRING },
            backend: { type: Type.STRING },
            database: { type: Type.STRING },
            hosting: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["stackName", "frontend", "backend", "database", "hosting", "reasoning"],
        }
      }
    });

    const response = await Promise.race([requestPromise, timeoutPromise]);
    const text = response.text;
    
    if (text) {
      const parsed = JSON.parse(text);
      // Validate response structure
      if (parsed.stackName && parsed.frontend && parsed.backend && parsed.database && parsed.hosting && parsed.reasoning) {
        return parsed as Recommendation;
      }
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Gemini Error:", error.message);
    } else {
      console.error("Gemini Error:", error);
    }
    return null;
  }
};
