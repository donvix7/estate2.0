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
  const { prompt: sessionRefreshPrompt } = useTokenRefresh();

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
    <div className="flex min-h-screen flex-col bg-[#111318] font-sans text-white lg:flex-row">
      {sessionRefreshPrompt}
      <DashboardSidebar links={securityLinks} user={userData} role="security" estateName="Lekki Phase 1" />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
        <DashboardMobileNav links={securityLinks} user={userData} role="security" estateName="Lekki Phase 1" />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 pb-32 sm:p-6 sm:pb-32 lg:p-8">
          {children}
        </main>

        <BottomNav pathname={pathname} links={securityLinks} />
      </div>
    </div>
  )
}
