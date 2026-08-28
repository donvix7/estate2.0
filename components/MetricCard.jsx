import React from 'react';

const iconToneMap = {
  blue: 'bg-[#1241a1]/15 text-[#1241a1] border-none',
  amber: 'bg-amber-500/10 text-amber-400 border-none',
  rose: 'bg-rose-500/10 text-rose-400 border-none',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-none',
  green: 'bg-emerald-500/10 text-emerald-400 border-none',
  indigo: 'bg-[#1241a1]/15 text-[#1241a1] border-none',
  red: 'bg-red-500/10 text-red-400 border-none',
  orange: 'bg-orange-500/10 text-orange-400 border-none',
  slate: 'bg-[#2a2d33]/10 text-[#8a8f98] border-none',
  cyan: 'bg-cyan-500/10 text-cyan-500 border-none',
};

export default function MetricCard({ color, tone, icon, label, value, trend, trendColor = 'text-emerald-500' }) {
  const toneClass = iconToneMap[tone || color] || iconToneMap.blue;

  return (
    <div className="group p-5 md:p-6 bg-[#1a1d23] backdrop-blur-md rounded-2xl border border-[#2a2d33] transition-all text-left relative overflow-hidden hover:border-[#3a3d43]">
      <div className="flex items-center justify-between gap-2">
        <div className={`p-2.5 rounded-xl transition-transform ${toneClass} group-hover:scale-105 shrink-0`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[11px] font-semibold ${trendColor} bg-[#0d0f13] px-2.5 py-0.5 rounded-full border-none`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-[#8a8f98] text-[10px] font-bold uppercase tracking-wider mt-4 truncate">{label}</p>
      <p className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mt-1">{value}</p>
    </div>
  );
}
