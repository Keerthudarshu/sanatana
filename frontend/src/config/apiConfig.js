/**
 * Centralized API configuration for the frontend.
 * This handles environment variables and provides fallbacks to ensure
 * the application can always reach the backend.
 */

// Supported prefixes are defined in vite.config.mjs (VITE_ and REACT_APP_)
const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  'http://56.228.81.193:8080/api';

export const API_CONFIG = {
  BASE_URL: API_BASE,
};

