import React, { useState, useMemo } from 'react';
import { DebugResult } from '../types';
import { BugIcon } from './icons/BugIcon';

interface CodeDebuggerProps {
  code: string;
  debugResult: DebugResult;
}

const NavArrowLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const NavArrowRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);


export const CodeDebugger: React.FC<CodeDebuggerProps> = ({ code, debugResult }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const codeLines = useMemo(() => code.split('\n'), [code]);
  const totalSteps = debugResult.steps.length;
  const currentStep = debugResult.steps[currentStepIndex];
  const currentLineNumber = currentStep?.lineNumber || debugResult.error?.line || 0;

  const handleNext = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrev = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };
  
  const hasError = !!debugResult.error;

  return (
    <div className="bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-gray-700 w-full">
        <div className="flex items-center justify-between p-2 border-b border-blue-200 dark:border-gray-700">
             <div className="flex items-center gap-2">
                <BugIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Python Debugger</span>
            </div>
            {totalSteps > 0 && (
                <div className="flex items-center gap-2">
                    <button onClick={handlePrev} disabled={currentStepIndex === 0} className="p-1 rounded-md disabled:opacity-50 enabled:hover:bg-blue-100 dark:enabled:hover:bg-gray-700">
                        <NavArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono">{currentStepIndex + 1} / {totalSteps}</span>
                    <button onClick={handleNext} disabled={hasError || currentStepIndex === totalSteps - 1} className="p-1 rounded-md disabled:opacity-50 enabled:hover:bg-blue-100 dark:enabled:hover:bg-gray-700">
                        <NavArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
      
        <div className="font-mono text-xs p-2 bg-background-light dark:bg-gray-900 overflow-x-auto">
            {codeLines.map((line, index) => {
                const lineNum = index + 1;
                const isCurrentLine = lineNum === currentLineNumber && !hasError;
                const isErrorLine = lineNum === debugResult.error?.line;
                return (
                    <div key={index} className={`flex items-center gap-2 ${isCurrentLine ? 'bg-blue-200 dark:bg-blue-900/50' : ''} ${isErrorLine ? 'bg-red-200 dark:bg-red-900/50' : ''}`}>
                        <span className="w-6 text-right text-gray-500 select-none">{lineNum}</span>
                        <pre className="whitespace-pre flex-1">{line || ' '}</pre>
                    </div>
                )
            })}
        </div>

        {hasError && (
             <div className="p-2 border-t border-blue-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                <h4 className="text-xs font-bold text-red-700 dark:text-red-300">Error</h4>
                <p className="font-mono text-xs text-red-600 dark:text-red-400 mt-1">{debugResult.error?.message}</p>
            </div>
        )}

        <div className="grid grid-cols-2">
            <div className="p-2 border-t border-blue-200 dark:border-gray-700">
                <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400">Variables</h4>
                <div className="mt-1 font-mono text-xs text-gray-800 dark:text-gray-200 space-y-1">
                    {currentStep && Object.entries(currentStep.variables).map(([key, value]) => (
                        <div key={key}>
                            <span className="text-purple-600 dark:text-purple-400">{key}</span>: <span className="text-emerald-700 dark:text-emerald-400">{JSON.stringify(value)}</span>
                        </div>
                    ))}
                    {totalSteps === 0 && !hasError && <p className="text-gray-500 text-xs italic">No variables yet.</p>}
                </div>
            </div>
             <div className="p-2 border-t border-l border-blue-200 dark:border-gray-700">
                <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400">Output</h4>
                <div className="mt-1 font-mono text-xs text-gray-800 dark:text-gray-200">
                    {currentStep?.output ? 
                        <pre className="whitespace-pre">{currentStep.output}</pre> 
                        : <p className="text-gray-500 text-xs italic">No output at this step.</p>
                    }
                </div>
            </div>
        </div>
    </div>
  );
};
