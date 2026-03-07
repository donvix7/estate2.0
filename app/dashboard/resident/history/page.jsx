'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ComingSoon from '@/components/ComingSoon'
import { History } from 'lucide-react'
import { TechCard } from '@/components/ui/TechCard'
import { CleanTable } from '@/components/ui/CleanTable'
import { BackButton } from '@/components/ui/BackButton'

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('history')
  const visitors = []

  return (
    <div className="p-6 space-y-6">
        <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
          
             <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1 m-4 sm:mx-6 rounded-xl overflow-x-auto">
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
                     activeTab === tab.id ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                   }`}
                 >
                   {tab.label}
                 </button>
               ))}
             </div>
      {/* Bottom Section: History Table */}
      <div className="w-full">
         <TechCard noPadding className="overflow-hidden">
             <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                 <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-heading">Visitor History</h3>
                 <span className="text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2.5 py-1 rounded-full">{visitors.length} total</span>
             </div>
           

             <div className="overflow-x-auto w-full">
               <div className="min-w-[600px] w-full">
                 <CleanTable 
                   headers={['Visitor', 'Purpose', 'Time', 'Status']}
                   data={visitors}
                   renderRow={(visitor) => (
                       <>
                           <td className="px-5 py-4 sm:px-6 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{visitor.name}</td>
                           <td className="px-5 py-4 sm:px-6 text-gray-500 dark:text-gray-400 capitalize whitespace-nowrap">{visitor.purpose}</td>
                           <td className="px-5 py-4 sm:px-6 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{visitor.time}</td>
                           <td className="px-5 py-4 sm:px-6 whitespace-nowrap">
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${
                                   visitor.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400' :
                                   visitor.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400' :
                                   'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                               }`}>
                                   {visitor.status}
                               </span>
                           </td>
                       </>
                   )}
                 />
                 {visitors.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">No visitor history found.</div>
                 )}
               </div>
             </div>
         </TechCard>
      </div>
    </div>
  )
}

export default HistoryPage