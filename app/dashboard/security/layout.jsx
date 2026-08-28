'use client'

import React, { useState, useEffect } from 'react'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardMobileNav from '@/components/dashboard/MobileNav'
import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  Shield,
  Megaphone,
  Settings,
  Map,
  Siren,
  Scan,
  Search
} from 'lucide-react'
import { getAdminData } from '@/lib/service'
import BottomNav from '@/components/dashboard/BottomNav'
import { useTokenRefresh } from '@/lib/hooks/useTokenRefresh'
import { toast } from 'react-toastify'

export default function SecurityLayout({ children }) {
  const pathname = usePathname();
  useTokenRefresh();

  const securityLinks = [
    { href: '/dashboard/security', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/security/scan', label: 'QR Scanner', icon: Scan },
    { href: '/dashboard/security/security', label: 'Security Logs', icon: Shield },
    { href: '/dashboard/security/announcements', label: 'Broadcast', icon: Megaphone },
    { href: '/dashboard/security/lost_and_found', label: 'Lost & Found', icon: Search },
    { href: '/dashboard/security/emergencies', label: 'Emergency', icon: Siren },
    { href: '/dashboard/security/map', label: 'Map', icon: Map },
    { href: '/dashboard/security/settings', label: 'Settings', icon: Settings },
  ];

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await getAdminData();
        setUserData(data);
      } catch (error) {
        toast.error('Failed to load security data. Showing cached info.');
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f13] text-white font-sans transition-colors duration-200 flex flex-col lg:flex-row">
      <DashboardSidebar links={securityLinks} user={userData} role="security" estateName="Lekki Phase 1" />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-scroll">
        <DashboardMobileNav links={securityLinks} user={userData} role="security" estateName="Lekki Phase 1" />

        <main className="flex-1 overflow-y-auto p-3 lg:p-8 pb-32 lg:pb-8">
          {children}
        </main>

        <BottomNav pathname={pathname} links={securityLinks} />
      </div>
    </div>
  )
}
