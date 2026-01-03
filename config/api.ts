// API Configuration
// Uses relative URLs in production, localhost in development

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// For local development - detect if accessing from same machine or network
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Your computer's local network IP - update this if your IP changes
const LOCAL_NETWORK_IP = '192.168.1.49';

// Use localhost if accessing from same machine, otherwise use network IP
const DEV_API_URL = isLocalhost ? 'http://localhost:5000' : `http://${LOCAL_NETWORK_IP}:5000`;

// For production (when deployed)
const PROD_API_URL = '';  // Will use relative URLs with Vercel functions

export const API_BASE_URL = isDevelopment ? DEV_API_URL : PROD_API_URL;

export const API_ENDPOINTS = {
  subscribe: `${API_BASE_URL}/api/subscribe`,
  health: `${API_BASE_URL}/api/health`,
};

export default API_ENDPOINTS;
