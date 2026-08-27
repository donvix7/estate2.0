import React from 'react';

const colorMap = {
  indigo: 'text-indigo-600 text-indigo-400 bg-indigo-100/70 bg-indigo-900/20',
  blue: 'text-[#1241a1] text-[#1241a1] bg-[#1241a1]/10 bg-[#1241a1]/10',
  yellow: 'text-yellow-500 text-yellow-400 bg-yellow-100/70 bg-yellow-900/20',
  green: 'text-green-600 text-green-400 bg-green-100/70 bg-green-900/20',
  red: 'text-red-600 text-red-400 bg-red-100/70 bg-red-900/20',
  amber: 'text-amber-600 text-amber-400 bg-amber-100/70 bg-amber-900/20',
  purple: 'text-purple-600 text-purple-400 bg-purple-100/70 bg-purple-900/20',
  orange: 'text-orange-500 text-orange-400 bg-orange-100/70 bg-orange-900/20',
  slate: 'text-[#8a8f98] text-[#8a8f98] bg-[#1a1d23]/70 bg-[#1a1d23]/50',
};
export function PageHeader({ title, description, icon: Icon, iconColor = 'blue', children }) {
  const iconClass = colorMap[iconColor] || colorMap.blue;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-start gap-4 min-w-0">
        {Icon && (
          <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
            <Icon className="size-5" />
          </div>
        )}
        <div className="min-w-0">
          <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white text-white leading-tight">
            {title}
          </span>
          {description && (
            <p className="text-white0 text-[#8a8f98] mt-1.5 font-medium text-sm">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
