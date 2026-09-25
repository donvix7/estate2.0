import React from 'react';

const colorMap = {
  indigo: 'bg-indigo-500/10 text-indigo-300',
  blue: 'bg-blue-500/10 text-blue-300',
  yellow: 'bg-yellow-500/10 text-yellow-300',
  green: 'bg-emerald-500/10 text-emerald-300',
  red: 'bg-red-500/10 text-red-300',
  amber: 'bg-amber-500/10 text-amber-300',
  purple: 'bg-purple-500/10 text-purple-300',
  orange: 'bg-orange-500/10 text-orange-300',
  slate: 'bg-[#1a1d23] text-[#c6c8ce]',
};
export function PageHeader({ title, description, icon: Icon, iconColor = 'blue', children }) {
  const iconClass = colorMap[iconColor] || colorMap.blue;

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
            <Icon className="size-[18px]" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
            {title}
          </p>
          {description && (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#a4a7af]">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
