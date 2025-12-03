/**
 * App-level logic utilities for chat applications
 * These are higher-level utilities that work with app state
 */

/**
 * Tool call status type
 */
export type ToolStatus = 'pending' | 'pending_confirmation' | 'success' | 'error';

/**
 * Tool call interface
 */
export interface ToolCall {
  id: string;
  name: string;
  args: any;
  status?: ToolStatus;
  result?: any;
  error?: string;
}

/**
 * Chat message interface
 */
export interface ChatMessage {
  id: string;
  text?: string;
  toolCalls?: ToolCall[];
  [key: string]: any;
}

/**
 * Create a tool confirmation handler
 * @param executeAction - Function to execute the tool action
 * @returns Confirmation handler
 */
export function createConfirmToolHandler(
  executeAction: (toolCall: ToolCall, messageId?: string) => void
) {
  return (toolCall: ToolCall, messageId: string) => {
    executeAction(toolCall, messageId);
  };
}

/**
 * Create a tool cancellation handler
 * @param setMessages - State setter for messages
 * @returns Cancellation handler
 */
export function createCancelToolHandler(
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  return (toolCallId: string, messageId: string) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId
        ? { ...m, toolCalls: m.toolCalls?.filter(tc => tc.id !== toolCallId) }
        : m
    ).filter(m => m.text || (m.toolCalls && m.toolCalls.length > 0)));
  };
}

/**
 * Create a tool execution handler from card
 * @param executeAction - Function to execute the tool action
 * @param generateId - Function to generate unique IDs
 * @returns Execution handler
 */
export function createExecuteToolFromCardHandler(
  executeAction: (toolCall: ToolCall, messageId?: string) => void,
  generateId: () => string
) {
  return (toolName: string, args: any) => {
    const newToolCall: ToolCall = {
      id: `card-action-${generateId()}`,
      name: toolName,
      args: args,
    };
    executeAction(newToolCall);
  };
}

/**
 * Grounding source from API
 */
export interface GroundingSource {
  uri: string;
  title: string;
}

/**
 * API Response processor options
 */
export interface ProcessResponseOptions {
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  speak?: (text: string, voiceUri: string) => void;
  selectedVoice?: { uri: string; name: string } | null;
  fetchSuggestedAction?: () => void;
  executeTool?: (name: string, args: any, isDraft: boolean) => any;
  getConfirmableActions?: () => string[];
  generateId: () => string;
}

/**
 * Process API response and update messages
 * This is a generic processor that can be customized per app
 * @param response - API response object
 * @param options - Processing options
 */
export function processApiResponse(
  response: any,
  options: ProcessResponseOptions
) {
  const { setMessages, speak, selectedVoice, fetchSuggestedAction, executeTool, getConfirmableActions, generateId } = options;
  
  const text = response.text;
  const functionCalls = response.functionCalls;
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

  const sources: GroundingSource[] = groundingMetadata?.groundingChunks
    ?.map((chunk: any) => chunk.web || chunk.maps)
    .filter((source: any) => source?.uri && source.title)
    .map((source: any) => ({ uri: source!.uri, title: source!.title })) || [];

  const newAiMessage: ChatMessage = {
    id: generateId(),
    sender: 'ai',
    text: text || '',
    sources: sources.length > 0 ? sources : undefined,
    toolCalls: functionCalls?.map((fc: any): ToolCall => ({
      ...fc,
      status: (getConfirmableActions && getConfirmableActions().includes(fc.name)) ? 'pending_confirmation' : 'pending',
      result: (getConfirmableActions && executeTool && getConfirmableActions().includes(fc.name)) 
        ? executeTool(fc.name, fc.args, true) 
        : undefined
    }))
  };
  
  setMessages(prev => [...prev, newAiMessage]);

  if (speak && selectedVoice && text) {
    speak(text, selectedVoice.uri);
  }
  
  // If the response is just text and not a tool call, check for a suggested action
  if (text && !functionCalls && fetchSuggestedAction) {
    fetchSuggestedAction();
  }
}
