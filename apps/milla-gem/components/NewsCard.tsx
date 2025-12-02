import React from 'react';
import { ToolCall, NewsHeadlines } from '../types';
import { NewsIcon } from './icons/NewsIcon';

export const NewsCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { args, status, result, error } = toolCall;
  const news: NewsHeadlines | undefined = result;

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Fetching news headlines...</span>
            </div>
        </div>
     );
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <NewsIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">News Headlines</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }

  if (!news || !news.articles || news.articles.length === 0) {
    return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700">
             <div className="flex items-center gap-2 mb-2">
                <NewsIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                   News for {args.topic || 'General'}
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">No headlines found for this topic.</p>
        </div>
    );
  }

  return (
    <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
            <NewsIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Top Headlines {args.topic && `on ${args.topic}`}
            </span>
        </div>
        <div className="space-y-3">
            {news.articles.map((article, index) => (
                <div key={index} className="border-t border-gray-200 dark:border-gray-700 pt-3 first:pt-0 first:border-t-0">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{article.title}</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{article.source}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{article.summary}</p>
                </div>
            ))}
        </div>
    </div>
  );
};