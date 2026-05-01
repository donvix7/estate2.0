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
  Construction, 
  Wallet, 
  Megaphone, 
  Map, 
  Search, 
  Briefcase, 
  Home, 
  MessageSquare, 
  UserCircle 
} from 'lucide-react';
import { getAnnouncements, getCurrentSession, getUserById } from '@/lib/service'

export default function ResidentLayout({ children }) {
  const pathname = usePathname();

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

  ];

  const mobileLinks = [

    { href: '/dashboard/resident', label: 'Home', icon: Home },
    { href: '/dashboard/resident/visitors', label: 'Visitors', icon: Users },
    { href: '/dashboard/resident/finance', label: 'Bills', icon: Wallet },
    { href: '/dashboard/resident/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/resident/profile', label: 'Profile', icon: UserCircle },

  ];

  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getCurrentSession();
      setUserData(data);
    };

    loadUserData();
  

  }, []);
  useEffect(() => {
    const loadUser = async () => {
      const user = await getUserById(userData?.userId);
      setUser(user);
    };
    loadUser();
  }, [userData]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-gray-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <DashboardSidebar links={residentLinks} user={user} role="resident" estateName="Lekki Phase 1" />
      
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-scroll">
        <div className="hidden lg:block">
          <DashboardHeader userName={user?.name} estateName="Elite Towers" />
        </div>
        <DashboardMobileNav links={residentLinks} user={user} role="resident" estateName="Elite Towers" />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-8 pb-32 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900  pb-safe">
          <div className="max-w-md mx-auto flex justify-between items-center px-2 py-2">
            {mobileLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`flex flex-col items-center gap-1 flex-1 py-1 ${pathname === link.href ? 'text-[#1241a1]' : 'text-slate-400 dark:text-slate-500'}`}>
                <link.icon className="size-5" />
                <span className="text-[10px] font-medium uppercase tracking-tighter text-center">{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
