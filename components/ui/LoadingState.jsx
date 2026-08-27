import React from 'react';

export function LoadingState({ message = 'Loading intelligence...' }) {
  return (
    <div className="min-h-screen bg-[#0d0f13] flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 border-4 border-[#2a2d33] border-[#2a2d33] border-t-[#1241a1] rounded-full animate-spin mx-auto"></div>
        <p className="text-[#8a8f98] font-semibold tracking-widest uppercase text-xs">{message}</p>
      </div>
    </div>
  );
}
