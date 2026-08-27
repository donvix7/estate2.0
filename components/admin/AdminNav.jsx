"use client"
import { Building2, LogOut, Shield, Bell, Search, Menu } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/action'

const AdminNav = ({ 
    activeTab = 'overview', 
    onTabChange, 
    title = 'Estate 2.0', 
    subtitle = 'Admin Console', 
    tabs: customTabs,
    icon: CustomIcon 
}) => {
    const userData = {
        name: 'Admin User',
        gateStation: 'Main Office'
    }

    // Mock estate data
    const adminEstate = {
        name: 'Lekki Phase 1'
    }

    const router = useRouter() // Ensure useRouter is imported

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <nav className="hidden md:block bg-[#1a1d23] backdrop-blur-md text-white text-white sticky top-0 z-50 shadow-sm shadow-none transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Side: Logo & Branding */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                {CustomIcon ? <CustomIcon className="w-5 h-5 text-white" /> : <Building2 className="w-5 h-5 text-white" />}
                             </div>
                             <div>
                                <span className="font-bold text-lg font-heading tracking-tight block leading-none text-white text-white">{title}</span>
                                <span className="text-[10px] text-white0 text-[#8a8f98] uppercase tracking-widest font-medium">{subtitle}</span>
                             </div>
                        </div>
               
                        {/* Estate Context (Breadcrumb style) */}
                        <div className="hidden md:flex items-center gap-2 text-sm">
                             <span className="text-white0 text-[#8a8f98]">Managed Estate:</span>
                             <span className="font-medium text-white text-white bg-[#1a1d23] px-2 py-0.5 rounded transition-colors">
                                {adminEstate.name}
                             </span>
                        </div>
                    </div>

                    {/* Right Side: Actions & Profile */}
                    <div className="flex items-center gap-4">
                        {/* Search & Notifications */}
                        <div className="flex items-center gap-1">
                            <button className="p-2 text-white0 text-[#8a8f98] hover:text-blue-600 hover:text-white hover:bg-[#2a2d33]  rounded-lg transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-white0 text-[#8a8f98] hover:text-blue-600 hover:text-white hover:bg-[#2a2d33]  rounded-lg transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#2a2d33]"></span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px bg-[#2a2d33] mx-2"></div>

                        {/* Profile & Logout */}
                        <div className="flex items-center gap-3 pl-2">
                             <div className="hidden md:block text-right">
                                <div className="text-sm font-bold font-heading text-white text-white leading-none">{userData.name}</div>
                                <div className="text-xs text-white0 text-[#8a8f98] mt-0.5">{userData.gateStation}</div>
                             </div>
                             <div className="w-9 h-9 bg-[#1a1d23] rounded flex items-center justify-center text-[#8a8f98] text-white font-bold transition-colors">
                                {userData.name.charAt(0)}
                             </div>
                             <button 
                                onClick={handleLogout}
                                className="ml-2 p-2 text-[#8a8f98] text-[#8a8f98] hover:text-red-500 hover:text-red-400 hover:bg-red-50 hover:bg-red-950/30 rounded-lg transition-colors"
                                title="Logout"
                             >
                                <LogOut className="w-5 h-5" />
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdminNav