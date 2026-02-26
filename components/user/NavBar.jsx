'use client'

import { Building2, LogOut, Bell, Search } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/action'

const NavBar = ({ 
    title = 'Estate 2.0', 
    icon: CustomIcon,
    role = 'resident'
}) => {
    const getRoleDetails = (userRole) => {
      switch(userRole) {
        case 'security':
          return {
            subtitle: 'Security Portal',
            name: 'Security Officer',
            identifier: 'Gate 1 - North'
          };
        case 'staff':
          return {
            subtitle: 'Staff Portal',
            name: 'Staff Member',
            identifier: 'Maintenance Dept'
          };
        case 'resident':
        default:
          return {
            subtitle: 'Resident Portal',
            name: 'Resident User',
            identifier: 'Block A, Unit 4'
          };
      }
    }

    const { subtitle, name, identifier } = getRoleDetails(role);

    const estate = {
        name: 'Lekki Phase 1'
    }

    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <nav className="hidden md:block bg-gray-900 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Side: Logo & Branding */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                {CustomIcon ? <CustomIcon className="w-5 h-5 text-white" /> : <Building2 className="w-5 h-5 text-white" />}
                             </div>
                             <div>
                                <span className="font-bold text-lg font-heading tracking-tight block leading-none">{title}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{subtitle}</span>
                             </div>
                        </div>
               
                        {/* Estate Context (Breadcrumb style) */}
                        <div className="hidden md:flex items-center gap-2 text-sm">
                             <span className="text-gray-400">Estate:</span>
                             <span className="font-medium text-white bg-gray-800 px-2 py-0.5 rounded border-gray-700">
                                {estate.name}
                             </span>
                        </div>
                    </div>

                    {/* Right Side: Actions & Profile */}
                    <div className="flex items-center gap-4">
                        {/* Search & Notifications */}
                        <div className="flex items-center gap-1">
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900"></span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px bg-gray-700"></div>

                        {/* Profile & Logout */}
                        <div className="flex items-center gap-3 pl-2">
                             <div className="hidden md:block text-right">
                                <div className="text-sm font-bold font-heading text-white leading-none">{name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{identifier}</div>
                             </div>
                             <div className="w-9 h-9 bg-gray-800 rounded flex items-center justify-center text-gray-300 font-bold">
                                {name.charAt(0)}
                             </div>
                             <button 
                                onClick={handleLogout}
                                className="ml-2 p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
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

export default NavBar