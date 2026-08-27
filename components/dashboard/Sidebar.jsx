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
      return 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20';
    }
    return 'text-[#8a8f98] hover:text-white hover:bg-[#1a1d23]';
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
    <aside className="w-72 h-screen bg-[#0d0f13] border-r border-[#2a2d33] flex flex-col justify-between p-6 shrink-0 overflow-y-auto hidden lg:flex transition-colors">
      <div className="flex flex-col gap-8">
        {/* Branding */}
        <div className="flex items-center gap-3 px-2 cursor-pointer group" onClick={() => router.push('/')}>
          <div className="bg-[#1241a1] rounded-lg p-2 text-white shadow-lg shadow-[#1241a1]/20 group-hover:scale-110 transition-transform flex items-center justify-center">
            <Building2 className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-white">
              EMSS
            </h1>
            <p className="text-[#8a8f98] text-xs font-semibold tracking-widest">
              {getRoleDisplay()}
            </p>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-[#1a1d23] border border-[#2a2d33] transition-all">
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
              <h2 className="text-sm font-bold truncate text-white">
                {user?.firstName || 'User'}
              </h2>
              <p className="text-xs text-[#8a8f98] capitalize">
                {estateName || 'Unknown'}
              </p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon || Building2;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${getRoleStyles(isActive)}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`size-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  <span className="text-sm font-semibold">{link.label}</span>
                </div>
                {link.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-[#1241a1]' : 'bg-[#1241a1] text-white'}`}>
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
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-3 rounded-xl font-bold text-sm hover:bg-red-500/20 border border-red-500/20 transition-all active:scale-95"
          >
            <ShieldAlert className="size-4" />
            Emergency Contact
          </Link>
        )}
        <div className="flex items-center justify-between px-2 text-[#8a8f98]">
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
