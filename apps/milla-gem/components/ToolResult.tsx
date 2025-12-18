import React from 'react';
import { ToolCall } from '../types';
import { StockCard } from './StockCard';
import { MeetingCard } from './MeetingCard';
import { EmailCard } from './EmailCard';
import { ToDoListCard } from './ToDoListCard';
import { NewsCard } from './NewsCard';
import { PackageTrackerCard } from './PackageTrackerCard';
import { ColabResultCard } from './ColabResultCard';
import { ReminderCard } from './ReminderCard';
import { CalendarEventsCard } from './CalendarEventsCard';
import { NowPlayingCard } from './NowPlayingCard';
import { YouTubePlayer } from './YouTubePlayer';
import { ImageResultCard } from './ImageResultCard';
import { MessagingCard } from './MessagingCard';
import { CodeDebugger } from './CodeDebugger';
import { FlightCard } from './FlightCard';

interface ToolResultProps {
  toolCall: ToolCall;
  onExecuteToolFromCard: (toolName: string, args: any) => void;
}

// FIX: Implement the ToolResult component to act as a dispatcher for different tool UIs.
export const ToolResult: React.FC<ToolResultProps> = ({ toolCall, onExecuteToolFromCard }) => {
  switch (toolCall.name) {
    case 'get_stock_price':
      return <StockCard toolCall={toolCall} />;
    case 'schedule_meeting':
      return <MeetingCard toolCall={toolCall} />;
    case 'send_email':
      return <EmailCard toolCall={toolCall} />;
    case 'add_to_do_item':
    case 'get_to_do_list':
    case 'remove_from_to_do_list':
        return <ToDoListCard toolCall={toolCall} onExecuteAction={onExecuteToolFromCard} />;
    case 'get_news_headlines':
        return <NewsCard toolCall={toolCall} />;
    case 'track_package':
        return <PackageTrackerCard toolCall={toolCall} />;
    case 'execute_python_code':
        return <ColabResultCard toolCall={toolCall} />;
    case 'debug_python_code':
        if (toolCall.result?.steps || toolCall.result?.error) {
            return <CodeDebugger code={toolCall.args.code} debugResult={toolCall.result} />
        }
        return null;
    case 'set_reminder':
        return <ReminderCard toolCall={toolCall} />;
    case 'get_calendar_events':
        return <CalendarEventsCard toolCall={toolCall} />;
    case 'play_music':
        return <NowPlayingCard toolCall={toolCall} />;
    case 'play_youtube_video':
        return toolCall.status === 'success' && toolCall.result?.videoId
            ? <div className="mt-2 w-full max-w-sm md:max-w-md"><YouTubePlayer videoId={toolCall.result.videoId} /></div>
            : null;
    case 'generate_image':
        return <ImageResultCard toolCall={toolCall} />;
    case 'respond_to_google_voice':
    case 'respond_to_facebook_messenger':
        return <MessagingCard toolCall={toolCall} />;
    case 'book_flight':
        return <FlightCard toolCall={toolCall} />;
    default:
      return (
        <div className="mt-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold">Tool Result: {toolCall.name}</p>
          <pre className="text-xs mt-1 whitespace-pre-wrap">{JSON.stringify(toolCall.result || toolCall.error, null, 2)}</pre>
        </div>
      );
  }
};
