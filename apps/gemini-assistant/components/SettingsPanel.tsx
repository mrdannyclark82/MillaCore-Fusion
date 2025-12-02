import React, { useState, useEffect } from 'react';
import { VoiceOption } from '../types';
import { GoogleIcon } from './icons/GoogleIcon';
import { FacebookMessengerIcon } from './icons/FacebookMessengerIcon';

interface SettingsPanelProps {
  voices: VoiceOption[];
  selectedVoice: VoiceOption | null;
  onVoiceChange: (voice: VoiceOption | null) => void;
  useGoogleSearch: boolean;
  onGoogleSearchChange: (use: boolean) => void;
  onClearChat: () => void;
  systemInstruction: string;
  onSystemInstructionChange: (instruction: string) => void;
  isGoogleConnected: boolean;
  onGoogleConnectChange: (connected: boolean) => void;
}

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  voices,
  selectedVoice,
  onVoiceChange,
  useGoogleSearch,
  onGoogleSearchChange,
  onClearChat,
  systemInstruction,
  onSystemInstructionChange,
  isGoogleConnected,
  onGoogleConnectChange,
}) => {
  const [persona, setPersona] = useState(systemInstruction);
  const [facebookConnected, setFacebookConnected] = useState(false);

  useEffect(() => {
    setPersona(systemInstruction);
  }, [systemInstruction]);

  const handleVoiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceURI = e.target.value;
    if (!voiceURI) {
      onVoiceChange(null);
    } else {
      const voice = voices.find(v => v.uri === voiceURI);
      onVoiceChange(voice || null);
    }
  };

  const handlePersonaSave = () => {
    onSystemInstructionChange(persona);
  };

  return (
    <div className="absolute top-12 right-0 w-80 bg-background-light dark:bg-gray-800 rounded-lg shadow-xl border border-black/10 dark:border-white/10 p-4 flex flex-col gap-4 z-10">
      
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Options</h3>
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
          <label htmlFor="google-search-toggle" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
            <GoogleIcon className="h-5 w-5" />
            <span>Google Search</span>
          </label>
          <button
            id="google-search-toggle"
            onClick={() => onGoogleSearchChange(!useGoogleSearch)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useGoogleSearch ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useGoogleSearch ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <select
          value={selectedVoice?.uri || ''}
          onChange={handleVoiceSelect}
          className="mt-2 w-full bg-gray-200 dark:bg-gray-700 border-transparent rounded-lg py-2 pl-3 pr-8 text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary text-sm"
        >
          <option value="">Voice Off</option>
          {voices.map(voice => (
            <option key={voice.uri} value={voice.uri}>{voice.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Integrations</h3>
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg">
            <span className="text-sm font-medium flex items-center gap-2">
                <GoogleIcon className="h-5 w-5" />
                <span>Google Services</span>
            </span>
            {isGoogleConnected ? (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-green-500 flex items-center gap-1">
                        <CheckIcon className="h-4 w-4"/> Connected
                    </span>
                    <button onClick={() => onGoogleConnectChange(false)} className="text-xs text-red-500 hover:underline">Disconnect</button>
                </div>
            ) : (
                <button onClick={() => onGoogleConnectChange(true)} className="text-sm bg-primary hover:bg-blue-600 px-3 py-1 rounded-lg transition-colors text-white font-semibold">
                    Connect
                </button>
            )}
        </div>
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg">
             <span className="text-sm font-medium flex items-center gap-2">
                <FacebookMessengerIcon className="h-5 w-5" />
                <span>Facebook Messenger</span>
            </span>
            {facebookConnected ? (
                <div className="flex items-center gap-2">
                     <span className="text-xs font-semibold text-green-500 flex items-center gap-1">
                        <CheckIcon className="h-4 w-4"/> Connected
                    </span>
                    <button onClick={() => setFacebookConnected(false)} className="text-xs text-red-500 hover:underline">Disconnect</button>
                </div>
            ) : (
                 <button onClick={() => setFacebookConnected(true)} className="text-sm bg-primary hover:bg-blue-600 px-3 py-1 rounded-lg transition-colors text-white font-semibold">
                    Connect
                </button>
            )}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Persona</h3>
        <textarea
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          rows={5}
          className="w-full bg-gray-200 dark:bg-gray-700 border-transparent rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary placeholder-gray-500"
          placeholder="Define Milla's personality and instructions..."
        />
        <button
          onClick={handlePersonaSave}
          className="w-full mt-2 text-sm bg-primary hover:bg-blue-600 px-3 py-2 rounded-lg transition-colors text-white font-semibold"
        >
            Save Persona
        </button>
      </div>
      
      <button 
        onClick={onClearChat} 
        className="w-full text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors text-gray-800 dark:text-gray-200 font-semibold"
      >
        Clear Chat
      </button>
    </div>
  );
};