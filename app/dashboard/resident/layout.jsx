'use client'

import React from 'react'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'
import DashboardMobileNav from '@/components/dashboard/MobileNav'

import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  ShieldCheck, 
  Receipt, 
  Megaphone, 
  Search, 
  Briefcase, 
  Map
} from 'lucide-react';

export default function ResidentLayout({ children }) {
  const residentLinks = [
    { href: '/dashboard/resident', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/resident/visitors', label: 'Visitors', icon: Users },
    { href: '/dashboard/resident/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/dashboard/resident/activity', label: 'Security Logs', icon: ShieldCheck },
    { href: '/dashboard/resident/finance', label: 'Billing', icon: Receipt },
    { href: '/dashboard/resident/announcements', label: 'Announcements', icon: Megaphone, badge: 2 },
    { href: '/dashboard/resident/map', label: 'Map', icon: Map }, 
    { href: '/dashboard/resident/lost_and_found', label: 'Lost & Found', icon: Search },
    { href: '/dashboard/resident/workers', label: 'Estate Services', icon: Briefcase },
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
        {/* Top Navigation / Mobile Nav */}
        <DashboardMobileNav links={residentLinks} user={userData} role="resident" estateName="Lekki Phase 1" />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
