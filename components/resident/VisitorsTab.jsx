import React from 'react'
import { TechCard } from '@/components/ui/TechCard'
import { CleanTable } from '@/components/ui/CleanTable'
import { VisitorPassGenerator } from '@/components/visitor-pass-generator'

export default function VisitorsTab({ visitors }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TechCard>
           <h3 className="font-bold text-gray-900 font-heading mb-6">Create New Pass</h3>
           <VisitorPassGenerator />
        </TechCard>
        
         <TechCard noPadding>
             <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                 <h3 className="font-bold text-gray-900 font-heading">Visitor History</h3>
             </div>
             <CleanTable 
               headers={['Visitor', 'Purpose', 'Time', 'Status']}
               data={visitors}
               renderRow={(visitor) => (
                   <>
                       <td className="px-6 py-4 font-medium text-gray-900">{visitor.name}</td>
                       <td className="px-6 py-4 text-gray-500">{visitor.purpose}</td>
                       <td className="px-6 py-4 text-gray-500 font-mono text-xs">{visitor.time}</td>
                       <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                               visitor.status === 'Active' ? 'bg-green-100 text-green-800' :
                               visitor.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                               'bg-gray-100 text-gray-800'
                           }`}>
                               {visitor.status}
                           </span>
                       </td>
                   </>
               )}
             />
         </TechCard>
      </div>
    </div>
  )
}
