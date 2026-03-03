import React from 'react'
import { ShieldAlert, Users as UsersIcon, Bell, Activity, AlertTriangle, TriangleAlert, Settings } from 'lucide-react'
import { TechCard } from '@/components/ui/TechCard'
import { PanicButton } from '@/components/panic-button'
import Link from 'next/link'

export default function OverviewTab({ 
  residentData, 
  visitorStats, 
  announcements, 
  getUnreadCount, 
  visitors, 
  setActiveTab 
}) {

  const tabs = [
    { name: 'Visitors', icon: UsersIcon, href: '/dashboard/resident/visitors' },
    { name: 'Notices', icon: Bell, href: '/dashboard/resident/notices' },
    { name: 'Emergency', icon: TriangleAlert, href: '/dashboard/resident/emergency' },
    { name: 'Settings', icon: Settings, href: '/dashboard/resident/settings' },
  ]
  return (
    <div className="space-y-8">
      {/* Emergency Section */}      

      {/* Mobile Navigation - Mobile only */}
      
      <div className="block md:hidden text-sm p-2 ">
      <div className="grid grid-cols-4 gap-2 mb-6 md:hidden">
        {tabs.map((tab) => (
          <div key={tab.name} className="flex flex-col items-center gap-1.5 w-full">
          <Link href={tab.href}>
          <TechCard noPadding className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center" hoverEffect={false}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50/80 rounded-full flex items-center justify-center">
              <tab.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </TechCard>
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 font-heading text-center leading-tight">{tab.name}</span>
          </Link>
          </div>
        ))}
      </div>
      </div>

    {/* Desktop view */}
    <div className="hidden md:block text-sm p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tabs.map((tab) => (
          <Link key={tab.name} href={tab.href}>
          <TechCard>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <tab.icon className="w-5 h-5 md:w-5 md:h-5 text-blue-600" />
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase text-gray-400 tracking-wider font-heading">{tab.name}</span>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 font-heading">{visitorStats.thisMonth}</div>
            <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2 mt-1 text-xs md:text-sm text-gray-500">
               <span className="font-medium text-blue-600">{visitorStats.active} Active</span>
               <span className="hidden xl:inline">•</span>
               <span>{visitorStats.pending} Pending</span>
            </div>
          </div>
        </TechCard>
        </Link>
        ))}

      </div>
    </div>

      
      
    </div>
  )
}