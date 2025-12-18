import React, { useState } from 'react';
import { ToolCall, ToDoList } from '../types';
import { ToDoIcon } from './icons/ToDoIcon';

interface ToDoListCardProps {
    toolCall: ToolCall;
    onExecuteAction: (toolName: string, args: any) => void;
}

export const ToDoListCard: React.FC<ToDoListCardProps> = ({ toolCall, onExecuteAction }) => {
  const { args, status, result, error } = toolCall;
  const todoList: ToDoList | undefined = result;
  
  const [completingItems, setCompletingItems] = useState<string[]>([]);
  
  const isDraft = status === 'pending_confirmation';
  const isInteractive = status === 'success';

  const handleItemCheck = (item: string) => {
    if (!isInteractive) return;
    setCompletingItems(prev => [...prev, item]);
    onExecuteAction('remove_from_to_do_list', { item });
  };

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Updating to-do list...</span>
            </div>
        </div>
     )
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <ToDoIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">To-Do List</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }

  if (!todoList || !todoList.items) {
    return null; 
  }

  const cardColorClass = isDraft
    ? 'bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700'
    : 'bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700';

  return (
    <div className={`mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border ${cardColorClass}`}>
        <div className="flex items-center gap-2 mb-3">
            <ToDoIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {isDraft ? 'Confirm To-Do' : 'To-Do List'}
            </span>
        </div>
        {todoList.items.length === 0 ? (
             <p className="text-sm text-gray-500 dark:text-gray-400 italic">Your to-do list is empty!</p>
        ) : (
            <ul className="space-y-2">
                {todoList.items.map((item, index) => {
                    const isCompleting = completingItems.includes(item);
                    const isNewItem = isDraft && item === args.item;
                    
                    return (
                        <li key={index} className={`flex items-center gap-2 transition-opacity ${isCompleting ? 'opacity-50' : ''}`}>
                            <input
                                type="checkbox"
                                id={`todo-${toolCall.id}-${index}`}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                                checked={isCompleting}
                                disabled={!isInteractive || isCompleting}
                                onChange={() => handleItemCheck(item)}
                            />
                            <label 
                                htmlFor={`todo-${toolCall.id}-${index}`}
                                className={`text-sm text-gray-800 dark:text-gray-200 ${isCompleting ? 'line-through' : ''} ${isNewItem ? 'font-bold' : ''} ${isInteractive ? 'cursor-pointer' : ''}`}
                            >
                                {item}
                            </label>
                        </li>
                    )
                })}
            </ul>
        )}
    </div>
  );
};
