import React from 'react';

const COLORS = {
  yellow: 'text-yellow-400 bg-yellow-400/10',
  blue: 'text-blue-400 bg-blue-400/10',
  green: 'text-green-400 bg-green-400/10',
  purple: 'text-purple-400 bg-purple-400/10',
  red: 'text-red-400 bg-red-400/10',
  orange: 'text-orange-400 bg-orange-400/10',
  teal: 'text-blue-400 bg-blue-400/10'
};

export default function StatsCard({ title, value, icon: Icon, color = 'blue', subtext = '' }) {
  const colorClasses = COLORS[color] || COLORS.blue;

  return (
    <div className="group relative flex justify-between gap-4 dark:bg-slate-800/30 bg-slate-100 rounded-md p-6 hover:bg-white dark:hover:bg-slate-800/50 transition-all border-none">
      <div className="pr-20 mb-2">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1 ">{title}</p>
        <p className="text-slate-900 dark:text-white font-semibold text-2xl mt-2 tracking-tight">{value}</p>
      {subtext && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">{subtext}</p>}
      </div>
     <div className={ `absolute top-4 right-4 p-3 rounded-md h-12 block transition-colors group-hover:bg-[#1241a1] group-hover:text-white ${colorClasses}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
