import React from 'react'
import { ShieldAlert, Users as UsersIcon, Bell, Activity } from 'lucide-react'
import { TechCard } from '@/components/ui/TechCard'
import { PanicButton } from '@/components/panic-button'

export default function OverviewTab({ 
  residentData, 
  visitorStats, 
  announcements, 
  getUnreadCount, 
  visitors, 
  setActiveTab 
}) {
  return (
    <div className="space-y-8">
      {/* Emergency Section */}
       <TechCard className=" border-red-100 flex flex-col md:flex-row items-center justify-between gap-6" hoverEffect={false}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-heading">Emergency Panic System</h2>
            <p className="text-gray-500 text-sm">Instant alert to security and admin.</p>
          </div>
        </div>    
        <div className="w-full md:w-auto">
           <PanicButton />
        </div>
      </TechCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TechCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-bold uppercase text-gray-400 tracking-wider font-heading">Visitors</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-heading">{visitorStats.thisMonth}</div>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
               <span className="font-medium text-blue-600">{visitorStats.active} Active</span>
               <span>•</span>
               <span>{visitorStats.pending} Pending</span>
            </div>
          </div>
        </TechCard>

        <TechCard>
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
             <span className="text-xs font-bold uppercase text-gray-400 tracking-wider font-heading">Notices</span>
          </div>
          <div>
            <div className="text-3xl font-bold dark:text-gray-100 text-gray-900 font-heading">{announcements.length}</div>
             <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
               <span className="font-medium text-amber-600">{getUnreadCount()} Unread</span>
            </div>
          </div>
        </TechCard>

         <TechCard>
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
             <span className="text-xs font-bold uppercase text-gray-400 tracking-wider font-heading">Tenure</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-heading">3 <span className="text-lg font-medium text-gray-400">Years</span></div>
             <div className="text-sm text-gray-500 mt-1">
                Resident since {residentData?.joinDate ? new Date(residentData.joinDate).getFullYear() : '2023'}
             </div>
          </div>
        </TechCard>
      </div>

      {/* Recent Visitors Table Card */}
      <TechCard noPadding>
        <div className="px-6 py-5  flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-900 font-heading">Recent Visitor Passes</h3>
          </div>
          <button 
            onClick={() => setActiveTab('visitors')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            View All &rarr;
          </button>
        </div>
        <div className="">
          {visitors.slice(0, 3).map(visitor => (
            <div key={visitor.id} className="p-6 hover:bg-gray-100 dark:hover:border-gray-100 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                  {visitor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 font-heading">{visitor.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                     <span className="capitalize">{visitor.purpose}</span>
                     <span>•</span>
                     <span>{visitor.time}</span>
                  </p>
                </div>
              </div>
               <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide   ${
                  visitor.status === 'Active' 
                    ? 'text-green-700 border-green-200' 
                    : visitor.status === 'Pending'
                    ? 'text-amber-700 border-amber-200'
                    : 'text-gray-600 border-gray-200'
                }`}>
                  {visitor.status}
                </span>
            </div>
          ))}
          {visitors.length === 0 && (
              <div className="p-8 text-center text-gray-500">No recent history</div>
          )}
        </div>
      </TechCard>
    </div>
  )
}
