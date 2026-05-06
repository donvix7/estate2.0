import React from 'react';

export function PageHeader({ title, description, icon: Icon, iconColor = 'blue', children }) {
  const colorMap = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    blue: 'text-[#1241a1] dark:text-[#1241a1]',
    yellow: 'text-yellow-500 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-500 dark:text-orange-400',
    slate: 'text-slate-600 dark:text-slate-400',
  };

  const iconClass = colorMap[iconColor] || colorMap.blue;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          {Icon && <Icon className={`w-8 h-8 ${iconClass}`} />}
          {title}
        </h1>
        {description && (
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
