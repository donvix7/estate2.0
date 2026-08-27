"use client";

import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function DashboardHeader({ userName, estateName, onMenuClick, hasNotifications }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#0d0f13] border-b border-[#2a2d33] sticky top-0 backdrop-blur-md z-40 transition-colors">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">Hello, {userName?.split(' ')[0] || 'User'}</h2>
          {estateName && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#8a8f98] uppercase tracking-widest mt-0.5">
              <span>{estateName}</span>
              <span className="size-1 bg-[#2a2d33] rounded-full"></span>
              <span className="text-[#1241a1]">Live Status</span>
            </div>
          )}  
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:flex items-center px-4 py-2 rounded-xl bg-[#1a1d23] border border-[#2a2d33] gap-2">
          <Search className="text-[#8a8f98] size-4" />
          <input 
            className="bg-transparent border-none text-white text-sm w-64 focus:ring-2 focus:ring-[#1241a1] transition-all placeholder:text-[#8a8f98] outline-none" 
            placeholder="Search resources..." 
            type="text"
          />
        </div>
        <button className="relative p-2 rounded-xl text-[#8a8f98] hover:text-white hover:bg-[#1a1d23] transition-colors">
          <Bell className="size-6" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
