import React from 'react';
import { ToolCall, ColabResult } from '../types';
import { ColabIcon } from './icons/ColabIcon';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="bg-background-dark rounded-md p-2 text-xs overflow-x-auto font-mono text-gray-200">
    <code>{code}</code>
  </pre>
);

export const ColabResultCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { args, status, result, error } = toolCall;
  const colabResult: ColabResult | undefined = result;
  const isDraft = status === 'pending_confirmation';

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Executing code...</span>
            </div>
        </div>
     );
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <ColabIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Code Execution Failed</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300 font-mono">{error}</p>
        </div>
     );
  }

  if (!colabResult) {
    return null; 
  }

  const cardColorClass = isDraft
    ? 'bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700'
    : 'bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700';

  return (
    <div className={`mt-2 rounded-lg w-full max-w-sm md:max-w-md border ${cardColorClass}`}>
        <div className="flex items-center gap-2 p-2 border-b border-inherit">
            <ColabIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {isDraft ? 'Confirm Code Execution' : 'Code Execution Result'}
            </span>
        </div>
        <div className="p-2 space-y-2">
            <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    {isDraft ? 'Code to Execute' : 'Input Code'}
                </h4>
                <CodeBlock code={colabResult.code} />
            </div>
            {!isDraft && (
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Output</h4>
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans bg-white dark:bg-gray-700/50 p-2 rounded-md">
                        {colabResult.output}
                    </pre>
                </div>
            )}
        </div>
    </div>
  );
};