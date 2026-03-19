'use client'

import React from 'react'
import Image from 'next/image'
import { 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  MessageCircle, 
  Share2, 
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function ItemDetailModal({ item, onClose }) {
  if (!item) return null

  const CATEGORY_COLORS = {
    Pets: 'text-amber-500 bg-amber-500/10',
    Electronics: 'text-sky-500 bg-sky-500/10',
    Keys: 'text-yellow-500 bg-yellow-500/10',
    Documents: 'text-emerald-500 bg-emerald-500/10',
    Clothing: 'text-violet-500 bg-violet-500/10',
    Accessories: 'text-rose-500 bg-rose-500/10',
  }

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left: Image Section */}
        <div className="md:w-1/2 relative h-64 md:h-auto bg-slate-100 dark:bg-slate-800">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center`}>
               <div className={`size-20 rounded-2xl flex items-center justify-center mb-4 ${CATEGORY_COLORS[item.category] || 'bg-slate-500/10 text-slate-500'}`}>
                  <Tag className="size-10" />
               </div>
               <p className="text-slate-400 font-medium">No photo provided for this item</p>
            </div>
          )}
          
          {/* Status Badge */}
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${item.status === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {item.status}
          </div>

          <button 
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full text-slate-500 shadow-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right: Content Section */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="hidden md:flex justify-end mb-2">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 ${CATEGORY_COLORS[item.category] || 'bg-slate-500/10 text-slate-500'}`}>
                <Tag size={12} />
                {item.category}
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {item.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Seen Location</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Calendar className="size-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Reported</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.date}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="size-4 text-[#1241a1]" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Description</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description || "The owner hasn't provided a detailed description yet, but you can contact them for more information if you believe this is your item."}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-auto pt-4">
              <button 
                onClick={() => toast.info('Contact protocol initiated. Secure channel opening...')}
                className="w-full bg-[#1241a1] hover:brightness-110 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl shadow-[#1241a1]/20"
              >
                <MessageCircle size={20} />
                Contact Owner
              </button>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('item', item.id);
                    navigator.clipboard.writeText(url.toString());
                    toast.success('Link copied to clipboard!');
                  }}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm active:scale-95"
                >
                  <Share2 size={16} />
                  Share
                </button>
                {item.status === 'found' && (
                  <button className="flex-1 border-2 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                    <CheckCircle2 size={16} />
                    I Found This
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
