'use client'

import { 
  Building2, 
  LogOut, 
  Menu, 
  X,
  BarChart3, 
  Shield, 
  UserCheck, 
  Users, 
  MessageSquare, 
  Settings,
  Building,
  DollarSign
} from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/lib/action'

const AdminMobileNav = ({ 
    title = 'Estate 2.0', 
    subtitle = 'Admin Console', 
    icon: CustomIcon 
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    // Mock estate & user data
    const adminEstate = { name: 'Lekki Phase 1' }
    const userData = { name: 'Admin User', gateStation: 'Main Office' }

    const navLinks = [
        { href: '/dashboard/admin', label: 'Overview', icon: BarChart3, exact: true },
        { href: '/dashboard/admin/staff', label: 'Staff', icon: UserCheck },
        { href: '/dashboard/admin/security', label: 'Security', icon: Shield },
        { href: '/dashboard/admin/users', label: 'Residents', icon: Users },
        { href: '/dashboard/admin/finance', label: 'Finance', icon: DollarSign },
        { href: '/dashboard/admin/announcements', label: 'Announcements', icon: MessageSquare },
        { href: '/dashboard/admin/community', label: 'Community', icon: Building },
        { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
    ]

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <nav className="md:hidden bg-gray-900  text-white sticky top-0 z-50">
            {/* Top Bar */}
            <div className="flex items-center justify-between h-16 px-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <button 
                       onClick={() => setIsMenuOpen(true)}
                       className="p-1 -ml-1 text-gray-400 hover:text-white rounded transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            {CustomIcon ? <CustomIcon className="w-5 h-5 text-white" /> : <Building2 className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                            <span className="font-bold text-base font-heading tracking-tight block leading-none">{title}</span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-medium">{subtitle}</span>
                        </div>
                    </div>
                </div>

                {/* Profile Avatar (Small) */}
                <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-400 truncate max-w-[80px]">{adminEstate.name}</span>
                     <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-gray-700 text-gray-300 font-bold text-sm">
                        {userData.name.charAt(0)}
                     </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-60 bg-gray-900/80 backdrop-blur-sm animate-fadeIn">
                    <div className="fixed inset-y-0 left-0 w-[280px] bg-gray-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">

                        {/* Overlay Header */}
                        <div className="flex items-center justify-between p-4">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg font-heading tracking-tight">{title}</span>
                             </div>
                             <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-white bg-gray-800/50 rounded-lg"
                             >
                                <X className="w-5 h-5" />
                             </button>
                        </div>

                        {/* User Micro-Profile */}
                        <div className="flex items-center p-4 bg-gray-800/20">
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-gray-700 text-gray-300 font-bold">
                                {userData.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-bold text-white leading-tight">{userData.name}</p>
                                <p className="text-xs text-gray-500">{adminEstate.name}</p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                                Admin Menu
                            </div>
                            {navLinks.map((link) => {
                                const isActive = link.exact 
                                ? pathname === link.href 
                                : pathname.startsWith(link.href);
                                
                                const Icon = link.icon;
                                
                                return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)} // Close menu on click
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
                        </div>

                        {/* Logout Footer */}
                        <div className="p-4">
                             <button 
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                             >
                                <LogOut className="w-4 h-4" /> Sign Out
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default AdminMobileNav