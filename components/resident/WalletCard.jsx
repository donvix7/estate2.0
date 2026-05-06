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
    <div className="p-4 max-w-2xl mx-auto rounded-md relative z-40 overflow-hidden text-white w-full group transition-all duration-300 bg-[#1241a1]">
    
      <div className="relative p-7 sm:p-8 flex flex-col h-full z-10">
        
        {/* Top Section: Title & Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
               <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-white tracking-wide text-sm block">Estate Wallet</span>
              <span className="text-[10px] text-white/60 uppercase tracking-widest">Digital Card</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Nfc className="w-6 h-6 text-white/40 mr-2" />
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="p-2.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Toggle balance visibility"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Middle Section: Balance */}
        <div className="mb-10 pl-1">
          <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-2">Available Balance</p>
          <div className="flex items-baseline gap-1.5">
             <span className="text-3xl font-semibold text-white">{currency}</span>
             <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
               {showBalance ? formattedBalance : '••••••••'}
             </h2>
          </div>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-auto pt-2">
          <button className="flex flex-col items-center justify-center py-3.5 px-2 rounded-md bg-white text-[#1241a1] hover:brightness-95 transition-all group/btn">
            <Plus className="w-5 h-5 mb-1.5 text-[#1241a1] group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-semibold tracking-wide text-[#1241a1]">Top Up</span>
          </button>
          
          <button className="flex flex-col items-center justify-center py-3.5 px-2 rounded-md bg-white/10 hover:bg-white/20 transition-all group/btn">
            <ArrowUpRight className="w-5 h-5 mb-1.5 text-white group-hover/btn:scale-110 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            <span className="text-xs font-semibold tracking-wide text-white">Transfer</span>
          </button>
          
          <button className="flex flex-col items-center justify-center py-3.5 px-2 rounded-md bg-white/10 hover:bg-white/20 transition-all group/btn">
            <History className="w-5 h-5 mb-1.5 text-white group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-semibold tracking-wide text-white">History</span>
          </button>
        </div>
      </div>
    </div>
  )
}
