'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  CreditCard, 
  Bell, 
  Settings, 
  LogOut,
  Shield,
  UserCheck,
  MessageSquare,
  Building2,
  FileText,
  Calendar,
  X
} from 'lucide-react'

const MENU_ITEMS = {
  resident: [
    { name: 'Overview', href: '/dashboard/resident', icon: LayoutDashboard },
    { name: 'Visitors', href: '/dashboard/resident?tab=visitors', icon: Users },
    { name: 'Payments', href: '/dashboard/resident?tab=payments', icon: CreditCard },
    { name: 'Notices', href: '/dashboard/resident?tab=announcements', icon: Bell },
  ],
  admin: [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Security', href: '/dashboard/admin?tab=security', icon: Shield },
    { name: 'Staff', href: '/dashboard/admin?tab=staff', icon: UserCheck },
    { name: 'Residents', href: '/dashboard/admin?tab=users', icon: Users },
    { name: 'Notices', href: '/dashboard/admin?tab=announcements', icon: MessageSquare },
  ],
  security: [
    { name: 'Dashboard', href: '/dashboard/security', icon: LayoutDashboard },
    { name: 'Verify Pass', href: '/dashboard/security?tab=verify', icon: Shield },
    { name: 'Logs', href: '/dashboard/security?tab=logs', icon: FileText },
  ],
  staff: [
    { name: 'Tasks', href: '/dashboard/staff', icon: LayoutDashboard },
    { name: 'Schedule', href: '/dashboard/staff?tab=schedule', icon: Calendar },
  ]
}

export function DashboardSidebar({ 
  userType = 'resident', 
  userName = 'User', 
  userEmail = 'user@demo.com',
  isOpen,
  onClose
}) {
  const pathname = usePathname()
  const items = MENU_ITEMS[userType] || MENU_ITEMS.resident

  return (
    <div className={`
      w-64 h-screen bg-gray-900 text-gray-400 flex flex-col fixed left-0 top-0 border-r border-gray-800 font-sans z-50
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0
    `}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
             <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg font-heading tracking-tight">Estate 2.0</span>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="md:hidden text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-gray-500 font-heading">
          Menu
        </div>
        {items.map((item) => {
          const isActive = pathname === item.href.split('?')[0]
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-gray-700">
            <span className="text-gray-300 font-medium font-heading">
              {userName.charAt(0)}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate font-heading">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-gray-700 hover:bg-gray-800 text-xs font-medium transition-colors text-gray-300">
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
