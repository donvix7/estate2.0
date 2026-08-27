'use client'

import React, { useState } from 'react'
import { History } from 'lucide-react'
import { TechCard } from '@/components/ui/TechCard'
import { CleanTable } from '@/components/ui/CleanTable'
import { BackButton } from '@/components/ui/BackButton'
import { PageHeader } from '@/components/ui/PageHeader'

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('history')
  const visitors = []

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
      <PageHeader
        title="Service History"
        description="Review your past service requests and visitor activity."
        icon={History}
        iconColor="blue"
      >
        <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
      </PageHeader>

      <div className="flex bg-[#1a1d23] p-1 rounded-xl overflow-x-auto">
        {[
          { id: 'active', label: 'Generator' },
          { id: 'history', label: 'Recent Passes' },
          { id: 'logs', label: 'Activity Logs' },
          { id: 'blacklist', label: 'Blacklist' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-[#1241a1] text-white shadow-sm' : 'text-[#8a8f98] text-[#8a8f98] hover:text-white hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Bottom Section: History Table */}
      <div className="w-full">
         <TechCard noPadding className="overflow-hidden">
             <div className="px-5 py-4 sm:px-6 sm:py-5 bg-[#1a1d23]/50 bg-[#1a1d23]/50 flex items-center justify-between">
                 <h3 className="text-base sm:text-lg font-bold text-white text-white font-heading">Visitor History</h3>
                 <span className="text-xs font-medium bg-blue-100 text-blue-700 bg-blue-900/50 text-blue-300 px-2.5 py-1 rounded-full">{visitors.length} total</span>
             </div>
           

             <div className="overflow-x-auto w-full">
               <div className="min-w-[600px] w-full">
                 <CleanTable 
                   headers={['Visitor', 'Purpose', 'Time', 'Status']}
                   data={visitors}
                   renderRow={(visitor) => (
                       <>
                           <td className="px-5 py-4 sm:px-6 font-medium text-white text-gray-100 whitespace-nowrap">{visitor.name}</td>
                           <td className="px-5 py-4 sm:px-6 text-[#8a8f98] text-[#8a8f98] capitalize whitespace-nowrap">{visitor.purpose}</td>
                           <td className="px-5 py-4 sm:px-6 text-[#8a8f98] text-[#8a8f98] font-mono text-xs whitespace-nowrap">{visitor.time}</td>
                           <td className="px-5 py-4 sm:px-6 whitespace-nowrap">
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${
                                   visitor.status === 'Active' ? 'bg-green-50 text-green-700 bg-green-900/20 text-green-400' :
                                   visitor.status === 'Pending' ? 'bg-amber-50 text-amber-700 bg-amber-900/20 text-amber-400' :
                                   'bg-[#1a1d23] text-white '
                               }`}>
                                   {visitor.status}
                               </span>
                           </td>
                       </>
                   )}
                 />
                 {visitors.length === 0 && (
                    <div className="p-8 text-center text-[#8a8f98] text-[#8a8f98] text-sm">No visitor history found.</div>
                 )}
               </div>
             </div>
         </TechCard>
      </div>
    </div>
  )
}

export default HistoryPage