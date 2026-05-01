"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, Settings, HelpCircle, LogOut, ShieldAlert, User } from 'lucide-react';
import { AlertModal } from '../ui/AlertModal';

export default function DashboardSidebar({ links, user, role, estateName }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionId');
    router.push('/login');
  };

  return (
    <aside className="w-72 h-screen  bg-slate-50 dark:bg-slate-900/50 flex-col justify-between p-6 shrink-0 overflow-y-auto hidden lg:flex transition-colors">
      <div className="flex flex-col gap-8">
        {/* Branding & User */}
        <div className="flex items-center gap-3 px-2 cursor-pointer group" onClick={() => router.push('/')}>
          <div className="bg-[#1241a1] rounded-lg p-2 text-white shadow-lg shadow-[#1241a1]/20 group-hover:scale-110 transition-transform flex items-center justify-center">
            <Building2 className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight">Elite Towers</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest">{role === 'admin' ? 'Admin Console' : 'Resident Portal'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 py-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl transition-all hover:bg-slate-200 dark:hover:bg-slate-800">
          <Link href={`/dashboard/${role}/profile`} className="flex items-center gap-3 w-full">
            <div className="size-10 rounded-full bg-slate-300 dark:bg-slate-700 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              {user?.picture ? (
                <div 
                  className="size-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${user.picture})` }}
                ></div>
              ) : (
                <User className="size-6 text-slate-500 dark:text-slate-400" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-sm font-bold truncate">{user?.name || 'User'}</h2>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate">
                {role === 'admin' ? user?.role || 'Administrator' : `Unit ${user?.unitNumber || '402'} • ${user?.building || 'unknown'}`}
              </p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const iconName = typeof link.icon === 'string' ? link.icon : (link.iconName || 'dashboard');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon ? (
                    <link.icon className={`size-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  ) : (
                    <Building2 className={`size-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  )}
                  <span className="text-sm font-semibold">{link.label}</span>
                </div>
                {link.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-[#1241a1]' : 'bg-[#1241a1] text-white'}`}>{link.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="flex flex-col gap-4">
        {role === 'resident' && (
          <Link href={`/dashboard/${role}/emergency`} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all active:scale-95">
            <ShieldAlert className="size-4" />
            Emergency Contact
          </Link>
        )}
        <div className="flex items-center justify-between px-2 text-slate-500 dark:text-slate-400">
          <Link href={`/dashboard/${role}/settings`} className="cursor-pointer hover:text-[#1241a1] transition-colors p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" title="Settings">
            <Settings className="size-5" />
          </Link>
          <button className="cursor-pointer hover:text-[#1241a1] transition-colors p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" title="Help">
            <HelpCircle className="size-5" />
          </button>
          <button className="cursor-pointer hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg" onClick={() => setShowLogoutConfirm(true)} title="Logout">
            <LogOut className="size-5" />
          </button>
        </div>
      </div>

      <AlertModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your session?"
        confirmText="Logout"
        type="warning"
        showCancel={true}
      />
    </aside>
  );
}
