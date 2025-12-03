import React from 'react';
import { ToolCall, SentEmail } from '../types';
import { EmailIcon } from './icons/EmailIcon';

export const EmailCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { args, status, result, error } = toolCall;
  // For a draft, the details are in `result`. For a confirmed send, they are also in `result`.
  // The `args` can serve as a fallback but `result` should be prioritized.
  const email: SentEmail | undefined = result || args;

  const isDraft = status === 'pending_confirmation';

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Sending email to {args.recipient}...</span>
            </div>
        </div>
     )
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <EmailIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Send Email</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }

  if (!email) {
    return null; // Should not happen in a success state
  }
  
  const cardColorClass = isDraft
    ? 'bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700'
    : 'bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700';

  return (
    <div className={`mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border ${cardColorClass}`}>
        <div className="flex items-center gap-2 mb-2">
            <EmailIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {isDraft ? 'Confirm Email' : 'Email Sent'}
            </span>
        </div>
        <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">To: <span className="font-medium text-gray-700 dark:text-gray-300">{email.recipient}</span></p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Subject: <span className="font-medium text-gray-700 dark:text-gray-300">{email.subject}</span></p>
            <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 p-2 bg-white dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600 line-clamp-3">
                {email.body}
            </p>
        </div>
    </div>
  );
};