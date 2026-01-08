
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
  const sanitizedInput = userInput.trim().slice(0, 500);
  if (sanitizedInput.length < 10) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response: Response | undefined;
    try {
      response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sanitizedInput }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        return null;
      }
      return null;
    }
    clearTimeout(timeoutId);
    if (!response || !response.ok) {
      return null;
    }
    let data: any;
    try {
      data = await response.json();
    } catch {
      return null;
    }
    if (!data || typeof data !== 'object') {
      return null;
    }
    if (data.success && data.recommendation) {
      if (
        typeof data.recommendation.stackName === 'string' &&
        typeof data.recommendation.frontend === 'string' &&
        typeof data.recommendation.backend === 'string' &&
        typeof data.recommendation.database === 'string' &&
        typeof data.recommendation.hosting === 'string' &&
        typeof data.recommendation.reasoning === 'string'
      ) {
        return data.recommendation as Recommendation;
      }
      return null;
    }
    return null;
  } catch {
    return null;
  }
};
