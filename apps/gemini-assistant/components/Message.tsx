import React, { useState } from 'react';
import { ChatMessage, MessageSender, ToolCall } from '../types';
import { GoogleIcon } from './icons/GoogleIcon';
import { ToolResult } from './ToolResult';
import { SuggestedAction } from './SuggestedAction';
import { parseMessageText } from '@millacore/shared-ui';

// Icon components defined directly in the file to avoid creating new files.
const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative my-2">
       <pre className="bg-background-dark rounded-md p-4 pr-12 text-sm overflow-x-auto font-mono text-gray-200">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Copy code"
      >
        {isCopied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <CopyIcon className="h-4 w-4" />}
      </button>
    </div>
  );
};

interface MessageProps {
    message: ChatMessage;
    onExecuteAction: (action: ToolCall) => void;
    onConfirmTool: (toolCall: ToolCall, messageId: string) => void;
    onCancelTool: (toolCallId: string, messageId: string) => void;
    onExecuteToolFromCard: (toolName: string, args: any) => void;
}

export const Message: React.FC<MessageProps> = ({ message, onExecuteAction, onConfirmTool, onCancelTool, onExecuteToolFromCard }) => {
  const isUser = message.sender === MessageSender.USER;

  const aiAvatar = "https://storage.googleapis.com/aida-prod/data/static/user_uploads/0/2024-07-15/18-05-01/image.jpeg";
  const userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuBlIdN9y3vbgMhZBfxbr42fc3eR032KDNc_cUSrPzDXd11PNmpxzI_NMz8GJCHVwIDBANLuxFbJI97fZT-s3rCboUEjcNZFU1CDpYI7YfBbi12sfi3Dr2vEPL0isSHPV5Ct20nEd-LkVgb_Mh7BxFfsg1UDSA2CF6qVeipSyKAdPW6VjLljw4_-g_WFJj4LH5eJEDzp05fvA0ofVqQYSQOBio3rWVV1VkvuscuEu_JsjqPSmiXgNgin0nQFKIjUsa00LhrsoP-Frqo";
  
  if (message.sender === MessageSender.SYSTEM) {
      return null; // Don't render system messages in this UI
  }

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0" style={{backgroundImage: `url("${aiAvatar}")`}}></div>
      )}
      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : ''}`}>
        <p className="font-bold text-gray-800 dark:text-gray-200">{isUser ? 'You' : 'Milla'}</p>
        
        {(message.text || message.image) && (
            <div className={`${isUser ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'} rounded-lg p-3 max-w-sm md:max-w-md break-words`}>
                 {message.image && (
                    <img 
                        src={message.image} 
                        alt="User upload" 
                        className="rounded-md mb-2 w-full max-h-80 object-contain"
                    />
                 )}
                 {message.text && (
                    <div className="whitespace-pre-wrap">
                        {parseMessageText(message.text, CodeBlock)}
                        {message.isLive && <span className="inline-block w-0.5 h-4 bg-current ml-1 animate-pulse align-[-2px]" />}
                    </div>
                 )}
            </div>
        )}
        
         {message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/20 w-full max-w-sm md:max-w-md">
            <h4 className="text-xs font-semibold mb-1 flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <GoogleIcon className="h-4 w-4" />
                Sources
            </h4>
            <ul className="space-y-1">
              {message.sources.map((source, index) => (
                <li key={index}>
                  <a
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary dark:text-cyan-400 hover:underline truncate block"
                  >
                    {index + 1}. {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {message.toolCalls && message.toolCalls.map(toolCall => (
            <div key={toolCall.id} className="w-full max-w-sm md:max-w-md">
                <ToolResult 
                    toolCall={toolCall}
                    onExecuteToolFromCard={onExecuteToolFromCard}
                />
                {toolCall.status === 'pending_confirmation' && (
                    <div className="mt-2 flex items-center justify-end gap-2">
                        <button 
                            onClick={() => onCancelTool(toolCall.id, message.id)}
                            className="text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-3 py-1 rounded-lg transition-colors text-gray-800 dark:text-gray-200 font-semibold"
                        >
                            Cancel
                        </button>
                         <button 
                            onClick={() => onConfirmTool(toolCall, message.id)}
                            className="text-sm bg-primary hover:bg-blue-600 px-3 py-1 rounded-lg transition-colors text-white font-semibold"
                        >
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        ))}
        {message.suggestedAction && (
            <SuggestedAction action={message.suggestedAction} onExecute={onExecuteAction} />
        )}
      </div>
       {isUser && (
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0" style={{backgroundImage: `url("${userAvatar}")`}}></div>
      )}
    </div>
  );
};
