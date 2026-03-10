'use client'

import React from 'react'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'
import DashboardMobileNav from '@/components/dashboard/MobileNav'

import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Wallet, 
  Megaphone, 
  Settings, 
  Map,
  Siren,
  Scan
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const adminLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/scan', label: 'QR Scanner', icon: Scan },
    { href: '/dashboard/admin/users', label: 'Residents', icon: Users },
    { href: '/dashboard/admin/security', label: 'Security Logs', icon: Shield },
    { href: '/dashboard/admin/finance', label: 'Finance', icon: Wallet },
    { href: '/dashboard/admin/announcements', label: 'Broadcast', icon: Megaphone },
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
