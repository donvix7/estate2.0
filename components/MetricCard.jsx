import React from 'react'

function MetricCard({ icon, label, value, trend, trendColor, bgColor, iconColor }) {
  return (
    <div className="group p-6 bg-[#818b94]/30 dark:bg-[#818b94]/40 rounded-md transition-all cursor-pointer text-left">
      <div className="flex items-center justify-between">
        <span className={`bg-white dark:bg-slate-100  p-3 dark:text-${iconColor} font-bold rounded-md w-fit mb-4 group-hover:bg-${bgColor} group-hover:text-white transition-all`}>
          {icon}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-widest ${trendColor} bg-white/10 dark:bg-slate-900/10 px-2.5 py-1 rounded-full`}>{trend}</span>
      </div>
      <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest  truncate">{label}</p>
      <p className="text-xl lg:text-3xl font-semibold text-slate-900 dark:text-white leading-tight">{value}</p>
    </div>
  )
}

export default MetricCard