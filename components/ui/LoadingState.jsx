import React from 'react';

export function LoadingState({ message = 'Loading intelligence...' }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 border-4 border-slate-100 dark:border-slate-900 border-t-[#1241a1] rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 font-semibold tracking-widest uppercase text-xs">{message}</p>
      </div>
    </div>
  );
}
