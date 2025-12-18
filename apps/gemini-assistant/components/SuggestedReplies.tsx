import React from 'react';

interface SuggestedRepliesProps {
  replies: string[];
  onSend: (reply: string) => void;
}

export const SuggestedReplies: React.FC<SuggestedRepliesProps> = ({ replies, onSend }) => {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-3 overflow-x-auto pb-2 -ml-1 pl-1">
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSend(reply)}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium py-1.5 px-3 rounded-full whitespace-nowrap transition-colors"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};
