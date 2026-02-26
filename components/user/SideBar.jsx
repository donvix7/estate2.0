'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Settings,
  Building,
  DollarSign,
  ShieldAlert,
  CreditCard,
  MessageSquareWarning,
  Home,
  Users,
  User,
  Bell
} from 'lucide-react'

const SideBar = ({ role = 'resident' }) => {
  const pathname = usePathname();

  const getNavLinks = (userRole) => {
    switch (userRole) {
      case 'security':
        return [
          { href: '/dashboard/security', label: 'Overview', icon: BarChart3, exact: true },
          { href: '/dashboard/security/logs', label: 'Security Logs', icon: ShieldAlert },
          { href: '/dashboard/security/community', label: 'Community', icon: Building },
          { href: '/dashboard/security/settings', label: 'Settings', icon: Settings },
        ];
      case 'staff':
        return [
          { href: '/dashboard/staff', label: 'Overview', icon: BarChart3, exact: true },
          { href: '/dashboard/staff/tasks', label: 'Tasks', icon: Briefcase },
          { href: '/dashboard/staff/community', label: 'Community', icon: Building },
          { href: '/dashboard/staff/settings', label: 'Settings', icon: Settings },
        ];
      case 'resident':
      default:
        return [
          { href: '/dashboard/resident', label: 'Overview', icon: Home, exact: true },
          { href: '/dashboard/resident/visitors', label: 'Visitors', icon: Users },
          { href: '/dashboard/resident/finance', label: 'Payments', icon: CreditCard },
          { href: '/dashboard/resident/announcements', label: 'Announcements', icon: Bell },
          { href: '/dashboard/resident/complaints', label: 'Complaints', icon: MessageSquareWarning },
          { href: '/dashboard/resident/profile', label: 'Profile', icon: User },
          { href: '/dashboard/resident/community', label: 'Community', icon: Building },
          { href: '/dashboard/resident/settings', label: 'Settings', icon: Settings },
        ];
    }
  }

  const navLinks = getNavLinks(role);

  return (
    <aside className="w-64 bg-gray-900 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block">
      <div className="py-6 px-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
          Main Menu
        </div>
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? pathname === link.href 
              : pathname.startsWith(link.href);
              
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 cursor-pointer'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default SideBar