
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
  // Sanitize input
  const sanitizedInput = userInput.trim().slice(0, 500);
  if (sanitizedInput.length < 10) {
    return null;
  }

  try {
    // Create timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sanitizedInput }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Gemini API request failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.recommendation) {
      return data.recommendation as Recommendation;
    }
    
    console.error('Gemini API error:', data.message);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error("Gemini Error: Request timeout");
      } else {
        console.error("Gemini Error:", error.message);
      }
    } else {
      console.error("Gemini Error:", error);
    }
    return null;
  }
};
