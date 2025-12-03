/**
 * Maximum allowed input length for user messages
 */
export const MAX_INPUT_LENGTH = 10000;

/**
 * Validates admin token from request headers
 * @param headers - Request headers object
 * @param adminToken - Optional admin token to validate against (if not provided, returns true)
 * @returns true if token is valid or not required, false otherwise
 */
export function validateAdminToken(headers: any, adminToken?: string): boolean {
  if (!adminToken) {
    return true; // No admin token configured, allow access
  }

  // Check Authorization: Bearer header
  const authHeader = headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === adminToken) {
      return true;
    }
  }

  // Check x-admin-token header
  const xAdminToken = headers['x-admin-token'];
  if (xAdminToken === adminToken) {
    return true;
  }

  return false;
}

/**
 * Sanitizes user input by checking length
 * Note: This is a basic sanitizer - integrate with your sanitization module for full protection
 * @param input - User input string
 * @param maxLength - Maximum allowed length (defaults to MAX_INPUT_LENGTH)
 * @throws Error if input is invalid or too long
 * @returns Sanitized input string
 */
export function sanitizeUserInput(input: string, maxLength: number = MAX_INPUT_LENGTH): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: must be a non-empty string');
  }
  
  // Check length
  if (input.length > maxLength) {
    throw new Error(`Input too long: maximum ${maxLength} characters allowed`);
  }
  
  // Basic sanitization - trim whitespace
  return input.trim();
}
