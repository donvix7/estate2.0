import React from 'react';

export function Card({ children, className = '', padded = false, hoverable = false, ...props }) {
  return (
    <div
      {...props}
      className={[
        'overflow-hidden rounded-2xl border border-[#2a2d33] bg-[#15171c] shadow-sm',
        hoverable ? 'transition-colors hover:bg-[#191c22]' : '',
        padded ? 'p-5 md:p-6' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-4 border-b border-[#2a2d33] px-5 py-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ icon: Icon, title, subtitle, className = '', live = false }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-[#8a8f98] shrink-0" />}
        <h3 className={`text-sm font-semibold tracking-tight text-white ${className}`}>{title}</h3>
        {live && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs leading-5 text-[#8a8f98]">{subtitle}</p>}
    </div>
  );
}

export function CardBody({ children, className = '', padded = true }) {
  return (
    <div className={[padded ? 'p-5 md:p-6' : '', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-[#2a2d33] px-5 py-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
}

