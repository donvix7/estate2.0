import React from 'react'
import { TechCard } from '@/components/ui/TechCard'
import { Settings2, ShieldAlert, FileText, CheckCircle } from 'lucide-react'

export default function AnnouncementsTab({ announcements, markAllAsRead, markAsRead }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h3 className="text-xl font-bold text-gray-900 font-heading">Notices & Updates</h3>
          <button
           onClick={markAllAsRead}
           className="text-sm font-medium text-blue-600 hover:text-blue-700"
         >
           Mark all as read
         </button>
      </div>
     
     <div className="grid gap-4">
       {announcements.map(announcement => (
         <TechCard 
           key={announcement.id} 
           className={`transition-all ${
             !announcement.read 
               ? 'bg-blue-50/50 border-blue-100' 
               : 'bg-white border-gray-200'
           }`}
           hoverEffect={true}
         >
            <div className="flex justify-between items-start">
               <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                     announcement.type === 'maintenance' ? 'bg-blue-100 text-blue-600' :
                     announcement.type === 'security' ? 'bg-red-100 text-red-600' :
                     'bg-emerald-100 text-emerald-600'
                  }`}>
                      {announcement.type === 'maintenance' ? <Settings2 className="w-5 h-5"/> : 
                       announcement.type === 'security' ? <ShieldAlert className="w-5 h-5"/> : <FileText className="w-5 h-5"/>}
                  </div>
                  <div>
                     <div className="flex items-center gap-3">
                        <h4 className={`font-bold text-base font-heading ${!announcement.read ? 'text-blue-900' : 'text-gray-900'}`}>{announcement.title}</h4>
                        {!announcement.read && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>}
                     </div>
                     <p className="text-gray-600 mt-2 text-sm leading-relaxed">{announcement.content}</p>
                     <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-400 uppercase tracking-wide">
                        <span>{new Date(announcement.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{announcement.type}</span>
                     </div>
                  </div>
               </div>
               {!announcement.read && (
                   <button onClick={() => markAsRead(announcement.id)} className="text-gray-400 hover:text-blue-600">
                      <CheckCircle className="w-5 h-5" />
                   </button>
               )}
            </div>
         </TechCard>
       ))}
     </div>
    </div>
  )
}
