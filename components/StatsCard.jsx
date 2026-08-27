import React from 'react';

const COLORS = {
  yellow: 'text-yellow-400 bg-yellow-400/10',
  blue: 'text-[#1241a1] bg-[#1241a1]/10',
  green: 'text-emerald-400 bg-emerald-400/10',
  purple: 'text-purple-400 bg-purple-400/10',
  red: 'text-red-400 bg-red-400/10',
  orange: 'text-orange-400 bg-orange-400/10',
  teal: 'text-[#1241a1] bg-[#1241a1]/10',
  amber: 'text-amber-400 bg-amber-400/10',
};

export default function StatsCard({ title, value, icon: Icon, color = 'amber', subtext = '' }) {
  const colorClasses = COLORS[color] || COLORS.amber;

  return (
    <div className="group relative flex justify-between gap-4 bg-[#1a1d23] rounded-md p-6 hover:bg-[#2a2d33] transition-all border border-[#2a2d33]">
      <div className="pr-20 mb-2">
        <p className="text-[#8a8f98] text-sm font-semibold mb-1">{title}</p>
        <p className="text-white font-semibold text-2xl mt-2 tracking-tight">{value}</p>
        {subtext && <p className="text-xs text-[#8a8f98] mt-2 font-semibold">{subtext}</p>}
      </div>
      <div className={`absolute top-4 right-4 p-3 rounded-md h-12 block transition-colors group-hover:bg-[#1241a1] group-hover:text-white ${colorClasses}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
