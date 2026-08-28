'use client'

import React, { useState, useEffect } from 'react'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardMobileNav from '@/components/dashboard/MobileNav'
import { usePathname, useSearchParams } from 'next/navigation'

import {
  LayoutDashboard,
  Users,
  Construction,
  Wallet,
  Megaphone,
  Map,
  Search,
  Briefcase,
  Home,
  MessageSquare,
  UserCircle
} from 'lucide-react'
import { getAnnouncements, getResidentData } from '@/lib/service'
import BottomNav from '@/components/dashboard/BottomNav'
import { getRole } from '@/lib/action'
import RoleGuard from '@/components/utils/Roleguard'
import { useTokenRefresh } from '@/lib/hooks/useTokenRefresh'
import { toast } from 'react-toastify'

export default function ResidentLayout({ children }) {
  const pathname = usePathname();
  useTokenRefresh();

  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadAnnouncements = async () => {
      const data = await getAnnouncements();
      setAnnouncements(data);
    };
    loadAnnouncements();
  }, []);

  const unreadCount = (Array.isArray(announcements) ? announcements : []).filter(a => !a.readBy).length;

  const residentLinks = [
    { href: '/dashboard/resident', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/resident/visitors', label: 'Visitors', icon: Users },
    { href: '/dashboard/resident/maintenance', label: 'Service Requests', icon: Construction },
    { href: '/dashboard/resident/finance', label: 'Billing', icon: Wallet },
    { href: '/dashboard/resident/announcements', label: 'Announcements', icon: Megaphone, badge: unreadCount > 0 ? unreadCount : null },
    { href: '/dashboard/resident/map', label: 'Map', icon: Map },
    { href: '/dashboard/resident/lost_and_found', label: 'Lost & Found', icon: Search },
    { href: '/dashboard/resident/workers', label: 'Estate Services', icon: Briefcase },
    {href: `/auth/subscription`, label: 'Subscription Plans', icon: Wallet }
  ];

  const mobileLinks = [
    { href: '/dashboard/resident', label: 'Home', icon: Home },
    { href: '/dashboard/resident/visitors', label: 'Visitors', icon: Users },
    { href: '/dashboard/resident/finance', label: 'Bills', icon: Wallet },
    { href: '/dashboard/resident/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/resident/profile', label: 'Profile', icon: UserCircle },
  ];

  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const role = await getRole();
      setRole(role);
      try {
        const data = await getResidentData();
        setUserData(data);
      } catch (error) {
        toast.error('Failed to load dashboard data. Showing cached info.');
      }
    };
    loadUserData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f13] text-white font-sans transition-colors duration-200 flex flex-col lg:flex-row">
      
      <RoleGuard allowedRoles={['resident']} role={role}>
      <DashboardSidebar links={residentLinks} user={userData} role="resident" estateName={userData?.estateID} />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-scroll">
        <DashboardMobileNav links={residentLinks} user={userData} role="resident" estateName={userData?.estateID} />

        <main className="flex-1 overflow-y-auto p-3 lg:p-8 pb-32 lg:pb-8">
          {children}
        </main>

        <BottomNav pathname={pathname} links={mobileLinks} />
      </div>
      </RoleGuard>
    </div>
  )
}
