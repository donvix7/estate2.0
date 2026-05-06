import React from 'react'

function MetricCard({ icon, label, value, trend, trendColor, bgColor, iconColor }) {
  return (
    <div className="group bg-slate-100 dark:bg-slate-800/30 p-4 lg:p-6 rounded-md flex flex-col gap-1 lg:gap-2 transition-all">
      <div className="flex items-center justify-between mb-2 lg:mb-4">
        <span className={`size-8 lg:size-12 rounded-md ${bgColor} ${iconColor} flex items-center justify-center transition-colors group-hover:bg-[#1241a1] group-hover:text-white`}>
          {icon}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-widest ${trendColor} bg-white/10 dark:bg-slate-900/10 px-2.5 py-1 rounded-full`}>{trend}</span>
      </div>
      <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mt-1 truncate">{label}</p>
      <p className="text-xl lg:text-3xl font-semibold text-slate-900 dark:text-white leading-tight">{value}</p>
    </div>
  )
}

export default MetricCard