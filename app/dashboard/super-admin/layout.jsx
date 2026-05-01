"use client"
import DashboardMobileNav from '@/components/dashboard/MobileNav';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import { FileText, House, LayoutDashboard, Settings, Shield, Users, Wallet, ReceiptText, Settings2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const layout = ({children}) => {
  const pathname = usePathname();

      const superAdminLinks = [
        { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/admin/users', label: 'Residents', icon: Users },
        { href: '/dashboard/admin/estates', label: 'Estates', icon: House },
        { href: '/dashboard/admin/security', label: 'Security Logs', icon: Shield },
        { href: '/dashboard/admin/finance', label: 'Finance', icon: Wallet },
        { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText }, 
        { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
      ];
      const mobileLinks = [
        { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/admin/users', label: 'Residents', icon: Users },
        { href: '/dashboard/admin/estates', label: 'Estates', icon: House },
        { href: '/dashboard/admin/security', label: 'Security Logs', icon: Shield },
        { href: '/dashboard/admin/finance', label: 'Finance', icon: Wallet },
        { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText }, 
        { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
      ];
      const userData = {
        name: 'Super Admin',
        role: 'Super Administrator',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'
      };
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col lg:flex-row bg-white/90 dark:bg-gray-950 rounded-none lg:rounded-xl p-0 lg:p-6 shadow-md">
          {/* Sidebar Navigation */}
          <DashboardSidebar links={superAdminLinks} user={userData} role="admin" estateName="Lekki Phase 1" />
          
          <div className="flex flex-col flex-1 min-w-0">
            {/* Top Navigation / Mobile Nav */}
            <DashboardMobileNav links={superAdminLinks} user={userData} role="admin" estateName="Lekki Phase 1" />
    
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-3 lg:p-8 pb-32 lg:pb-8">
              {children}
            </main>
    
            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 rounded-2xl backdrop-blur-md shadow-lg  border-slate-900 dark:border-slate-900 pb-safe">
              <div className="flex items-center justify-around h-20 max-w-lg mx-auto">
                <Link href="/dashboard/admin" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/admin' ? 'text-[#1241a1]' : 'text-slate-500'}`}>
                  <LayoutDashboard className="size-5" />
                  <span className="text-[10px] font-bold">Dashboard</span>
                </Link>
                <Link href="/dashboard/admin/security" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/admin/security' ? 'text-[#1241a1]' : 'text-slate-500'}`}>
                  <ReceiptText className="size-5" />
                  <span className="text-[10px] font-medium">Logs</span>
                </Link>
                <Link href="/dashboard/admin/users" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/admin/users' ? 'text-[#1241a1]' : 'text-slate-500'}`}>
                  <Users className="size-5" />
                  <span className="text-[10px] font-medium">Residents</span>
                </Link>
                <Link href="/dashboard/admin/services" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/admin/services' ? 'text-[#1241a1]' : 'text-slate-500'}`}>
                  <Settings2 className="size-5" />
                  <span className="text-[10px] font-medium">Services</span>
                </Link>
                <button 
                  onClick={() => {
                    // This could trigger the mobile menu if needed, 
                    // but for now let's just use the existing MobileNav button if it exists
                  }}
                  className="flex flex-col items-center gap-1 text-slate-500"
                >
                  <MoreHorizontal className="size-5" />
                  <span className="text-[10px] font-medium">More</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
  )
}

export default layout