'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorFallback({ error, resetErrorBoundary }) {

  const handleRefresh = () => {
    window.location.reload();
  }
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 w-full h-full flex-1">
      <div 
        className=" w-fit bg-[#1a1d23] p-8 rounded-3xl shadow-xl shadow-red-100/50 shadow-red-900/10 text-center"
      >
        <div className="p-4 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-6 w-fit">
          <AlertTriangle className="size-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Something went wrong!</h3>
        <p className="text-white0 text-[#8a8f98] mb-8 text-sm">{error?.message || "An unexpected error occurred while loading this page."}</p>
        
        <button 
          onClick={handleRefresh} 
          className="w-full flex items-center justify-center gap-2 bg-[#1241a1] text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-blue-700 group"
        >
          <RefreshCw className="size-5 group-hover:rotate-180 transition-transform duration-500" />
          Try Again
        </button>
      </div>
    </div>
  )
}
