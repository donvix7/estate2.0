'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Plus, ArrowUpRight, History, CreditCard, Wallet, Nfc } from 'lucide-react'

export function WalletCard({ balance = 0, currency = "$" }) {
  const [showBalance, setShowBalance] = useState(true)
  
  // Format balance with commas
  const formattedBalance = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(balance)

  return (
    <div className="p-4 max-w-2xl mx-auto rounded-xl relative z-40 overflow-hidden text-white w-full group transition-all duration-300 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-xl shadow-slate-900/50 shadow-slate-950/70 ">
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="relative p-7 sm:p-8 flex flex-col h-full z-10">
        
        {/* Top Section: Title & Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 bg-amber-500/30 flex items-center justify-center">
               <Wallet className="w-5 h-5 text-amber-400 text-amber-300" />
            </div>
            <div>
              <span className="font-semibold text-white tracking-wide text-sm drop-shadow-sm">Estate Wallet</span>
              <span className="text-[10px] text-amber-300/80 text-amber-200/70 uppercase tracking-widest font-medium block">Digital Card</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Nfc className="w-6 h-6 text-amber-300/60 text-amber-200/50 mr-2 rotate-12" />
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 bg-white/5 hover:bg-white/15 transition-all duration-200 text-white hover:scale-105 backdrop-blur-sm "
              aria-label="Toggle balance visibility"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Middle Section: Balance */}
        <div className="mb-10 pl-1">
          <p className="text-amber-200/80 text-amber-300/70 text-xs uppercase tracking-[0.2em] font-semibold mb-2 drop-shadow-sm">Available Balance</p>
          <div className="flex items-baseline gap-1.5">
             <span className="text-3xl font-semibold text-white drop-shadow-md">{currency}</span>
             <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white drop-shadow-lg">
               {showBalance ? formattedBalance : '••••••••'}
             </h2>
          </div>
          {/* Subtle balance indicator */}
          <div className="mt-2 flex items-center gap-2">
            <div className="w-16 h-1 rounded-full bg-amber-400/30 bg-amber-400/20" />
            <div className="w-8 h-1 rounded-full bg-amber-400/10 bg-amber-400/5" />
          </div>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-auto pt-2">
          <button className="flex flex-col items-center justify-center py-3.5 px-2 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 transition-all duration-200 shadow-lg shadow-amber-700/20 shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-700/30 hover:shadow-amber-500/30 group/btn">
            <Plus className="w-5 h-5 mb-1.5 text-white drop-shadow group-hover/btn:scale-110 transition-transform duration-200" />
            <span className="text-xs font-semibold tracking-wide text-white drop-shadow">Top Up</span>
          </button>
          
          <button className="flex flex-col items-center justify-center py-3.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 bg-white/5 hover:bg-white/15 transition-all duration-200 group/btn backdrop-blur-sm shadow-lg shadow-black/5">
            <ArrowUpRight className="w-5 h-5 mb-1.5 text-amber-300 text-amber-200 group-hover/btn:scale-110 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
            <span className="text-xs font-semibold tracking-wide text-white/90 text-white/80">Transfer</span>
          </button>
          
          <button className="flex flex-col items-center justify-center py-3.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 bg-white/5 hover:bg-white/15 transition-all duration-200 group/btn backdrop-blur-sm  shadow-lg shadow-black/5">
            <History className="w-5 h-5 mb-1.5 text-amber-300 text-amber-200 group-hover/btn:scale-110 transition-transform duration-200" />
            <span className="text-xs font-semibold tracking-wide text-white/90 text-white/80">History</span>
          </button>
        </div>
        
      </div>
    </div>
  )
}