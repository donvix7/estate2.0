'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, Menu, X, Settings, HelpCircle, LogOut, ShieldAlert, ChevronDown, User, Bell } from 'lucide-react';
import { AlertModal } from '../ui/AlertModal';
import { handleLogout } from '@/lib/action';

export default function DashboardMobileNav({ links, user, role, estateName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutAction = async () => {
    await handleLogout();
    router.push('/auth/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const dropdownItems = [
    { icon: User, label: 'My Profile', href: `/dashboard/${role}/profile`, badge: null },
    { icon: Settings, label: 'Settings', href: `/dashboard/${role}/settings`, badge: null },
    { icon: HelpCircle, label: 'Help & Support', href: `/dashboard/${role}/help`, badge: null }
  ];

  return (
    <>
      <nav className="lg:hidden bg-[#0d0f13] border-b border-[#2a2d33] sticky top-0 z-50 transition-colors backdrop-blur-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-[#1241a1] rounded-lg p-1.5 text-white">
              <Building2 className="size-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block leading-none text-white">EMSS</span>
              <span className="text-[8px] text-[#8a8f98] uppercase tracking-widest font-bold">
                {role === 'resident' ? 'Resident Portal' : role === 'security' ? 'Security Console' : 'Admin Console'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === 'resident' && (
              <Link href={`/dashboard/${role}/emergency`} className="w-full px-4 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-3 rounded-xl font-bold text-sm hover:bg-red-500/20 border border-red-500/20 transition-all active:scale-95">
                <ShieldAlert className="w-4 h-4" />
                Emergency Alert
              </Link>
            )}
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="relative">
                  <div className="size-8 rounded-full bg-[#1241a1] bg-cover bg-center shadow-sm border-2 border-transparent group-hover:border-[#1241a1] transition-all" 
                    style={{ backgroundImage: `url(${user?.avatar})` }}>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full border-2 border-[#0d0f13]"></div>
                </div>
                <ChevronDown className={`size-4 text-[#8a8f98] transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-[#1a1d23] border border-[#2a2d33] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-[#0d0f13] border-b border-[#2a2d33]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="size-12 rounded-full bg-[#1241a1] bg-cover bg-center shadow-sm" 
                          style={{ backgroundImage: `url(${user?.avatar})` }}>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 rounded-full border-2 border-[#1a1d23]"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-widest truncate">{estateName || 'Estate'}</p>
                        <p className="text-[9px] text-[#8a8f98] font-medium capitalize">{role || 'resident'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 max-h-[400px] overflow-y-auto">
                    {dropdownItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => { setIsProfileDropdownOpen(false); setIsMenuOpen(false); }}
                          className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold text-[#8a8f98] hover:bg-[#2a2d33] hover:text-white transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="size-5 text-[#8a8f98] group-hover:text-white transition-colors" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}

                    <div className="h-px bg-[#2a2d33] my-2"></div>

                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); setShowLogoutConfirm(true); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all group"
                    >
                      <LogOut className="size-5 text-red-400 group-hover:scale-110 transition-transform" />
                      <span>Logout</span>
                    </button>
                  </div>

                  <div className="px-4 py-2 bg-[#0d0f13] border-t border-[#2a2d33]">
                    <p className="text-[10px] text-[#8a8f98] text-center font-medium">
                      {dropdownItems.length} menu items
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md animate-fade-in" onClick={closeMenu}>
          <div 
            className="fixed inset-y-0 right-0 w-[280px] bg-[#0d0f13] border-l border-[#2a2d33] shadow-2xl flex flex-col z-[110] animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#2a2d33]">
              <div className="flex items-center gap-3">
                <div className="bg-[#1241a1] rounded-lg p-1.5 text-white">
                  <Building2 className="size-5" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white">EMSS</span>
              </div>
              <button 
                onClick={closeMenu}
                className="p-2 text-[#8a8f98] hover:text-white bg-[#1a1d23] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center p-4 bg-[#1a1d23] m-4 rounded-2xl border border-[#2a2d33]">
              <div className="size-10 rounded-full bg-[#1241a1] bg-cover bg-center" style={{ backgroundImage: `url(${user?.avatar})` }}></div>
              <div className="ml-3">
                <Link href={`/dashboard/${role}/profile`} onClick={closeMenu}>
                  <p className="text-sm font-black text-white leading-tight">{user?.name || 'User'}</p>
                  <p className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-widest">{estateName || 'Estate'}</p>
                </Link>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-1">
              {links?.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20'
                        : 'text-[#8a8f98] hover:bg-[#1a1d23] hover:text-white'
                    }`}
                  >
                    <Icon className={`size-5 ${isActive ? 'text-white' : 'text-[#8a8f98]'}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 bg-[#1a1d23] border-t border-[#2a2d33] mt-auto">
              <div className="flex items-center justify-around mb-4">
                <Link href={`/dashboard/${role}/settings`} onClick={closeMenu} className="p-2 rounded-xl bg-[#0d0f13] border border-[#2a2d33] text-[#8a8f98] hover:text-[#1241a1] transition-colors">
                  <Settings className="w-5 h-5" />
                </Link>
                <Link href={`/dashboard/${role}/help`} onClick={closeMenu} className="p-2 rounded-xl bg-[#0d0f13] border border-[#2a2d33] text-[#8a8f98] hover:text-[#1241a1] transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </Link>
                <button className="p-2 rounded-xl bg-[#0d0f13] border border-[#2a2d33] text-[#8a8f98] hover:text-[#1241a1] transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
              <button
                onClick={() => { setIsMenuOpen(false); setShowLogoutConfirm(true); }}
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
        onConfirm={handleLogoutAction}
        title="Confirm Logout"
        message="Are you sure you want to log out from the mobile portal?"
        confirmText="Logout"
        type="warning"
        showCancel={true}
      />
    </>
  );
}
