'use client'

import React from 'react'
import { 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Search 
} from 'lucide-react'

const CATEGORY_COLORS = {
  Pet: 'text-amber-500',
  Electronics: 'text-sky-500',
  Keys: 'text-yellow-500',
  Documents: 'text-emerald-500',
  Clothing: 'text-violet-500',
  Accessories: 'text-rose-500',
}

const ITEM_BG = {
  Pet: 'from-amber-500/20 to-amber-100/10',
  Electronics: 'from-sky-500/20 to-sky-100/10',
  Keys: 'from-yellow-500/20 to-yellow-100/10',
  Documents: 'from-emerald-500/20 to-emerald-100/10',
  Clothing: 'from-violet-500/20 to-violet-100/10',
  Accessories: 'from-rose-500/20 to-rose-100/10',
}

export default function LostAndFoundList({ 
  items, 
  totalItems, 
  totalPages, 
  currentPage, 
  setCurrentPage, 
  onSelectItem,
  imageErrors,
  onImageError,
  activeTab,
  activeFilter,
  search,
  userRole = 'resident'
}) {
  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || (activeTab === 'active' && item.status !== 'resolved') || (activeTab === 'resolved' && item.status === 'resolved')
    const matchesCategory = activeFilter === 'All Items' || item.category === activeFilter
    const name = (item.name || item.itemName || '').toString()
    const location = (item.location || '').toString()
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                          location.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesCategory && matchesSearch
  })

  // Handle client-side pagination if totalPages is calculated elsewhere but items contains all items
  const itemsToDisplay = (items.length > filteredItems.length || totalPages > 1) ? filteredItems : items;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item._id || item.id || index}
            className="group bg-slate-100 dark:bg-slate-800/30 rounded-md overflow-hidden transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800" onClick={() => onSelectItem(item)}>
              {item.image && !imageErrors[item._id || item.id] ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onError={() => onImageError(item._id || item.id)}
                />
              ) : null}
              <div className={`absolute inset-0 bg-linear-to-br ${ITEM_BG[item.category] || 'from-slate-500/20 to-slate-100/10'} ${item.image && !imageErrors[item._id || item.id] ? 'hidden' : 'flex'} items-center justify-center cursor-pointer`}>
                {item.iconComponent && <item.iconComponent className={`size-12 opacity-40 ${CATEGORY_COLORS[item.category] || 'text-slate-500'}`} />}
              </div>
              <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-md shadow-xl border border-white/20 transition-all duration-300 group-hover:scale-110
                ${(item.status || item.type) === 'lost' ? 'bg-rose-500/90 shadow-rose-500/20' : 
                  (item.status || item.type) === 'resolved' ? 'bg-[#1241a1]/90 shadow-blue-500/20' : 
                  'bg-emerald-500/90 shadow-emerald-500/20'}`}>
                {(item.status || item.type) === 'lost' ? <AlertCircle size={10} strokeWidth={3} /> : 
                 (item.status || item.type) === 'resolved' ? <CheckCircle2 size={10} strokeWidth={3} /> : 
                 <Search size={10} strokeWidth={3} />}
                {item.status || item.type}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {item.iconComponent && <item.iconComponent size={16} className={`${CATEGORY_COLORS[item.category] || 'text-[#1241a1]'}`} />}
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.category}</span>
              </div>
              <h3 className="text-base font-bold leading-tight mb-4 text-slate-900 dark:text-white truncate">{item.name}</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <MapPin size={14} className="text-[#1241a1]" />
                  <span className="text-xs font-medium">{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar size={14} className="text-[#1241a1]" />
                  <span className="text-xs font-medium">{item.date}</span>
                </div>
              </div>
              
              <div className="mt-8 flex gap-2">
                <button 
                  onClick={() => onSelectItem(item)}
                  className={`flex-1 py-2.5 rounded-md text-[11px] font-semibold uppercase tracking-widest transition-all ${
                    userRole === 'admin' 
                    ? 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100' 
                    : 'bg-[#1241a1] text-white hover:brightness-110 shadow-lg shadow-[#1241a1]/20'
                  }`}
                >
                  {userRole === 'admin' ? 'Manage' : 'View Details'}
                </button>
                {userRole === 'admin' && (
                   <button 
                   onClick={(e) => {
                     e.stopPropagation();
                   }}
                   className="px-3 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
                   title="Quick Resolve"
                 >
                   <CheckCircle2 size={16} />
                 </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-12">
        <p className="text-sm text-slate-500">
          Showing <span className="font-bold text-slate-700 dark:text-slate-300">{filteredItems.length}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{totalItems}</span> items
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="size-10 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`size-10 flex items-center justify-center rounded-md text-[11px] font-bold uppercase tracking-widest transition-all ${p === currentPage ? 'bg-[#1241a1] text-white shadow-xl shadow-[#1241a1]/20' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {p}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="size-10 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
