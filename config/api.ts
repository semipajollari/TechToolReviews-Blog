// API Configuration with hardened fetch wrapper

// Use Vite's import.meta.env for environment variables
const getApiBaseUrl = (): string => {
  // Check for explicitly set API URL (production)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In browser, check if we're on localhost for dev
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    
    // Local network (mobile testing on same network)
    if (hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return `http://${hostname}:5000`;
    }
  }
  
  // Production fallback - use Vercel serverless functions (same origin)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  subscribe: `${API_BASE_URL}/api/subscribe`,
  health: `${API_BASE_URL}/api/health`,
};

// Fetch with timeout
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 15000
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Type-safe API response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Safe JSON parse
export const safeParseJson = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    return data as ApiResponse<T>;
  } catch {
    return { success: false, message: 'Invalid response from server' };
  }
};

export default API_ENDPOINTS;
