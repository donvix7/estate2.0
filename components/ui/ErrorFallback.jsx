'use client'

export default function ErrorFallback({ error, reset }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 w-full h-full flex-1">
      <div 
        className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-red-100/50 dark:shadow-red-900/10 text-center border border-slate-100 dark:border-slate-800"
      >
        <div className="w-16 h-16 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong!</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">{error?.message || "An unexpected error occurred while loading this page."}</p>
        
        <button 
          onClick={() => reset()} 
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">refresh</span>
          Try Again
        </button>
      </div>
    </div>
  )
}
