import React from 'react'

function VisitorItem({ name, role, status, img }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/30 p-2 rounded-md transition-all">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-md overflow-hidden transition-all duration-500">
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{role}</p>
        </div>
      </div>
      <span className={`text-[10px] font-semibold uppercase tracking-widest ${status === 'In' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-400/10'} px-3 py-1 rounded-full`}>
        {status}
      </span>
    </div>
  )
}

export default VisitorItem