import { ChevronRight } from "lucide-react";

export default function ServiceCard({ id, category, icon: Icon, iconColor, desc, status, statusColor }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${iconColor}`}>
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{id}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{category}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${status === 'Active' || status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'}`}>
          <span className={`size-1 rounded-full ${statusColor} ${status === 'Active' || status === 'In Progress' ? 'animate-pulse' : ''}`}></span>
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{desc}</p>
      <div className="pt-2 flex justify-end">
        <button className="text-[#1241a1] text-xs font-bold flex items-center gap-1">
          Track Status
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}