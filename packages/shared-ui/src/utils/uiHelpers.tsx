/**
 * UI component helper functions
 */

/**
 * Create a MicButton icon component based on connection state
 * @param isConnected - Whether the conversation is connected
 * @param StopIcon - Stop icon component
 * @param micIconClass - CSS class for mic icon
 * @returns Icon element
 */
export function createMicButtonIcon(
  isConnected: boolean,
  StopIcon: React.ComponentType<{ className?: string }>,
  micIconClass: string = "material-symbols-outlined"
): React.ReactElement {
  if (isConnected) {
    return <StopIcon className="h-6 w-6" />;
  }
  return <span className={micIconClass}>mic</span>;
}

/**
 * Create a system instruction change handler
 * @param setSystemInstruction - State setter for system instruction
 * @returns Change handler
 */
export function createSystemInstructionChangeHandler(
  setSystemInstruction: (instruction: string) => void
) {
  return (instruction: string) => {
    setSystemInstruction(instruction);
  };
}

/**
 * Create a Google Search toggle handler
 * @param setUseGoogleSearch - State setter for Google Search
 * @returns Toggle handler
 */
export function createGoogleSearchChangeHandler(
  setUseGoogleSearch: (enabled: boolean) => void
) {
  return (enabled: boolean) => {
    setUseGoogleSearch(enabled);
  };
}
