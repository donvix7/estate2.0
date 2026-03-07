import React from 'react'
import { ShieldAlert, Users as UsersIcon, Bell, Activity, AlertTriangle, TriangleAlert, Settings, Siren } from 'lucide-react'
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
    { name: 'Emergency', icon: Siren, href: '/dashboard/resident/emergency' },
    { name: 'Settings', icon: Settings, href: '/dashboard/resident/settings' },
  ]
  return (
    <div className="space-y-8">
      {/* Emergency Section */}      

      {/* Mobile Navigation - Mobile only */}
      
      <div className="block md:hidden text-sm p-2 ">
      <div className="grid grid-cols-4 gap-2 mb-6 md:hidden">
        {tabs.map((tab, index) => (
          <div key={index} className="flex flex-col items-center justify-start w-full">
                  <Link href={tab.href} className="flex flex-col items-center gap-2 w-full group">
                    <TechCard noPadding className="w-[80px] h-[80px] sm:w-[92px] sm:h-[92px] rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col items-center justify-center " hoverEffect={false}>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50/80 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                        <tab.icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </TechCard>
                    <span className="text-xs sm:text-sm font-bold text-gray-500 font-heading text-center leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">{tab.name}</span>
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