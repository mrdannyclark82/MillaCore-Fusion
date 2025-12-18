import React from 'react';
import { ToolCall, PackageStatus } from '../types';
import { PackageIcon } from './icons/PackageIcon';

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);


export const PackageTrackerCard: React.FC<{ toolCall: ToolCall }> = ({ toolCall }) => {
  const { args, status, result, error } = toolCall;
  const packageStatus: PackageStatus | undefined = result;
  
  const trackerSteps = ['Label Created', 'In Transit', 'Out for Delivery', 'Delivered'];

  if (status === 'pending') {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm italic text-gray-600 dark:text-gray-400">Tracking package...</span>
            </div>
        </div>
     );
  }
  
  if (error) {
     return (
        <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700/60">
             <div className="flex items-center gap-2 mb-2">
                <PackageIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Package Tracker</span>
            </div>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
     );
  }

  if (!packageStatus) {
    return null;
  }

  return (
    <div className="mt-2 p-3 rounded-lg w-full max-w-sm md:max-w-md border bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
            <PackageIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Package Status
                </span>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{packageStatus.trackingNumber}</p>
            </div>
        </div>

        <div className="mb-3">
            <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{packageStatus.status}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{packageStatus.description}</p>
        </div>

        <div className="flex items-center">
            {trackerSteps.map((step, index) => {
                const stepIndex = index + 1;
                const isCompleted = stepIndex <= packageStatus.step;
                const isCurrent = stepIndex === packageStatus.step;
                
                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                                {isCompleted ? <CheckIcon className="w-4 h-4" /> : <span className="text-xs font-bold">{stepIndex}</span>}
                            </div>
                             <p className={`mt-1 text-[10px] text-center font-semibold ${isCurrent ? 'text-primary' : 'text-gray-500'}`}>{step}</p>
                        </div>
                        {index < trackerSteps.length - 1 && (
                            <div className={`flex-1 h-1 mx-1 ${isCompleted ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
  );
};