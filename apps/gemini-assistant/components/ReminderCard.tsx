import React from 'react';
import { ToolCall, Reminder } from '../types';
import { ReminderIcon } from './icons/ReminderIcon';

export const ReminderCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { args, status, result, error } = toolCall;
  const reminder: Reminder | undefined = result;
  
  const isDraft = status === 'pending_confirmation';

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Setting reminder...</span>
            </div>
        </div>
     );
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <ReminderIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Set Reminder</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }

  if (!reminder) {
    return null; // Should not happen in a success state
  }

  const cardColorClass = isDraft
    ? 'bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700'
    : 'bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700';

  return (
    <div className={`mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border ${cardColorClass}`}>
        <div className="flex items-center gap-2 mb-2">
            <ReminderIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {isDraft ? 'Confirm Reminder' : 'Reminder Set'}
            </span>
        </div>
        <div>
            <p className="font-bold text-gray-800 dark:text-gray-200">{reminder.text}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                For: {reminder.formattedTime}
            </p>
        </div>
    </div>
  );
};