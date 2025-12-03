import React from 'react';
import { ToolCall } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';

interface CalendarEvent {
    summary: string;
    time: string;
}

export const CalendarEventsCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { args, status, result, error } = toolCall;
  const events: CalendarEvent[] | undefined = result?.events;

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Checking calendar...</span>
            </div>
        </div>
     );
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Calendar</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }

  return (
    <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Events for {args.date_range}
            </span>
        </div>
        {events && events.length > 0 ? (
            <ul className="space-y-2">
              {events.map((event, index) => (
                <li key={index} className="flex items-center gap-3">
                    <div className="w-1 h-10 bg-primary rounded-full"></div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{event.summary}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{event.time}</p>
                    </div>
                </li>
              ))}
            </ul>
        ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">{result?.message || 'No events found.'}</p>
        )}
    </div>
  );
};
