'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, Menu, X, Settings, HelpCircle, LogOut, ShieldAlert, ChevronDown, User, UserCircle, Bell, MessageSquare, FileText, Home } from 'lucide-react';
import { AlertModal } from '../ui/AlertModal';
import { handleLogout, logout } from '@/lib/action';

export default function DashboardMobileNav({ links, user, role, estateName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout action
  const handleLogoutAction = async () => {
      await handleLogout();
      router.push('/auth/login');
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Dropdown items with icons and badges
  const dropdownItems = [
    {
      icon: User,
      label: 'My Profile',
      href: `/dashboard/${role}/profile`,
      badge: null
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: `/dashboard/${role}/notifications`,
      badge: 3 // Example: 3 unread notifications
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      href: `/dashboard/${role}/messages`,
      badge: 5 // Example: 5 unread messages
    },
    {
      icon: FileText,
      label: 'My Documents',
      href: `/dashboard/${role}/documents`,
      badge: null
    },
    {
      icon: Settings,
      label: 'Settings',
      href: `/dashboard/${role}/settings`,
      badge: null
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      href: `/dashboard/${role}/help`,
      badge: null
    }
  ];

  return (
    <>
      <nav className="lg:hidden bg-background-light dark:bg-background-dark sticky top-0 z-50 transition-colors backdrop-blur-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-slate-600 rounded-lg p-1.5 text-white">
              <Building2 className="size-5" />
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
            
            {/* Profile Picture with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="relative">
                  <div className="size-8 rounded-full bg-slate-300 dark:bg-slate-700 bg-cover bg-center shadow-sm border-2 border-transparent group-hover:border-[#1241a1] transition-all" 
                    style={{ backgroundImage: `url(${user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop'})` }}>
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                </div>
                <ChevronDown className={`size-4 text-slate-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Section */}
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="size-12 rounded-full bg-slate-300 dark:bg-slate-700 bg-cover bg-center shadow-sm" 
                          style={{ backgroundImage: `url(${user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop'})` }}>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">{estateName || 'Lekki Phase 1'}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium capitalize">{role || 'resident'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Options with Badges */}
                  <div className="p-2 max-h-[400px] overflow-y-auto">
                    {dropdownItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-[#1241a1]/10 hover:text-[#1241a1] dark:hover:bg-[#1241a1]/20 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="size-5 text-slate-400 group-hover:text-[#1241a1] dark:group-hover:text-[#1241a1] transition-colors" />
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

                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
                    >
                      <LogOut className="size-5 text-red-500 group-hover:scale-110 transition-transform" />
                      <span>Logout</span>
                    </button>
                  </div>

                  {/* Footer with item count */}
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium">
                      {dropdownItems.length} menu items • v2.1.0
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white dark:bg-slate-800 rounded-lg transition-colors shadow-sm"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-100 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={closeMenu}>
          <div 
            className="fixed inset-y-0 right-0 w-[280px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-110 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#1241a1] rounded-lg p-1.5 text-white">
                  <Building2 className="size-5" />
                </div>
                <span className="font-bold text-lg tracking-tight">Elite Towers</span>
              </div>
              <button 
                onClick={closeMenu}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white dark:bg-slate-800 rounded-lg transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center p-4 bg-white dark:bg-slate-800 m-4 rounded-2xl shadow-sm">
              <div className="size-10 rounded-full bg-slate-300 dark:bg-slate-700 bg-cover bg-center" style={{ backgroundImage: `url(${user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop'})` }}></div>
              <div className="ml-3">
                <Link href={`/dashboard/${role}/profile`} onClick={closeMenu}>
                  <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{user?.name || 'User'}</p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{estateName || 'Lekki Phase 1'}</p>
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
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
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`size-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 bg-white dark:bg-slate-800/50 mt-auto">
              <div className="flex items-center justify-around mb-4">
                <Link href={`/dashboard/${role}/settings`} onClick={closeMenu} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#1241a1] transition-colors shadow-sm">
                  <Settings className="w-5 h-5" />
                </Link>
                <Link href={`/dashboard/${role}/help`} onClick={closeMenu} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#1241a1] transition-colors shadow-sm">
                  <HelpCircle className="w-5 h-5" />
                </Link>
                <Link href={`/dashboard/${role}/notifications`} onClick={closeMenu} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#1241a1] transition-colors shadow-sm relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    3
                  </span>
                </Link>
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