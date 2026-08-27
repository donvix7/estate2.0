import React from 'react';

export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
      {Icon && (
        <div className="size-14 rounded-full bg-[#1a1d23] flex items-center justify-center mb-4">
          <Icon className="size-7  text-[#8a8f98]" />
        </div>
      )}
      <p className="text-sm md:text-base font-bold text-white text-white">{title}</p>
      {description && <p className="text-xs md:text-sm text-white0 text-[#8a8f98] mt-1.5  leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
