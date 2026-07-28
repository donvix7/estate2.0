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
         <div className="p-4 sm:p-6 overflow-y-auto h-[calc(100vh-80px)]">
  {/* Main Navigation Links */}
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
              ? 'bg-amber-600 dark:bg-amber-600 text-white shadow-lg shadow-amber-600/20 dark:shadow-amber-600/30' 
              : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700/80 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/50 dark:border-slate-700/50 hover:border-amber-200 dark:hover:border-amber-700/50'
          }`}
        >
          <div className={`relative p-2 rounded-lg transition-all duration-200 ${
            isActive 
              ? 'bg-white/20' 
              : 'bg-slate-100 dark:bg-slate-700/50 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30'
          }`}>
            <Icon className={`size-5 transition-transform duration-200 ${
              isActive 
                ? 'text-white' 
                : 'text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'
            }`} />
          </div>
          <span className={`text-[10px] sm:text-xs font-medium text-center mt-1.5 leading-tight ${
            isActive 
              ? 'text-white' 
              : 'text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'
          }`}>
            {link.label}
          </span>
          {isActive && (
            <div className="mt-1 w-4 h-0.5 rounded-full bg-white/80" />
          )}
        </Link>
      )
    })}
  </div>

  {/* Quick Actions Section */}
  <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200/60 dark:border-slate-700/60">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        Quick Actions
      </h3>
      <span className="text-[8px] text-slate-300 dark:text-slate-600 uppercase tracking-wider">⚡</span>
    </div>
    
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
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
            className={`group flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-amber-600 dark:bg-amber-600 text-white shadow-lg shadow-amber-600/20 dark:shadow-amber-600/30' 
                : 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700/60 hover:border-amber-200 dark:hover:border-amber-700/50 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-white/20' 
                : 'bg-slate-100 dark:bg-slate-700/50 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30'
            }`}>
              <Icon className={`size-4 transition-transform duration-200 ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'
              }`} />
            </div>
            <span className={`text-[9px] sm:text-[10px] font-medium text-center mt-1 leading-tight ${
              isActive 
                ? 'text-white' 
                : 'text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'
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