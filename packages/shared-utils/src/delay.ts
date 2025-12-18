/**
 * Simple delay utility
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the specified time
 */
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Delay with random jitter
 * @param baseMs - Base milliseconds
 * @param jitterMs - Additional random jitter in milliseconds
 */
export const delayWithJitter = (baseMs: number, jitterMs: number = 1000): Promise<void> => 
  delay(baseMs + Math.random() * jitterMs);
