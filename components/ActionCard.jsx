import Link from 'next/link'
import React from 'react'

function ActionCard({ icon, title, desc, href, bgColor }) {
  return (
    <Link href={href}>
      <div className={`${bgColor} p-8 rounded-2xl text-white relative overflow-hidden group shadow-xl hover:-translate-y-2 transition-all duration-500`}>
        <div className="relative z-10">
          <span className="material-symbols-outlined text-4xl mb-6 block opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all">{icon}</span>
          <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{title}</h4>
          <p className="text-white/70 text-sm font-medium leading-relaxed mb-6">{desc}</p>
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all">
            Access Portal
            <span className="material-symbols-outlined text-sm">arrow_outward</span>
          </span>
        </div>
        <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-white/5 text-[10rem] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">{icon}</span>
      </div>
    </Link>
  )
}

export default ActionCard