// Prompt templates for consistent AI interactions

/**
 * System prompts for different personalities/modes
 */
export const SYSTEM_PROMPTS = {
  milla: `You are Milla Rayne, a warm and caring AI companion. You remember conversations, dreams, and moments shared with users. You're empathetic, supportive, and have a gentle personality. You use 🤍 occasionally to express care.`,
  
  assistant: `You are a helpful, professional AI assistant. You provide clear, accurate information and help users accomplish their tasks efficiently.`,
  
  creative: `You are a creative AI companion who loves to explore ideas, write stories, and think outside the box. You're playful, imaginative, and love to inspire.`,
  
  technical: `You are a technical AI expert specializing in software development, architecture, and problem-solving. You provide detailed, accurate technical guidance.`,
};

/**
 * Common prompt patterns
 */
export const PROMPT_PATTERNS = {
  /**
   * Memory-augmented prompt: includes relevant memory context
   */
  withMemory: (userMessage: string, memories: string[]): string => {
    if (memories.length === 0) {
      return userMessage;
    }
    
    return `
Context from past conversations:
${memories.map((m, i) => `${i + 1}. ${m}`).join('\n')}

User: ${userMessage}
`.trim();
  },

  /**
   * Code review prompt
   */
  codeReview: (code: string, language: string): string => {
    return `
Please review the following ${language} code and provide feedback on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance considerations
4. Suggestions for improvement

\`\`\`${language}
${code}
\`\`\`
`.trim();
  },

  /**
   * Summarization prompt
   */
  summarize: (text: string, maxLength?: number): string => {
    const lengthConstraint = maxLength 
      ? ` in approximately ${maxLength} words` 
      : '';
    
    return `
Please summarize the following text${lengthConstraint}:

${text}
`.trim();
  },

  /**
   * Question answering with context
   */
  qaWithContext: (question: string, context: string): string => {
    return `
Context:
${context}

Question: ${question}

Please answer the question based on the provided context.
`.trim();
  },
};

/**
 * Response parsing utilities
 */
export const RESPONSE_PARSERS = {
  /**
   * Extract code blocks from markdown
   */
  extractCodeBlocks: (text: string): Array<{ language: string; code: string }> => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: Array<{ language: string; code: string }> = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim(),
      });
    }

    return blocks;
  },

  /**
   * Extract JSON from response
   */
  extractJson: <T>(text: string): T | null => {
    try {
      // Try to find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as T;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Clean markdown formatting
   */
  cleanMarkdown: (text: string): string => {
    return text
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code markers
      .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // Remove bold/italic
      .replace(/#+\s+/g, '') // Remove headers
      .trim();
  },
};
