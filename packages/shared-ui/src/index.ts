// Date/time utilities
export { formatEventTime, formatShortDate, formatTime } from './utils/dateFormatter';

// Message parsing
export { parseMessageText } from './utils/messageParser';

// Form handlers
export { 
  createSubmitHandler,
  createMicClickHandler,
  createImageChangeHandler
} from './utils/formHandlers';

// Component handlers
export {
  createVoiceSelectHandler,
  createPersonaSaveHandler,
  createNavigationHandlers,
  createItemCheckHandler,
  type Voice
} from './utils/componentHandlers';

// App logic handlers
export {
  createConfirmToolHandler,
  createCancelToolHandler,
  createExecuteToolFromCardHandler,
  processApiResponse,
  type ToolCall,
  type ToolStatus,
  type ChatMessage,
  type GroundingSource,
  type ProcessResponseOptions
} from './utils/appLogic';

// Re-export encoding utilities for convenience in UI code
export { encode, decode } from '@millacore/shared-utils';
