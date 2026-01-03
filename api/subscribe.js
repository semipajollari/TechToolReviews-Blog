// This file re-exports the subscribers handler for backward compatibility
// Frontend calls /api/subscribe but the main logic is in subscribers.js
import handler from './subscribers.js';

export default handler;
