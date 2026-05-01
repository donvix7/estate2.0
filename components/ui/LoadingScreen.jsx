import React from 'react'
import { Building2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 w-full h-full flex-1">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <Building2 className="size-12 text-[#1241a1]" />
        <div className="flex flex-col items-center space-y-3">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">Loading</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
