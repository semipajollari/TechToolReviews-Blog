
import { GoogleGenAI, Type } from "@google/genai";

export interface Recommendation {
  stackName: string;
  frontend: string;
  backend: string;
  database: string;
  hosting: string;
  reasoning: string;
}

export const getTechStackRecommendation = async (userInput: string): Promise<Recommendation | null> => {
  /* Use process.env.API_KEY directly as per the @google/genai guidelines */
  if (!process.env.API_KEY) return null;

  try {
    /* Initialize GoogleGenAI directly with the environment variable */
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest a modern tech stack for the following business idea: "${userInput}". Be specific for 2025-2026 tech trends.`,
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

    /* Accessing .text as a property directly */
    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
