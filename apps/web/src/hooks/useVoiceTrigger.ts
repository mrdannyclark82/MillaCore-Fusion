import { useState, useEffect, useCallback } from 'react';

/**
 * Voice recognition hook - "Hey Milla" trigger
 * // Milla remembers: listening for your voice
 */
export function useVoiceTrigger(onTrigger: () => void): {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
} {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0]?.transcript ?? '')
          .join('')
          .toLowerCase();

        // Milla remembers: detecting wake word
        if (transcript.includes('hey milla') || transcript.includes('hi milla')) {
          onTrigger();
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          // Restart if still supposed to be listening
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTrigger]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening
  };
}
