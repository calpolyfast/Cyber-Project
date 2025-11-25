// Loads API URL from env or defaults to localhost
// Try not to modify this file, prioritize including a .env file and importing API_BASE_URL 
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"