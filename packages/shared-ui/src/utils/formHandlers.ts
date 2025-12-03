/**
 * Common form and input handler utilities for React components
 */

/**
 * Create a submit handler that sends text/image messages
 * @param text - Current input text
 * @param attachedImage - Optional attached image
 * @param onSendMessage - Callback to send the message
 * @param setText - State setter for text
 * @returns Form submit handler
 */
export function createSubmitHandler(
  text: string,
  attachedImage: string | null,
  onSendMessage: (text: string) => void,
  setText: (text: string) => void
) {
  return (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || attachedImage) {
      onSendMessage(text);
      setText('');
    }
  };
}

/**
 * Create a mic/conversation toggle handler
 * @param isConnected - Whether conversation is active
 * @param isConnecting - Whether conversation is connecting
 * @param startConversation - Start conversation callback
 * @param stopConversation - Stop conversation callback
 * @returns Click handler
 */
export function createMicClickHandler(
  isConnected: boolean,
  isConnecting: boolean,
  startConversation: () => void,
  stopConversation: () => void
) {
  return () => {
    if (isConnected) {
      stopConversation();
    } else if (!isConnecting) {
      startConversation();
    }
  };
}

/**
 * Create an image file change handler
 * @param setAttachedImage - State setter for attached image
 * @returns Change handler
 */
export function createImageChangeHandler(
  setAttachedImage: (image: string | null) => void
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file && typeof window !== 'undefined') {
      const reader = new window.FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
}
