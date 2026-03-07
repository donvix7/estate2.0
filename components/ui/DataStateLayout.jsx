import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export function DataStateLayout({ 
  isLoading, 
  error, 
  onRetry, 
  emptyStateMessage = "No data available.",
  hasData,
  children 
}) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] p-16 flex justify-center items-center h-64 border-none">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] p-12 flex flex-col items-center justify-center text-center border-none">
        <AlertCircle className="w-12 h-12 text-red-500 opacity-50 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!hasData) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] p-12 flex justify-center items-center text-gray-500 dark:text-gray-400 border-none font-medium text-sm">
            {emptyStateMessage}
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] border-none overflow-hidden">
      {children}
    </div>
  );
}
