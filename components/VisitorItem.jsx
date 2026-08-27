import React from 'react'

function VisitorItem({ name, role, status, img }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer bg-[#1a1d23]/90 bg-[#0B0C11] p-3 rounded-xl border-none transition-all shadow-inner">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg overflow-hidden shrink-0">
          <img src={img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white text-white truncate">{name}</p>
          <p className="text-[10px] font-semibold text-white0 text-[#8a8f98] uppercase tracking-wider truncate">{role}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${status === 'In' || status === 'Verified' ? 'text-emerald-600 text-emerald-400 bg-emerald-500/10' : 'text-white0 bg-[#2a2d33]/10'} px-2.5 py-1 rounded-full shrink-0 border-none`}>
        {status}
      </span>
    </div>
  )
}

export default VisitorItem