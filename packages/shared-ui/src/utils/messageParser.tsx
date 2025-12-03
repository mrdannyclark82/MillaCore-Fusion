/**
 * Message text parsing utilities
 */

/**
 * Parse message text and extract code blocks
 * @param text - The message text to parse
 * @param CodeBlock - React component for rendering code blocks
 * @returns Array of React elements
 */
export function parseMessageText(
  text: string,
  CodeBlock: React.ComponentType<{ code: string }>
): React.ReactNode[] {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith('```')) {
      const codeContent = part.replace(/```(\w*\n)?|```/g, '').trim();
      return <CodeBlock key={index} code={codeContent} />;
    }
    return <span key={index}>{part}</span>;
  });
}
