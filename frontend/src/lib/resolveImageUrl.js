/**
 * Centralized image URL resolver for the entire application
 * Prevents repeated URL patterns and ensures idempotent URL handling
 * 
 * Features:
 * - Cleans up repeated patterns like /api/admin/products/api/admin/products/...
 * - Handles multiple URL format variations
 * - Returns proper absolute URLs with API origin
 * - Idempotent: calling multiple times produces same result
 */

const API_ORIGIN = 'http://localhost:8080/api';

export function resolveImageUrl(input) {
  // Handle null, undefined, or empty strings
  if (!input || typeof input !== 'string' || input.trim() === '') {
    return '/assets/images/no_image.png';
  }

  let url = input.trim();

  // If already a complete HTTP/HTTPS URL or data URI, return as-is
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) {
    return url;
  }

  // ============================================================
  // CRITICAL: Clean up repeated path segments that cause crashes
  // ============================================================
  
  // Clean up repeated /api/admin/products patterns
  // Examples: /api/admin/products/api/admin/products/image.jpg
  //           /api/admin/products/api/admin/products/api/admin/products/image.jpg
  url = url.replace(/\/api\/admin\/products(\/api\/admin\/products)+/g, '/api/admin/products');
  
  // Clean up repeated /api/uploads patterns
  // Examples: /api/uploads/api/uploads/image.jpg
  url = url.replace(/\/api\/uploads(\/api\/uploads)+/g, '/api/uploads');
  
  // Clean up repeated /uploads patterns
  // Examples: /uploads/uploads/image.jpg
  url = url.replace(/\/uploads(\/uploads)+/g, '/uploads');
  
  // Clean up repeated /admin/products/images patterns
  url = url.replace(/\/admin\/products\/images(\/admin\/products\/images)+/g, '/admin/products/images');

  // ============================================================
  // Handle absolute OS paths (Windows/Unix) → extract filename
  // ============================================================
  if (/^[a-zA-Z]:\\/.test(url) || url.startsWith('\\\\') || url.includes('\\')) {
    // Windows absolute path or UNC path
    const parts = url.split(/\\|\//);
    url = parts[parts.length - 1]; // Get filename only
  }

  // ============================================================
  // Handle bare filenames → map to /admin/products/images/
  // ============================================================
  if (/^[^/]+\.[a-zA-Z0-9]+$/.test(url)) {
    // Bare filename like "photo.jpg"
    url = `/admin/products/images/${url}`;
  }

  // ============================================================
  // Build final URL with API origin
  // ============================================================
  
  // Already has /api prefix but not full origin
  if (url.startsWith('/api/')) {
    return `http://localhost:8080${url}`;
  }

  // /uploads/ paths - map to http://localhost:8080
  if (url.startsWith('/uploads/')) {
    return `http://localhost:8080${url}`;
  }

  // Already has /admin or other prefixes
  if (url.startsWith('/admin/')) {
    return `${API_ORIGIN}${url}`;
  }

  // Starts with / but not recognized
  if (url.startsWith('/')) {
    return `http://localhost:8080${url}`;
  }

  // Relative path - add to /api prefix
  return `${API_ORIGIN}/${url}`;
}

export default resolveImageUrl;
