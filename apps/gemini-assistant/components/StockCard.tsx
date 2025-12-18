import React, { useState, useEffect } from 'react';
import { ToolCall } from '../types';
import { executeTool } from '../services/apiService';
import { StockIcon } from './icons/StockIcon';

const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.18-3.185m-3.181-4.992-3.182-3.182a8.25 8.25 0 0 0-11.664 0l-3.18 3.185" />
  </svg>
);

const MiniLineChart: React.FC<{ data: number[] }> = ({ data }) => {
  const width = 100;
  const height = 30;
  if (!data || data.length < 2) return <div style={{ height: `${height}px` }} />;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const isUp = data[data.length - 1] >= data[0];
  const color = isUp ? '#22c55e' : '#ef4444';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
};


export const StockCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { args, status } = toolCall;
  const [result, setResult] = useState(toolCall.result);
  const [error, setError] = useState(toolCall.error);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setResult(toolCall.result);
    setError(toolCall.error);
  }, [toolCall.result, toolCall.error]);


  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(undefined);
    try {
      const newResult = await executeTool('get_stock_price', args);
      setResult(newResult);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Fetching latest price for ${args.ticker_symbol}...</span>
            </div>
        </div>
     )
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <StockIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Stock Price</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }

  return (
    <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <img src={result.logo} alt={`${result.ticker} logo`} className="h-8 w-8 object-contain" />
                <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">{result.ticker}</p>
                    <p className="text-xl font-display font-bold text-gray-900 dark:text-white">{result.price}</p>
                </div>
            </div>
             <button onClick={handleRefresh} disabled={isRefreshing} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                <RefreshIcon className={`h-5 w-5 text-gray-500 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
        </div>
        <div className="mt-2">
            <MiniLineChart data={result.history} />
        </div>
    </div>
  );
};