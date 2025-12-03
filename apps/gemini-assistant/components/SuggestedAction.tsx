import React from 'react';
import { ToolCall } from '../types';
import { BugIcon } from './icons/BugIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ColabIcon } from './icons/ColabIcon';
import { EmailIcon } from './icons/EmailIcon';
import { NewsIcon } from './icons/NewsIcon';
import { PackageIcon } from './icons/PackageIcon';
import { ReminderIcon } from './icons/ReminderIcon';
import { ToDoIcon } from './icons/ToDoIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { StockIcon } from './icons/StockIcon';
import { ImageIcon } from './icons/ImageIcon';
import { SpotifyIcon } from './icons/SpotifyIcon';

interface SuggestedActionProps {
    action: ToolCall;
    onExecute: (action: ToolCall) => void;
}

const actionConfig: Record<string, {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    verb: string;
    argFormatter: (args: any) => string;
}> = {
    set_reminder: {
        icon: ReminderIcon,
        verb: 'Set Reminder',
        argFormatter: (args) => `"${args.reminder_text}" for ${args.time}`
    },
    schedule_meeting: {
        icon: CalendarIcon,
        verb: 'Schedule Meeting',
        argFormatter: (args) => `"${args.title}" at ${args.time}`
    },
    play_youtube_video: {
        icon: YouTubeIcon,
        verb: 'Play Video',
        argFormatter: (args) => `"${args.query}"`
    },
    play_music: {
        icon: SpotifyIcon,
        verb: 'Play Music',
        argFormatter: (args) => `${args.track ? `"${args.track}"` : ''} ${args.artist ? `by ${args.artist}` : ''}`.trim()
    },
    add_to_do_item: {
        icon: ToDoIcon,
        verb: 'Add To-Do',
        argFormatter: (args) => `"${args.item}"`
    },
    get_stock_price: {
        icon: StockIcon,
        verb: 'Get Price',
        argFormatter: (args) => `$${args.ticker_symbol}`
    },
    generate_image: {
        icon: ImageIcon,
        verb: 'Generate Image',
        argFormatter: (args) => `of "${args.prompt}"`
    },
     // Add more configs as needed
};

export const SuggestedAction: React.FC<SuggestedActionProps> = ({ action, onExecute }) => {
    const config = actionConfig[action.name];
    if (!config) {
        // Don't render a button for tools without a specific UI config
        return null;
    }

    const { icon: Icon, verb, argFormatter } = config;
    const summary = argFormatter(action.args);

    return (
        <div className="mt-2 w-full max-w-sm md:max-w-md">
            <button
                onClick={() => onExecute(action)}
                className="w-full flex items-center gap-2 text-left p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{verb}</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{summary}</p>
                </div>
                 <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">arrow_forward</span>
            </button>
        </div>
    );
};