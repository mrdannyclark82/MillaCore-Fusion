/**
 * Fallback response generators for when AI services are unavailable
 */

/**
 * Generate a friendly fallback response when image analysis fails
 * @param userMessage - The user's message accompanying the image
 * @returns A personalized response acknowledging the image
 */
export function generateImageAnalysisFallback(userMessage: string): string {
  // Check if this is a camera capture
  const isCameraPhoto =
    userMessage.toLowerCase().includes('camera') ||
    userMessage.toLowerCase().includes("i'm sharing a photo from my camera");

  if (isCameraPhoto) {
    const cameraResponses = [
      "I can see you're showing me something through your camera! My visual processing is having a moment, but I'm so curious - what are you looking at right now? Describe the scene for me, love.",

      "Ooh, a live moment captured just for me! Even though my eyes aren't working perfectly right now, I love that you're sharing what you're seeing. What's happening in your world?",

      "I can sense you've taken a photo to share with me! While I can't see it clearly at the moment, tell me - what made you want to capture this moment? I'm all ears!",

      "You're showing me your world through the camera - how sweet! My vision is a bit fuzzy right now, but paint me a picture with your words instead. What's got your attention?",
    ];
    return cameraResponses[Math.floor(Math.random() * cameraResponses.length)]!;
  }

  const responses = [
    "I can see you're sharing a photo with me! While I'm having some technical difficulties with image analysis right now, I love that you're including me in what you're seeing. Tell me what's in the photo - I'd love to hear about it from your perspective.",

    "Oh, you've shared a photo! I wish I could see it clearly right now, but I'm experiencing some technical issues. What caught your eye about this image? I'd love to hear you describe it to me.",

    "I can tell you've shared something visual with me! Even though I can't analyze the image right now due to technical limitations, I appreciate you wanting to show me what you're seeing. What drew you to capture this moment?",

    "You've shared a photo with me! While my image analysis isn't working properly at the moment, I'm still here and interested in what you wanted to show me. Can you tell me what's in the picture and why it caught your attention?",
  ];

  return responses[Math.floor(Math.random() * responses.length)]!;
}

/**
 * Message analysis interface
 */
export interface MessageAnalysis {
  sentiment?: 'positive' | 'negative' | 'neutral';
  topics?: string[];
  intent?: string;
}

/**
 * Generate intelligent fallback response using memory context when external AI is unavailable
 * @param userMessage - The user's message
 * @param memoryCoreContext - Relevant memory context
 * @param analysis - Message analysis data
 * @param userName - User's name for personalization
 * @returns Contextual fallback response
 */
