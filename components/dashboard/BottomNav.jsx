'use client'

import { LayoutDashboard, Logs, Menu, Settings, Users, X, Home, CreditCard, Shield, Bell, BarChart3, HelpCircle, FileText, UserPlus, Building2, Megaphone, MessageCircle } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'

const BottomNav = ({ pathname, links, role = 'admin' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const navStyle = {
    active: 'text-[#1241a1]',
    hover: 'hover:text-[#1241a1]',
    bg: 'bg-[#1241a1]',
    shadow: 'shadow-[#1241a1]/20',
    activeBg: 'bg-[#1241a1]',
    menuButton: 'bg-[#1241a1] text-white hover:bg-[#1a51b1]',
  }

  const defaultLinks = [
    { href: '/dashboard/admin/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/users', label: 'Logs', icon: Logs },
    { href: '/dashboard/admin/security', label: 'Residents', icon: Users },
    { href: '/dashboard/admin/finance', label: 'Settings', icon: Settings },
  ]

  const navLinks = links && links.length > 0 ? links : defaultLinks

  const moreLinks = [
    { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/dashboard/admin/security', label: 'Security', icon: Shield },
    { href: '/dashboard/admin/residents', label: 'Residents', icon: UserPlus },
    { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText },
    { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/admin/help', label: 'Help & Support', icon: HelpCircle },
    { href: '/dashboard/admin/community', label: 'Community', icon: Building2 },
  ]

  const visibleLinks = navLinks.slice(0, 4)
  const allLinks = [...visibleLinks, ...moreLinks]

  return (
    <div>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0f13] rounded-2xl backdrop-blur-md shadow-lg m-4 border border-[#2a2d33] pb-safe">
        <div className="flex items-center justify-around h-20 mx-auto">
          {visibleLinks.map((link, index) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link 
                key={index} 
                href={link.href} 
                className={`flex flex-col items-center gap-1 transition-all duration-200 group relative ${
                  isActive ? navStyle.active : 'text-[#8a8f98]'
                } ${navStyle.hover}`}
              >
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#1241a1]/10 scale-110' 
                    : 'group-hover:bg-[#1a1d23]'
                }`}>
                  <Icon className={`size-6 transition-all duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                </div>
                <span className={`text-[10px] font-bold transition-colors ${
                  isActive ? navStyle.active : 'text-[#8a8f98]'
                }`}>
                  {link.label}
                </span>
                {isActive && (
                  <div className={`absolute -top-1 w-8 h-1 rounded-full ${navStyle.bg}`} />
                )}
              </Link>
            )
          })}
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex flex-col items-center gap-1 ${navStyle.menuButton} p-4 h-14 w-14 font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${navStyle.shadow}`}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0d0f13] animate-in fade-in duration-300">
          <div className="flex items-center justify-between p-6 border-b border-[#2a2d33]">
            <h2 className="text-2xl font-bold text-white">All Navigation</h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl hover:bg-[#1a1d23] transition-colors"
            >
              <X className="size-6 text-[#8a8f98]" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto h-[calc(100vh-80px)]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {allLinks.map((link, index) => {
                const Icon = link.icon
                const isActive = pathname === link.href 
                return (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setIsModalOpen(false)}
                    className={`group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20' 
                        : 'bg-[#1a1d23] text-[#8a8f98] border border-[#2a2d33] hover:scale-105'
                    }`}
                  >
                    <div className={`relative p-2.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-[#0d0f13] group-hover:bg-[#2a2d33]'
                    }`}>
                      <Icon className={`size-5 transition-all duration-200 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-[#8a8f98] group-hover:text-[#1241a1]'
                      }`} />
                    </div>
                    <span className={`text-[10px] sm:text-xs font-medium text-center mt-1.5 leading-tight transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-[#8a8f98] group-hover:text-white'
                    }`}>
                      {link.label}
                    </span>
                    {isActive && (
                      <div className="mt-1 w-6 h-0.5 rounded-full bg-white/80" />
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#2a2d33]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] sm:text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">
                  Quick Actions
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { icon: UserPlus, label: 'Add Resident', href: '/dashboard/admin/add-resident' },
                  { icon: FileText, label: 'Generate Report', href: '/dashboard/admin/generate-report' },
                  { icon: Megaphone, label: 'Send Notice', href: '/dashboard/admin/send-notice' },
                  { icon: MessageCircle, label: 'Help Center', href: '/dashboard/admin/send-message' }
                ].map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  
                  return (
                    <Link 
                      key={index}
                      href={item.href}
                      onClick={() => setIsModalOpen(false)}
                      className={`group flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20' 
                          : 'bg-[#1a1d23] border border-[#2a2d33] hover:scale-105'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-[#0d0f13] group-hover:bg-[#2a2d33]'
                      }`}>
                        <Icon className={`size-4 transition-all duration-200 ${
                          isActive 
                            ? 'text-white' 
                            : 'text-[#8a8f98] group-hover:text-[#1241a1]'
                        }`} />
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-medium text-center mt-1 leading-tight transition-colors ${
                        isActive 
                          ? 'text-white' 
                          : 'text-[#8a8f98] group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BottomNav
