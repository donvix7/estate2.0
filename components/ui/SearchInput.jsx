import React from 'react';
import { Search } from 'lucide-react';

export function SearchInput({ value, onChange, placeholder = 'Search...', className = '', color = 'blue' }) {
  return (
    <div className={`relative flex-1 min-w-0 ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <Search className="size-4 text-[#8a8f98]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-none bg-[#1a1d23]/50 bg-[#0B0C11] py-2.5 pl-10 pr-4 text-sm text-white text-white placeholder:text-white0 focus:ring-2 focus:ring-slate-400/20 transition-all outline-none font-medium shadow-inner"
      />
    </div>
  );
}

