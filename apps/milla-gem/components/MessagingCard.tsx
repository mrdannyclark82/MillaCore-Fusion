import React from 'react';
import { ToolCall, SentMessage } from '../types';
import { GoogleVoiceIcon } from './icons/GoogleVoiceIcon';
import { FacebookMessengerIcon } from './icons/FacebookMessengerIcon';

const toolConfig: Record<string, {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    name: string;
}> = {
    respond_to_google_voice: { icon: GoogleVoiceIcon, name: 'Google Voice' },
    respond_to_facebook_messenger: { icon: FacebookMessengerIcon, name: 'Messenger' },
};

export const MessagingCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { name, args, status, result, error } = toolCall;
  const message: SentMessage | undefined = result || args;
  const { icon: Icon, name: ServiceName } = toolConfig[name] || {};

  const isDraft = status === 'pending_confirmation';

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Sending message via {ServiceName}...</span>
            </div>
        </div>
     )
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{ServiceName}</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }

  if (!message) {
    return null;
  }
  
  const cardColorClass = isDraft
    ? 'bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700'
    : 'bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700';

  return (
    <div className={`mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border ${cardColorClass}`}>
        <div className="flex items-center gap-2 mb-2">
            {Icon && <Icon className="h-5 w-5" />}
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {isDraft ? `Confirm ${ServiceName} Message` : 'Message Sent'}
            </span>
        </div>
        <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">To: <span className="font-medium text-gray-700 dark:text-gray-300">{message.recipient}</span></p>
            <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 p-2 bg-white dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
                {message.message}
            </p>
        </div>
    </div>
  );
};