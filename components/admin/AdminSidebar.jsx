import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Shield, 
  UserCheck, 
  Users, 
  MessageSquare, 
  Settings,
  Building,
  DollarSign
} from 'lucide-react'

const AdminSidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard/admin', label: 'Overview', icon: BarChart3, exact: true },
    { href: '/dashboard/admin/security', label: 'Security Logs', icon: Shield },
    { href: '/dashboard/admin/users', label: 'Residents', icon: Users },
    { href: '/dashboard/admin/finance', label: 'Finance', icon: DollarSign },
    { href: '/dashboard/admin/announcements', label: 'Announcements', icon: MessageSquare },
    { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-slate-50 dark:bg-gray-900 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block transition-colors">
      <div className="py-6 px-4">
        <div className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3">
          Admin Menu
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-200 hover:bg-slate-200/50 dark:hover:bg-gray-800 cursor-pointer'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500'}`} />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default AdminSidebar