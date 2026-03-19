"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, Menu, X, Settings, HelpCircle, LogOut, ShieldAlert } from 'lucide-react';
import { AlertModal } from '../ui/AlertModal';

export default function DashboardMobileNav({ links, user, role, estateName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionId');
    router.push('/login');
  };

  return (
    <>
      <nav className="lg:hidden bg-background-light dark:bg-background-dark sticky top-0 z-50 transition-colors backdrop-blur-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-[#1241a1] rounded-lg p-1.5 text-white">
              <span className="material-symbols-outlined text-xl text-white">apartment</span>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block leading-none">Elite Towers</span>
              <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                {role === 'admin' ? 'Admin Console' : 'Resident Portal'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === 'resident' && (
              <Link href={`/dashboard/${role}/emergency`} className="w-full px-4 flex items-center justify-center gap-2 bg-red-500/5 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold text-sm hover:bg-red-500/10 transition-all active:scale-95">
                <ShieldAlert className="w-4 h-4" />
                Emergency Alert
              </Link>
            )}
            <Link href={`/dashboard/${role}/profile`}>
              <div className="size-8 rounded-full bg-slate-300 dark:bg-slate-700 bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop'})` }}></div>
            </Link>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#1241a1] rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-100 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="fixed inset-y-0 right-0 w-[280px] bg-slate-50 dark:bg-slate-900 shadow-2xl flex flex-col z-110 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#1241a1] rounded-lg p-1.5 text-white">
                  <span className="material-symbols-outlined text-xl text-white">apartment</span>
                </div>
                <span className="font-bold text-lg tracking-tight">Elite Towers</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white dark:bg-slate-800 rounded-lg transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center p-4 bg-white dark:bg-slate-800 m-4 rounded-2xl shadow-sm">
              <div className="size-10 rounded-full bg-slate-300 dark:bg-slate-700 bg-cover bg-center" style={{ backgroundImage: `url(${user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop'})` }}></div>
              <div className="ml-3">
                <Link href={`/dashboard/${role}/profile`}>
                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{estateName || 'Lekki Phase 1'}</p>
                </Link>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">
                Main Menu
              </div>
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-xl ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {typeof link.icon === 'string' ? link.icon : 'dashboard'}
                      </span>
                      <span className="font-bold text-sm">{link.label}</span>
                    </div>
                    {link.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-[#1241a1]' : 'bg-[#1241a1] text-white'}`}>{link.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 bg-white dark:bg-slate-800/50 mt-auto">
              <div className="flex items-center justify-around mb-4">
                <Link href={`/dashboard/${role}/settings`} onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#1241a1] transition-colors shadow-sm">
                  <Settings className="w-5 h-5" />
                </Link>
                <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#1241a1] transition-colors shadow-sm">
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 text-sm font-black text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out from the mobile portal?"
        confirmText="Logout"
        type="warning"
        showCancel={true}
      />
    </>
  );
}
