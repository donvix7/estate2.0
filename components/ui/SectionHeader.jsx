import React from 'react';
import Link from 'next/link';

export function SectionHeader({color, title, subtitle, icon: Icon, action, actionHref, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-4 mb-4 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon className="size-4 text-[#8a8f98] shrink-0" />}
        <div className="min-w-0">
          <h3 className="text-sm md:text-base font-bold text-white text-white tracking-tight truncate">{title}</h3>
          {subtitle && <p className="text-xs text-white0 text-[#8a8f98] mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {actionHref ? (
        <Link
          href={actionHref}
          className={`text-${color}-600 text-${color}-500 text-xs md:text-sm font-semibold hover:text-${color}-700 hover:text-${color}-400 transition-colors whitespace-nowrap shrink-0`}
        >
          {action}
        </Link>
      ) : action ? (
        <div className="shrink-0">{action}</div>
      ) : null}
    </div>
  );
}
