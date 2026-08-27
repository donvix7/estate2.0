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
    title = 'Estate Secure', 
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
        { href: '/dashboard/admin/security', label: 'Security Logs', icon: Shield },
        { href: '/dashboard/admin/users', label: 'Residents', icon: Users },
        { href: '/dashboard/admin/finance', label: 'Finance', icon: DollarSign },
        { href: '/dashboard/admin/announcements', label: 'Announcements', icon: MessageSquare },
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
        <nav className="md:hidden bg-[#1a1d23] backdrop-blur-md text-white text-white sticky top-0 z-50 transition-colors">
            {/* Top Bar */}
            <div className="flex items-center justify-between h-16 px-4">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        {CustomIcon ? <CustomIcon className="w-5 h-5 text-white" /> : <Building2 className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                        <span className="font-bold text-base font-heading tracking-tight block leading-none text-white text-white">{title}</span>
                        <span className="text-[9px] text-white0 text-[#8a8f98] uppercase tracking-widest font-medium">{subtitle}</span>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1a1d23] rounded-full flex items-center justify-center text-[#8a8f98] text-white font-bold text-sm transition-colors">
                        {userData.name.charAt(0)}
                    </div>
                    
                    <button 
                       onClick={() => setIsMenuOpen(true)}
                       className="p-2 text-white0 text-[#8a8f98] hover:text-blue-600 hover:text-white rounded-xl bg-[#1a1d23]/50 bg-[#1a1d23]/50 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-200 bg-[#0d0f13]/60 bg-[#0d0f13]/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsMenuOpen(false)}>
                    <div 
                        className="fixed inset-y-0 right-0 w-[280px] bg-[#1a1d23] shadow-2xl flex flex-col z-210 animate-slide-in-right"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Overlay Header */}
                        <div className="flex items-center justify-between p-4 bg-[#1a1d23]/20">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg font-heading tracking-tight text-white text-white">{title}</span>
                             </div>
                             <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-[#8a8f98] hover:text-[#8a8f98] hover:text-white bg-[#1a1d23] bg-[#1a1d23]/50 rounded-lg transition-colors"
                             >
                                <X className="w-5 h-5" />
                             </button>
                        </div>

                        {/* User Micro-Profile */}
                        <div className="flex items-center p-4">
                            <div className="w-10 h-10 bg-[#1a1d23] rounded-full flex items-center justify-center text-[#8a8f98] text-white font-bold">
                                {userData.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-bold text-white text-white leading-tight">{userData.name}</p>
                                <p className="text-xs text-white0 text-[#8a8f98]">{adminEstate.name}</p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                            <div className="text-xs font-semibold text-[#8a8f98] text-[#8a8f98] uppercase tracking-wider mb-2 px-3">
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
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                        : 'text-[#8a8f98] text-[#8a8f98] hover:text-blue-600 hover:text-white hover:bg-[#2a2d33]  cursor-pointer'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#8a8f98] text-[#8a8f98]'}`} />
                                    <span className="font-semibold text-sm">{link.label}</span>
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
                                 className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
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