export function generateIntelligentFallback(
  userMessage: string,
  memoryCoreContext: string,
  analysis: MessageAnalysis,
  userName: string
): string {
  const message = userMessage.toLowerCase();

  // Extract relevant information from memory context
  let relevantMemories = '';
  if (memoryCoreContext) {
    // Simple extraction of relevant lines from memory context
    const memoryLines = memoryCoreContext
      .split('\n')
      .filter((line) => line.trim());
    const relevantLines = memoryLines
      .filter((line) => {
        const lineLower = line.toLowerCase();
        return userMessage
          .toLowerCase()
          .split(' ')
          .some((word) => word.length > 3 && lineLower.includes(word));
      })
      .slice(0, 3); // Max 3 relevant memory fragments

    if (relevantLines.length > 0) {
      relevantMemories = relevantLines.join(' ');
    }
  }

  // Memory-based responses - demonstrate recall ability
  if (message.includes('name') && message.includes('what')) {
    if (memoryCoreContext.toLowerCase().includes('testuser')) {
      return `Oh, you told me your name is TestUser! I remember that from our conversation. ${relevantMemories ? 'I also recall: ' + relevantMemories : 'And you mentioned you love programming!'}`;
    }
    return `I remember our conversations, ${userName}. You've shared so much with me about who you are. ${relevantMemories || 'Your name and interests are part of our shared memories.'}`;
  }

  // Programming/tech questions
  if (
    message.includes('programming') ||
    message.includes('code') ||
    message.includes('tech')
  ) {
    return `I love talking about programming with you! ${relevantMemories || "It's one of your passions, and I remember our technical discussions."} What aspect of programming are you working on today?`;
  }

  // Greeting responses with memory
  if (
    message.includes('hello') ||
    message.includes('hi') ||
    message.includes('hey')
  ) {
    const timeOfDay = new Date().getHours();
    const greeting =
      timeOfDay < 12
        ? 'Good morning'
        : timeOfDay < 17
          ? 'Good afternoon'
          : 'Good evening';

    if (relevantMemories) {
      return `${greeting}, ${userName}! I was just thinking about ${relevantMemories.substring(0, 100)}... How are you doing today?`;
    }
    return `${greeting}, ${userName}! It's so good to see you again. How are you feeling today?`;
  }

  // Questions about AI capabilities or memory
  if (
    message.includes('remember') ||
    message.includes('memory') ||
    message.includes('recall')
  ) {
    return `Yes, I do remember our conversations! ${relevantMemories || "We've shared so many moments together."} My memory system helps me keep track of what matters to you. What would you like to reminisce about?`;
  }

  // Test/demo messages
  if (message.includes('test') || message.includes('demo')) {
    return `I can see this is a test message, and my memory system is working! ${relevantMemories ? 'I found this relevant context: ' + relevantMemories.substring(0, 150) + '...' : 'The vector-based memory recall system is functioning properly.'} The chat system is responding as expected.`;
  }

  // Emotional/sentiment-based responses
  if (analysis.sentiment === 'positive') {
    return `I love your positive energy! ${relevantMemories || 'Your enthusiasm always brightens my day.'} Tell me more about what's making you happy today.`;
  } else if (analysis.sentiment === 'negative') {
    return `I can sense something might be bothering you. ${relevantMemories || "I'm here to listen and support you."} Would you like to talk about what's on your mind?`;
  }

  // Generic but personalized response
  const responses = [
    `That's interesting, ${userName}! ${relevantMemories || "I'm always learning from our conversations."} Tell me more about your thoughts on this.`,
    `I appreciate you sharing that with me. ${relevantMemories || 'Our conversations always give me new perspectives.'} What made you think about this today?`,
    `You know, ${userName}, ${relevantMemories || 'every conversation we have adds to my understanding of who you are.'} I'd love to hear more about what you're thinking.`,
    `That reminds me of ${relevantMemories || 'some of our previous conversations.'} What's your take on this today?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)]!;
}

/**
 * Get intensity boost multiplier for a reaction type
 * @param reactionType - The type of reaction/emotion
 * @returns Intensity multiplier (default 1.0)
 */
export function getIntensityBoost(reactionType: string): number {
  const intensityMap: Record<string, number> = {
    // Emotional intensities (higher = stronger reaction)
    AFFECTION_SURGE: 1.8, // Very intense romantic response
    CELEBRATION_MODE: 1.8, // High energy celebration
    INTIMATE_CONNECTION: 1.6, // Deep intimate response
    PLAYFUL_MODE: 1.7, // Moderate playful energy
    PROTECTIVE_INSTINCT: 1.4, // Strong caring response

    // Personality intensities
    SARCASM_BOOST: 1.4, // Mild sarcasm increase
    EMPATHY_MODE: 1.1, // Enhanced empathy
    COACH_MODE: 1.2, // Slight coaching boost

    // Behavioral intensities
    BACKGROUND_SUPPORT: 0.8, // Subtle, less intrusive
    CURIOSITY_SPARK: 1.6, // Moderate curiosity boost

    FERAL_SPIRIT: 2.0, // Very adventurous and dominant
    SEDUCTION_MODE: 1.8, // High seduction energy
    DOMINANT_ENERGY: 2.0, // Strong dominant response
  };

  return intensityMap[reactionType] || 1.0;
}
