'use client'

import React, { useState, useEffect } from 'react'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardMobileNav from '@/components/dashboard/MobileNav'
import { usePathname, useSearchParams } from 'next/navigation'

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
  Wrench,
  LogIn
} from 'lucide-react'
import { getAdminData } from '@/lib/service'
import BottomNav from '@/components/dashboard/BottomNav'
import RoleGuard from '@/components/utils/Roleguard'
import { getRole } from '@/lib/action'
import { useTokenRefresh } from '@/lib/hooks/useTokenRefresh'
import { toast } from 'react-toastify'

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  useTokenRefresh();

  const adminLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/security', label: 'Security Logs', icon: Shield },
    { href: '/dashboard/admin/gates', label: 'Gates', icon: LogIn },
    { href: '/dashboard/admin/guards', label: 'Guards', icon: Users },


    { href: '/dashboard/admin/service-request', label: 'Service Requests', icon: Wrench },
    { href: '/dashboard/admin/finance', label: 'Finance', icon: Wallet },
    { href: '/dashboard/admin/announcements', label: 'Broadcast', icon: Megaphone },
    { href: '/dashboard/admin/lost_and_found', label: 'Lost & Found', icon: Search },
    { href: '/dashboard/admin/emergencies', label: 'Emergency', icon: Siren },
    { href: '/dashboard/admin/map', label: 'Map', icon: Map },
    { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
  ];

  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  useEffect(() => {
    const fetchAdminData = async () => {
    const role = await getRole();
    setRole(role);

      try {
        const data = await getAdminData();
        setUserData(data);
      } catch (error) {
        toast.error('Failed to load dashboard data. Showing cached info.');
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f13] text-white font-sans transition-colors duration-200 flex flex-col lg:flex-row">
     <RoleGuard allowedRoles={['admin']} role={role}>

      <DashboardSidebar links={adminLinks} user={userData} role="admin" estateName="Lekki Phase 1" />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-scroll">
        <DashboardMobileNav links={adminLinks} user={userData} role="admin" estateName="Lekki Phase 1" />

        <main className="flex-1 overflow-y-auto p-3 lg:p-8 pb-32 lg:pb-8">
          {children}
        </main>

        <BottomNav pathname={pathname} links={adminLinks} />
      </div>
    </RoleGuard>
    </div>
  )
}
