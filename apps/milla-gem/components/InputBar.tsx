import React, { useState, useEffect, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { 
  createSubmitHandler, 
  createMicClickHandler, 
  createImageChangeHandler,
  createMicButtonIcon 
} from '@millacore/shared-ui';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  attachedImage: string | null;
  setAttachedImage: (image: string | null) => void;
  isConnecting: boolean;
  isConnected: boolean;
  startConversation: () => void;
  stopConversation: () => void;
}

const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
    </svg>
);


export const InputBar: React.FC<InputBarProps> = ({ 
    onSendMessage, 
    isLoading, 
    attachedImage, 
    setAttachedImage,
    isConnecting,
    isConnected,
    startConversation,
    stopConversation,
}) => {
  const [text, setText] = useState('');
  const { isListening, transcript, startListening, stopListening, hasSpeechRecognition } = useSpeech();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLive = isConnecting || isConnected;

  useEffect(() => {
    // This effect is for the old speech-to-text, which we might still want as a fallback
    // if the user doesn't want a full conversation.
    if (transcript && isListening) {
      setText(transcript);
    }
  }, [transcript, isListening]);

  // Use shared handlers
  const handleSubmit = createSubmitHandler(text, attachedImage, onSendMessage, setText);
  const handleMicClick = createMicClickHandler(isConnected, isConnecting, startConversation, stopConversation);
  const handleImageChange = createImageChangeHandler(setAttachedImage);
  const MicButtonIcon = () => createMicButtonIcon(isConnected, StopIcon);


  return (
    <div>
      {attachedImage && !isLive && (
        <div className="relative inline-block mb-2">
            <img 
                src={attachedImage} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded-lg"
            />
            <button
                onClick={() => setAttachedImage(null)}
                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Remove image"
            >
                <span className="material-symbols-outlined !text-base">close</span>
            </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="relative">
        <input
          className="w-full bg-gray-200 dark:bg-gray-700 border-transparent rounded-lg py-3 pl-12 pr-24 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary"
          placeholder={isConnected ? 'Live conversation is active...' : isConnecting ? 'Connecting live conversation...' : 'Type a message...'}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading || isLive}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isLive}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="material-symbols-outlined">attach_file</span>
            </button>
             <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept="image/*" 
                onChange={handleImageChange}
            />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isLoading || isConnecting}
              className={`p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isConnected 
                    ? 'text-red-500' 
                    : isConnecting 
                    ? 'text-blue-500 animate-pulse' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
              }`}
            >
              <MicButtonIcon />
            </button>
          <button
            type="submit"
            disabled={isLoading || isLive || (!text.trim() && !attachedImage)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </div>
  );
};