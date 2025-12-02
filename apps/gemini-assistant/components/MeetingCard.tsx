import React from 'react';
import { ToolCall, GoogleCalendarEvent } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { GoogleCalendarIcon } from './icons/GoogleCalendarIcon';

// A helper to format the date/time string from the simulated API response.
const formatEventTime = (isoString: string): string => {
    return new Date(isoString).toLocaleString(undefined, {
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
};


export const MeetingCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { args, status, result, error } = toolCall;
  const event: GoogleCalendarEvent | undefined = result;
  
  const isDraft = status === 'pending_confirmation';

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Scheduling "{args.title || event?.summary}"...</span>
            </div>
        </div>
     )
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Schedule Meeting</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }

  if (!event) {
    return null; // Should not happen in a success state
  }
  
  const cardColorClass = isDraft
    ? 'bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700'
    : 'bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700';

  return (
    <div className={`mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border ${cardColorClass}`}>
        <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {isDraft ? 'Confirm New Event' : 'Event Created'}
            </span>
        </div>
        <div>
            <p className="font-bold text-gray-800 dark:text-gray-200">{event.summary}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatEventTime(event.start.dateTime)}
            </p>
            {event.attendees && event.attendees.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    With: {event.attendees.map(a => a.email).join(', ')}
                </p>
            )}
        </div>
        {!isDraft && (
            <a 
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            >
                <GoogleCalendarIcon className="h-5 w-5" />
                View on Google Calendar
            </a>
        )}
    </div>
  );
};