"use client";

import React from 'react';

export default function DashboardHeader({ userName, estateName, onMenuClick, hasNotifications }) {
  return (
    <header className="flex items-center justify-between px-8 py-4  sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-40 transition-colors">
      <div className="flex items-center gap-4">
       
        <div>
          <h2 className="text-xl font-black tracking-tight">Good morning, {userName?.split(' ')[0] || 'User'}</h2>
          {estateName && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
              <span>{estateName}</span>
              <span className="size-1 bg-slate-400 rounded-full"></span>
              <span className="text-[#1241a1]">Live Status</span>
            </div>
          )}  
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input className="bg-slate-200 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-[#1241a1] transition-all placeholder:text-slate-500 dark:text-slate-200" placeholder="Search resources..." type="text"/>
        </div>
        <button className="relative p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
