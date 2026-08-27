import React from 'react';
import { Search } from 'lucide-react';

export function FilterBar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search...", 
  statusFilter, 
  onStatusChange, 
  statusOptions = [],
  children
}) {
  return (
    <div className="bg-[#1a1d23]/40 bg-[#2a2d33]/30 backdrop-blur-md rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between border-none shadow-sm">
      
      {/* Optional Left Action Area (Tabs, Toggles) */}
      {children && (
        <div className="shrink-0 w-full sm:w-auto">
          {children}
        </div>
      )}
      
      {/* Search Input */}
      {onSearchChange && (
        <div className="relative flex-1 w-full max-w-lg">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#1a1d23]/90 bg-[#0B0C11] text-white text-white focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all border-none outline-none font-semibold shadow-inner"
          />
          <Search className="w-5 h-5 text-[#8a8f98] absolute left-4 top-3" />
        </div>
      )}

      {/* Select Dropdown */}
      {onStatusChange && statusOptions.length > 0 && (
        <div className="relative min-w-[180px]">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 rounded-xl bg-[#1a1d23]/90 bg-[#0B0C11] border-none text-white text-white focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all cursor-pointer outline-none font-semibold shadow-inner"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white0">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      )}
      
    </div>
  );
}

