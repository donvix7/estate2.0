"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, Settings, HelpCircle, LogOut, ShieldAlert, User } from 'lucide-react';
import { AlertModal } from '../ui/AlertModal';
import { handleLogout } from '@/lib/action';

export default function DashboardSidebar({ links, user, role, estateName }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleUserLogout = async () => {
    await handleLogout();
    router.push('/auth/login');
  };

  const getRoleStyles = (isActive) => {
    if (isActive) {
      return 'bg-[#1241a1]/20 text-white';
    }
    return 'text-[#a4a7af] hover:text-white hover:bg-[#1a1d23]';
  };

  const getRoleDisplay = () => {
    const roles = {
      resident: 'Resident Portal',
      security: 'Security Console',
      admin: 'Admin Console'
    };
    return roles[role] || 'Dashboard';
  };

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-[#2a2d33] bg-[#0d0f13] px-4 py-6 lg:flex">
      <div className="flex flex-col gap-7">
        {/* Branding */}
        <div className="flex items-center gap-3 px-2 cursor-pointer group" onClick={() => router.push('/')}>
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#1241a1] text-white transition-transform group-hover:scale-105">
            <Building2 className="size-5" />
          </div>
          <div>
            <span className="text-base font-bold leading-tight tracking-tight text-white">
              EMSS
            </span>
            <p className="text-[#8a8f98] text-xs font-semibold tracking-widest">
              {getRoleDisplay()}
            </p>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-xl border border-[#2a2d33] bg-[#111318] px-3 py-3">
          <Link href={`/dashboard/${role}/profile`} className="flex items-center gap-3 w-full">
            <div className="size-10 rounded-full bg-[#1241a1] flex items-center justify-center overflow-hidden shrink-0">
              {user?.displayImage ? (
                <div 
                  className="size-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${user.displayImage})` }}
                />
              ) : (
                <User className="size-6 text-white" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || user?.firstName || 'User'}
              </p>
              <p className="text-xs text-[#8a8f98] capitalize">
                {estateName || 'Unknown'}
              </p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav aria-label="Dashboard navigation" className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            const Icon = link.icon || Building2;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${getRoleStyles(isActive)}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`size-[18px] transition-colors ${isActive ? 'text-blue-300' : 'text-[#8a8f98] group-hover:text-white'}`} />
                  <span className="text-[13px] font-medium">{link.label}</span>
                </div>
                {link.badge > 0 && (
                  <span className="rounded-full bg-[#1241a1] px-2 py-0.5 text-[10px] font-semibold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="flex flex-col gap-4">
        {role === 'resident' && (
          <Link 
            href={`/dashboard/${role}/emergency`} 
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/15"
          >
            <ShieldAlert className="size-4" />
            Emergency Contact
          </Link>
        )}
        <div className="flex items-center justify-between border-t border-[#2a2d33] px-2 pt-3 text-[#8a8f98]">
          <Link 
            href={`/dashboard/${role}/settings`} 
            className="cursor-pointer hover:text-[#1241a1] transition-colors p-2 hover:bg-[#1a1d23] rounded-lg" 
            title="Settings"
          >
            <Settings className="size-5" />
          </Link>
          <button 
            className="cursor-pointer hover:text-[#1241a1] transition-colors p-2 hover:bg-[#1a1d23] rounded-lg" 
            title="Help"
          >
            <HelpCircle className="size-5" />
          </button>
          <button 
            className="cursor-pointer hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg" 
            onClick={() => setShowLogoutConfirm(true)} 
            title="Logout"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>

      <AlertModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleUserLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your session?"
        confirmText="Logout"
        type="warning"
        showCancel={true}
      />
    </aside>
  );
}
