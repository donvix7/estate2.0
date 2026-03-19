'use client'

import React from 'react'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'
import DashboardMobileNav from '@/components/dashboard/MobileNav'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Wallet, 
  Megaphone, 
  Settings, 
  Map,
  Siren,
  Scan,
  Search
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const adminLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/scan', label: 'QR Scanner', icon: Scan },
    { href: '/dashboard/admin/users', label: 'Residents', icon: Users },
    { href: '/dashboard/admin/security', label: 'Security Logs', icon: Shield },
    { href: '/dashboard/admin/finance', label: 'Finance', icon: Wallet },
    { href: '/dashboard/admin/announcements', label: 'Broadcast', icon: Megaphone },
    { href: '/dashboard/admin/lost_and_found', label: 'Lost & Found', icon: Search },
    {href: `/dashboard/admin/emergencies`, label: 'Emergency', icon: Siren},
    { href: '/dashboard/admin/map', label: 'Map', icon: Map }, 
    { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
  ];

  const userData = {
    name: 'Admin User',
    role: 'Senior Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col lg:flex-row bg-white/90 dark:bg-gray-950 rounded-xl p-6 shadow-md">
      {/* Sidebar Navigation */}
      <DashboardSidebar links={adminLinks} user={userData} role="admin" estateName="Lekki Phase 1" />
      
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Navigation / Mobile Nav */}
        <DashboardMobileNav links={adminLinks} user={userData} role="admin" estateName="Lekki Phase 1" />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
          <div className="flex items-center justify-around h-20 max-w-lg mx-auto">
            <Link href="/dashboard/admin" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/admin' ? 'text-[#1241a1]' : 'text-slate-500'}`}>
              <span className="material-symbols-outlined fill-1">dashboard</span>
              <span className="text-[10px] font-bold">Dashboard</span>
            </Link>
            <Link href="/dashboard/admin/security" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/admin/security' ? 'text-[#1241a1]' : 'text-slate-500'}`}>
              <span className="material-symbols-outlined">receipt_long</span>
              <span className="text-[10px] font-medium">Logs</span>
            </Link>
            <Link href="/dashboard/admin/users" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/admin/users' ? 'text-[#1241a1]' : 'text-slate-500'}`}>
              <span className="material-symbols-outlined">group</span>
              <span className="text-[10px] font-medium">Residents</span>
            </Link>
            <Link href="/dashboard/admin/services" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/admin/services' ? 'text-[#1241a1]' : 'text-slate-500'}`}>
              <span className="material-symbols-outlined">settings_suggest</span>
              <span className="text-[10px] font-medium">Services</span>
            </Link>
            <button 
              onClick={() => {
                // This could trigger the mobile menu if needed, 
                // but for now let's just use the existing MobileNav button if it exists
              }}
              className="flex flex-col items-center gap-1 text-slate-500"
            >
              <span className="material-symbols-outlined">more_horiz</span>
              <span className="text-[10px] font-medium">More</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
