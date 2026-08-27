import React from 'react';

export function Card({ children, className = '', padded = false, hoverable = false, ...props }) {
  return (
    <div
      {...props}
      className={[
        'bg-[#1a1d23]/40 bg-[#2a2d33]/30 backdrop-blur-md rounded-2xl overflow-hidden transition-all border-none shadow-sm',
        hoverable ? 'hover:shadow-xl hover:shadow-black/5 hover:shadow-black/40 hover:bg-[#1a1d23]/60 hover:bg-[#161724]' : '',
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
    <div className={`flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-none ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ icon: Icon, title, subtitle, className = '', live = false }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-[#8a8f98] shrink-0" />}
        <h3 className={`text-base font-bold text-white text-white tracking-tight ${className}`}>{title}</h3>
        {live && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 text-emerald-400 border-none">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-white0 text-[#8a8f98] mt-0.5">{subtitle}</p>}
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
    <div className={`px-5 md:px-6 py-4 border-none ${className}`}>
      {children}
    </div>
  );
}


