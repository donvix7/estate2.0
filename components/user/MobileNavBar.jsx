'use client'

import { 
  Building2, 
  Building,
  Settings,
  Users,
  Home,
  FileStack,
  History,
  BarChart3,
  ShieldAlert,
  Briefcase
} from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MobileNavBar = ({ 
    title = 'Estate 2.0', 
    icon: CustomIcon,
    role = 'resident'
}) => {
    const pathname = usePathname()

    const getRoleDetails = (userRole) => {
      switch(userRole) {
        case 'security':
          return {
            subtitle: 'Security Portal',
            name: 'Security Officer',
            identifier: 'Gate 1 - North',
            navLinks: [
              { href: '/dashboard/security', label: 'Overview', icon: BarChart3, exact: true },
              { href: '/dashboard/security/logs', label: 'Security Logs', icon: ShieldAlert },
              { href: '/dashboard/security/community', label: 'Community', icon: Building },
              { href: '/dashboard/security/settings', label: 'Settings', icon: Settings },
            ]
          };
        case 'staff':
          return {
            subtitle: 'Staff Portal',
            name: 'Staff Member',
            identifier: 'Maintenance Dept',
            navLinks: [
              { href: '/dashboard/staff', label: 'Overview', icon: BarChart3, exact: true },
              { href: '/dashboard/staff/tasks', label: 'Tasks', icon: Briefcase },
              { href: '/dashboard/staff/community', label: 'Community', icon: Building },
              { href: '/dashboard/staff/settings', label: 'Settings', icon: Settings },
            ]
          };
        case 'resident':
        default:
          return {
            subtitle: 'Resident Portal',
            name: 'Resident User',
            identifier: 'Block A, Unit 4',
            navLinks: [
              { href: '/dashboard/resident', label: 'Overview', icon: Home, exact: true },
              { href: '/dashboard/resident/history', label: 'History', icon: History },
              { href: '/dashboard/resident/visitors', label: 'Visitors', icon: Users },
              { href: '/dashboard/resident/features', label: 'Features', icon: FileStack },
              { href: '/dashboard/resident/settings', label: 'Settings', icon: Settings },
            ]
          };
      }
    }

    const { subtitle, name, identifier, navLinks } = getRoleDetails(role);

    return (
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 border-none pb-[env(safe-area-inset-bottom)]">
            <nav 
                className="bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] max-w-md flex items-center justify-between gap-1.5 px-2 py-2 w-full transition-colors"
                style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            >
                {navLinks.map((link) => {

                    const isActive = link.exact 
                    ? pathname === link.href 
                    : pathname.startsWith(link.href);
                    
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center justify-center w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-2xl transition-all duration-300 relative group cursor-pointer ${
                            isActive 
                                ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                                : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800/60 transition-colors'
                            }`}
                        >
                            <Icon className={`w-[22px]  h-[22px] mb-1 transition-all duration-300 ease-out ${
                                isActive 
                                    ? 'scale-110 -translate-y-0.5' 
                                    : 'scale-100 group-hover:scale-110 group-hover:-translate-y-1'
                            }`} />  

                                <span className={`text-[10px] font-bold font-heading text-center leading-tight transition-colors ${
                                    isActive 
                                        ? 'text-white' 
                                        : 'text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-gray-200'
                                }`}>{link.label}</span>

                             </Link>

                    )
                })}
            </nav>
        </div>
    )
}

export default MobileNavBar