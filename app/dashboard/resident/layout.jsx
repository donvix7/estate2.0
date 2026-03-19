'use client'

import React from 'react'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'
import DashboardMobileNav from '@/components/dashboard/MobileNav'
import { usePathname } from 'next/navigation'
 
import Link from 'next/link'

export default function ResidentLayout({ children }) {
  const pathname = usePathname();
  const residentLinks = [
    { href: '/dashboard/resident', label: 'Dashboard', icon: 'dashboard' },
    { href: '/dashboard/resident/visitors', label: 'Visitors', icon: 'group' },
    { href: '/dashboard/resident/maintenance', label: 'Service Requests', icon: 'construction' },
    { href: '/dashboard/resident/finance', label: 'Billing', icon: 'account_balance_wallet' },
    { href: '/dashboard/resident/announcements', label: 'Announcements', icon: 'campaign', badge: 2 },
    { href: '/dashboard/resident/map', label: 'Map', icon: 'map' }, 
    { href: '/dashboard/resident/lost_and_found', label: 'Lost & Found', icon: 'search' },
    { href: '/dashboard/resident/workers', label: 'Estate Services', icon: 'business_center' },
  ];

  const mobileLinks = [
    { href: '/dashboard/resident', label: 'Home', icon: 'home' },
    { href: '/dashboard/resident/visitors', label: 'Visitors', icon: 'group' },
    { href: '/dashboard/resident/finance', label: 'Bills', icon: 'payments' },
    { href: '/dashboard/resident/messages', label: 'Messages', icon: 'chat_bubble' },
    { href: '/dashboard/resident/profile', label: 'Profile', icon: 'account_circle' },
  ];

  const userData = {
    name: 'John Resident',
    unitNumber: 'A-101',
    building: 'Tower A',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop'
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-gray-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <DashboardSidebar links={residentLinks} user={userData} role="resident" estateName="Lekki Phase 1" />
      
      <div className="flex flex-col flex-1 min-w-0">
        <div className="hidden lg:block">
          <DashboardHeader userName={userData.name} estateName="Elite Towers" />
        </div>
        <DashboardMobileNav links={residentLinks} user={userData} role="resident" estateName="Elite Towers" />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900  pb-safe">
          <div className="max-w-md mx-auto flex justify-between items-center px-2 py-2">
            {mobileLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`flex flex-col items-center gap-1 flex-1 py-1 ${pathname === link.href ? 'text-[#1241a1]' : 'text-slate-400 dark:text-slate-500'}`}>
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="text-[10px] font-medium uppercase tracking-tighter">{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
