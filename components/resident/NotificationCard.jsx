import React from 'react'
import { Bell, Megaphone, Info, AlertTriangle, CheckCircle, BellOff } from 'lucide-react'

export function NotificationCard({ announcements = [] }) {
  // Helpers to pick icons/colors based on announcement type
  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'success': return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      default: return <Megaphone className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type) => {
    switch(type) {
      case 'alert': return 'bg-red-50 dark:bg-red-500/10'
      case 'success': return 'bg-emerald-50 dark:bg-blue-500/10'
      case 'info': return 'bg-blue-50 dark:bg-blue-500/10'
      default: return 'bg-blue-50 dark:bg-blue-500/10'
    }
  }

  const displayAnnouncements = announcements.length > 0 ? announcements : []

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col h-full w-full">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center bg-gray-900/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100/50 dark:bg-blue-600/20 rounded-2xl text-blue-600 dark:text-blue-300">
             <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white font-heading text-lg">Notifications</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Stay updated with estate alerts</p>
          </div>
        </div>
        
        {displayAnnouncements.length > 0 && (
          <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-md shadow-blue-500/20">
             {displayAnnouncements.filter(a => !a.isRead).length} New
          </span>
        )}
      </div>

      {/* List / Empty State */}
      <div className="flex flex-col gap-2 overflow-y-auto p-2">
        {displayAnnouncements.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[250px]">
              <div className="w-16 h-16 rounded-full bg-gray-800 dark:bg-gray-800/80 flex items-center justify-center mb-4 shadow-sm">
                 <BellOff className="w-8 h-8 text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-900 dark:text-white font-heading font-bold text-lg">All caught up!</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-[250px]">There are no new announcements or alerts at this time.</p>
           </div>
        ) : (
          displayAnnouncements.map((item, index) => (
            <div 
              key={item.id} 
              className={`p-4 mx-2 my-2 rounded-2xl flex gap-4 transition-all duration-300 group cursor-pointer hover:text-blue-700 hover:shadow-sm ${
                !item.isRead ? 'bg-blue-50/50 dark:bg-gray-900' : ''
              }`}
            >
              {/* Icon Circle */}
              <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${getBgColor(item.type)}`}>
                 {getIcon(item.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                 <div className="flex justify-between items-start mb-1">
                   <h4 className={`text-sm font-bold font-heading truncate pr-4 ${!item.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-300'}`}>
                      {item.title}
                   </h4>
                   <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap px-2 py-0.5 rounded-md">
                      {item.date}
                   </span>
                 </div>
                 <p className={`text-sm line-clamp-2 ${!item.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                    {item.message}
                 </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer */}
      {displayAnnouncements.length > 0 && (
         <div className="p-5 text-center bg-gray-800 dark:bg-gray-800/80 mt-auto">
            <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
               View All History &rarr;
            </button>
         </div>
      )}
    </div>
  )
}
