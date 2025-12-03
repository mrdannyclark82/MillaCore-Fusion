/**
 * AI Service Utilities
 * Common functions for AI service implementations
 */

/**
 * Get emotional context guidance based on emotional state
 * @param emotionalState - The detected emotional state
 * @returns Contextual guidance string for the AI
 */
export function getEmotionalContext(
  emotionalState: 'positive' | 'negative' | 'neutral'
): string {
  switch (emotionalState) {
    case 'positive':
      return 'The user appears to be in a positive emotional state. Build on their energy while providing valuable insights.';
    case 'negative':
      return 'The user may be experiencing challenges or negative emotions. Be especially supportive and understanding.';
    case 'neutral':
      return 'The user appears to be in a neutral emotional state. Adapt your tone to their specific needs.';
  }
}

/**
 * Extract role character from user message
 * @param userMessage - The user's message
 * @returns Extracted role/character or null if none found
 */
export function extractRoleCharacter(userMessage: string): string | null {
  // Patterns to match role-playing requests
  const patterns = [
    /(?:act as|be a|you are|roleplay as|role-play as|pretend to be|pretend you're)\s+(?:a\s+)?([^.!?]+)/i,
    /(?:imagine you're|as if you were|like a|speaking as)\s+(?:a\s+)?([^.!?]+)/i,
    /(?:character|persona|role):\s*([^.!?]+)/i,
  ];

  for (const pattern of patterns) {
    const match = userMessage.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Check if message contains role-playing intent
 * @param userMessage - The user's message
 * @returns true if message appears to be a role-play request
 */
export function isRolePlayRequest(userMessage: string): boolean {
  const roleplayKeywords = [
    'roleplay',
    'role-play',
    'act as',
    'be a',
    'you are',
    'pretend',
    'character',
    'persona',
    "imagine you're",
    'as if you were',
    'speaking as',
  ];

  const message = userMessage.toLowerCase();
  return roleplayKeywords.some((keyword) => message.includes(keyword));
}
