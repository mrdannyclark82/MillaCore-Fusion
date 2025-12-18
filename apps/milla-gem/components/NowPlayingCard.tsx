import React from 'react';
import { ToolCall } from '../types';
import { SpotifyIcon } from './icons/SpotifyIcon';

export const NowPlayingCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { args, status, result, error } = toolCall;
  const isDraft = status === 'pending_confirmation';

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Finding music...</span>
            </div>
        </div>
     )
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <SpotifyIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Play Music</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }
  
  const cardColorClass = isDraft
    ? 'bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700'
    : 'bg-green-950/20 dark:bg-gray-800 border-green-200 dark:border-gray-700';

  const track = result?.track || args.track;
  const artist = result?.artist || args.artist;
  const albumArt = result?.albumArt || 'https://placehold.co/128x128/191414/1DB954?text=Music';

  return (
    <div className={`mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border ${cardColorClass}`}>
        <div className="flex items-center gap-4">
            <img src={albumArt} alt="Album art" className="h-20 w-20 rounded-md object-cover" />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">
                    {isDraft ? 'Ready to Play' : 'Now Playing'}
                </p>
                <p className="font-bold text-gray-900 dark:text-white truncate">{track}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{artist}</p>
            </div>
            <SpotifyIcon className="h-8 w-8 text-green-500 shrink-0" />
        </div>
    </div>
  );
};