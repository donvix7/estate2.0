

export default function LoadingScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 w-full h-full flex-1">
      <div 
        className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-100/50 dark:shadow-blue-900/20 animate-pulse"
      >
        <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400">domain</span>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">Loading</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-150"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-300"></div>
        </div>
      </div>
    </div>
  )
}
