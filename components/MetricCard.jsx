import React from 'react'

function MetricCard({ icon, label, value, trend, trendColor, bgColor, iconColor }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl shadow-sm flex flex-col gap-1 lg:gap-2 transition-all hover:shadow-xl lg:hover:-translate-y-1">
      <div className="flex items-center justify-between mb-2 lg:mb-4">
        <span className={`size-8 lg:size-12 rounded-xl lg:rounded-2xl ${bgColor} ${iconColor} flex items-center justify-center shadow-inner`}>
          {icon}
        </span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${trendColor} bg-current/5 px-2.5 py-1 rounded-full`}>{trend}</span>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 truncate">{label}</p>
      <p className="text-xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">{value}</p>
    </div>
  )
}

export default MetricCard