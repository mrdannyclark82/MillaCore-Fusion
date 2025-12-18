import React, { useEffect, useRef } from 'react';
import { ChatMessage, ToolCall } from '../types';
import { Message } from './Message';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onExecuteAction: (action: ToolCall) => void;
  onConfirmTool: (toolCall: ToolCall, messageId: string) => void;
  onCancelTool: (toolCallId: string, messageId: string) => void;
  onExecuteToolFromCard: (toolName: string, args: any) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onExecuteAction, onConfirmTool, onCancelTool, onExecuteToolFromCard }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
      {messages.map((msg) => (
        <Message 
            key={msg.id} 
            message={msg} 
            onExecuteAction={onExecuteAction}
            onConfirmTool={onConfirmTool}
            onCancelTool={onCancelTool}
            onExecuteToolFromCard={onExecuteToolFromCard}
        />
      ))}
      {isLoading && messages[messages.length - 1]?.text === '' && (
         <div className="flex items-start gap-4">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0" style={{backgroundImage: 'url("https://storage.googleapis.com/aida-prod/data/static/user_uploads/0/2024-07-15/18-05-01/image.jpeg")'}}></div>
            <div className="flex flex-col gap-1">
                <p className="font-bold text-gray-800 dark:text-gray-200">Milla</p>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                    <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-[pulse_1s_ease-in-out_0.2s_infinite]"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-[pulse_1s_ease-in-out_0.4s_infinite]"></span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
