'use client'

import { LayoutDashboard, Logs, Menu, Settings, Users, X, Home, CreditCard, Shield, Bell, BarChart3, HelpCircle, FileText, UserPlus, Building2, Megaphone, MessageCircle } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'

const BottomNav = ({ pathname, links }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Default links if none provided
  const defaultLinks = [
    { href: '/dashboard/admin/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/users', label: 'Logs', icon: Logs },
    { href: '/dashboard/admin/security', label: 'Residents', icon: Users },
    { href: '/dashboard/admin/finance', label: 'Settings', icon: Settings },
  ]

  const navLinks = links && links.length > 0 ? links : defaultLinks

  // Additional links for the "More" menu
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

  // Combine visible links (first 4) with more links for the modal
  const visibleLinks = navLinks.slice(0, 4)
  const allLinks = [...visibleLinks, ...moreLinks]

  return (
    <div>
      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-200 dark:bg-slate-950/80 rounded-2xl backdrop-blur-md shadow-lg m-4 border-slate-900 dark:border-slate-900 pb-safe">
        <div className="flex items-center justify-around h-20 mx-auto">
          {visibleLinks.map((link, index) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link 
                key={index} 
                href={link.href} 
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'text-amber-700 dark:text-amber-700' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="size-6" />
                <span className="text-[10px] font-bold">{link.label}</span>
              </Link>
            )
          })}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-200 bg-amber-700 p-4 h-14 w-14 font-bold  hover:bg-white hover:text-amber-700 rounded-md  dark:hover:text-amber-700 transition-colors"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 animate-in fade-in duration-300">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Navigation</h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="size-6 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Modal Content - Grid of Links */}
          <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allLinks.map((link, index) => {
                const Icon = link.icon
                const isActive = pathname === link.href 
                return (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setIsModalOpen(false)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                      isActive 
                        ? ' bg-amber-700 dark:bg-amber-700 dark:text-white text-white' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-amber-700 hover:text-amber-700] dark:hover:text-amber-700'
                    }`}
                  >
                    <Icon className="size-8 mb-3" />
                    <span className={`text-sm font-semibold text-center ${
                      isActive ? 'text-black dark:text-white' : ''
                    }`}>
                      {link.label}
                    </span>
                    {isActive && (
                      <div className="mt-2 w-6 h-1 rounded-full bg-black dark:bg-white" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Quick Actions Section */}
            <div className="mt-8 border-t border-amber-700 dark:border-amber-700 pt-8">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  {
                    icon: UserPlus,
                    label: 'Add Resident',
                    href: '/dashboard/admin/add-resident'
                  },
                  {
                    icon: FileText,
                    label: 'Generate Report',
                    href: '/dashboard/admin/generate-report'
                  },
                  {
                    icon: Megaphone,
                    label: 'Send Notice',
                    href: '/dashboard/admin/send-notice'
                  },
                  {
                    icon: MessageCircle,
                    label: 'Help Center',
                    href: '/dashboard/admin/send-message'
                  }
                ].map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  
                  return (
                    <Link 
                      key={index}
                      href={item.href}
                      onClick={() => setIsModalOpen(false)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all hover:text-white ${
                        isActive 
                          ? 'border-black bg-amber-700 dark:bg-amber-700 dark:text-white text-white' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-[#1241a1]/50 hover:text-amber-700 dark:hover:text-amber-700'
                      }`}
                    >
                      <Icon className="size-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium">{item.label}</span>
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