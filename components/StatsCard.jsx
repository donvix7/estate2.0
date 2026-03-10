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
    <div className=" relative flex justify-between gap-4 dark:bg-slate-900/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur rounded-3xl p-6 hover:scale-105 transition-all border-none">
     
      <div className="pr-20 mb-2">
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 ">{title}</p>
        <p className="text-gray-900 dark:text-white font-bold text-2xl mt-2">{value}</p>
      {subtext && <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{subtext}</p>}
      </div>
     <div className={ `absolute top-4 right-4 p-3 rounded-xl h-12 block ${colorClasses}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
