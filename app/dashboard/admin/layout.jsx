'use client'

import React, { useState, useEffect } from 'react'
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
  Search,
  Menu,
  Logs,
  Wrench
} from 'lucide-react';
import { getAdminData } from '@/lib/service'
import UnauthenticatedWithImage from '@/components/UnAuthenticated'
import BottomNav from '@/components/dashboard/BottomNav'
import RoleGuard from '@/components/utils/Roleguard'

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const adminLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/scan', label: 'QR Scanner', icon: Scan },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/security', label: 'Security Logs', icon: Shield },
    { href: '/dashboard/admin/service-request', label: 'Service Requests', icon: Wrench },
    { href: '/dashboard/admin/finance', label: 'Finance', icon: Wallet },
    { href: '/dashboard/admin/announcements', label: 'Broadcast', icon: Megaphone },
    { href: '/dashboard/admin/lost_and_found', label: 'Lost & Found', icon: Search },
    {href: `/dashboard/admin/emergencies`, label: 'Emergency', icon: Siren},
    { href: '/dashboard/admin/map', label: 'Map', icon: Map }, 
    { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
  ];

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await getAdminData();
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col lg:flex-row bg-white/90 dark:bg-gray-950  p-0 ">
     <RoleGuard user={userData} allowedRoles={['admin']}>
      
      <DashboardSidebar links={adminLinks} user={userData} role="admin" estateName="Lekki Phase 1" />
      
      <div className="flex flex-col flex-1 min-w-0 max-h-screen overflow-y-scroll">
        {/* Top Navigation / Mobile Nav */}
        <DashboardMobileNav links={adminLinks} user={userData} role="admin" estateName="Lekki Phase 1" />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-8 pb-32 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
       <BottomNav pathname={pathname} links={adminLinks}/>
      </div>


      </RoleGuard>
      
      
    </div>
  )
}
