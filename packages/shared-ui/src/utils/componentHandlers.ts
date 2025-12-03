/**
 * Component-specific handler utilities
 */

// Voice selection
export interface Voice {
  uri: string;
  name: string;
}

/**
 * Create a voice selection handler
 * @param voices - Available voices
 * @param onVoiceChange - Callback when voice changes
 * @returns Change handler
 */
export function createVoiceSelectHandler(
  voices: Voice[],
  onVoiceChange: (voice: Voice | null) => void
) {
  return (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceURI = e.currentTarget.value;
    if (!voiceURI) {
      onVoiceChange(null);
    } else {
      const voice = voices.find(v => v.uri === voiceURI);
      onVoiceChange(voice || null);
    }
  };
}

/**
 * Create a persona save handler
 * @param persona - Current persona text
 * @param onSystemInstructionChange - Callback to update system instructions
 * @returns Click handler
 */
export function createPersonaSaveHandler(
  persona: string,
  onSystemInstructionChange: (instruction: string) => void
) {
  return () => {
    onSystemInstructionChange(persona);
  };
}

// Navigation handlers
/**
 * Create navigation handlers for step-based interfaces
 * @param currentIndex - Current step index
 * @param setCurrentIndex - State setter for index
 * @param maxIndex - Maximum allowed index
 * @returns Object with handleNext and handlePrev
 */
export function createNavigationHandlers(
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  maxIndex: number
) {
  return {
    handleNext: () => {
      setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    },
    handlePrev: () => {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    },
  };
}

// To-do list item check handler
/**
 * Create a to-do item check handler
 * @param isInteractive - Whether items can be checked
 * @param setCompletingItems - State setter for completing items
 * @param onExecuteAction - Action execution callback
 * @returns Item check handler
 */
export function createItemCheckHandler(
  isInteractive: boolean,
  setCompletingItems: React.Dispatch<React.SetStateAction<string[]>>,
  onExecuteAction: (action: string, args: any) => void
) {
  return (item: string) => {
    if (!isInteractive) return;
    setCompletingItems(prev => [...prev, item]);
    onExecuteAction('remove_from_to_do_list', { item });
  };
}
