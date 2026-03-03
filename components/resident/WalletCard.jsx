'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Plus, ArrowUpRight, History, CreditCard, Wallet, Nfc } from 'lucide-react'

export function WalletCard({ balance = 0, currency = "₦" }) {
  const [showBalance, setShowBalance] = useState(true)
  
  // Format balance with commas
  const formattedBalance = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(balance)

  return (
    <div className="p-4 max-w-2xl mx-auto rounded-2xl relative z-40 overflow-hidden text-white shadow-xl shadow-blue-900/20 w-full group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-linear-to-br from-indigo-900 via-gray-900 to-blue-900">
    
      <div className="relative p-7 sm:p-8 flex flex-col h-full z-10">
        
        {/* Top Section: Title & Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner">
               <Wallet className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <span className="font-bold text-gray-100 tracking-wide text-sm font-heading block">Estate Wallet</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Digital Card</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Nfc className="w-6 h-6 text-gray-400/60 mr-2" />
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-sm transition-colors text-gray-300 hover:text-white"
              aria-label="Toggle balance visibility"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Middle Section: Balance */}
        <div className="mb-10 pl-1">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">Available Balance</p>
          <div className="flex items-baseline gap-1.5 drop-shadow-lg">
             <span className="text-3xl font-bold text-blue-300/80">{currency}</span>
             <h2 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-gray-300">
               {showBalance ? formattedBalance : '••••••••'}
             </h2>
          </div>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-auto pt-2">
          <button className="flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl bg-blue-600/90 hover:bg-blue-500 backdrop-blur-md transition-all group/btn shadow-lg shadow-blue-900/50 hover:shadow-blue-500/30">
            <Plus className="w-5 h-5 mb-1.5 text-white group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wide text-white">Top Up</span>
          </button>
          
          <button className="flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all group/btn">
            <ArrowUpRight className="w-5 h-5 mb-1.5 text-indigo-300 group-hover/btn:scale-110 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            <span className="text-xs font-bold tracking-wide text-gray-200">Transfer</span>
          </button>
          
          <button className="flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all group/btn">
            <History className="w-5 h-5 mb-1.5 text-purple-300 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-wide text-gray-200">History</span>
          </button>
        </div>
      </div>
    </div>
  )
}
