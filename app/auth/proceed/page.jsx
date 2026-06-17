'use client'

import { useState } from 'react'
import { 
  Building2, 
  CheckCircle, 
  PlusCircle, 
  Home,
  Water,
  Tree,
  Mountain,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link';

// Mock data for available estates
const AVAILABLE_ESTATES = [];

// Icon mapping
const IconMap = {
  building: Building2,
  water: Water,
  tree: Tree,
  mountain: Mountain,
}

export default function EstateSelectionPage() {
  const [selectedEstateId, setSelectedEstateId] = useState('estate-1')
  const [joinedEstateIds, setJoinedEstateIds] = useState(['estate-1', 'estate-2'])
  const [notification, setNotification] = useState(null)

  const handleJoinEstate = () => {
    if (!selectedEstateId) return

    // Check if already joined
    if (joinedEstateIds.includes(selectedEstateId)) {
      setNotification({
        message: 'You already joined this estate.',
        type: 'warning',
      })
      setTimeout(() => setNotification(null), 2500)
      return
    }

    // Add to joined estates
    setJoinedEstateIds([...joinedEstateIds, selectedEstateId])

    // Show success notification
    const estateName = AVAILABLE_ESTATES.find(e => e.id === selectedEstateId)?.name || selectedEstateId
    setNotification({
      message: `Joined "${estateName}" successfully.`,
      type: 'success',
    })
    setTimeout(() => setNotification(null), 2500)
  }

  const getIconComponent = (iconName) => {
    const Icon = IconMap[iconName] || Building2
    return <Icon className="text-sm" />
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/80 via-slate-900 to-slate-900" />
      
      {/* Main Card */}
      <div className="relative z-20 w-full max-w-[960px] flex flex-col md:flex-row bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Visual Context */}
        <div className=" md:flex flex-1 flex-col justify-between p-10 bg-[#1241a1]/10">
          
          
          <div className="space-y-4">
              <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <CheckCircle className="size-4 text-emerald-500" />
                Joined Estates
              </h4>
              <span className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium">
                {joinedEstateIds.length}
              </span>
            </div>
          </div>
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 custom-scroll">
              {joinedEstateIds ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm flex flex-col gap-2 items-center">
                  <Home className="size-8 mx-auto mb-2 opacity-40" />
                  No joined estates yet. Use the dropdown to join one 
                  <span className="text-slate-500 dark:text-slate-400 px-2">or</span>
                  <Link className='text-blue-100 bg-blue-500 px-4 py-2 w-fit mx:auto rounded-lg font-bold' href="/auth/login"> return to login page</Link>
                </div>
              ) : (
                joinedEstateIds.map((id) => {
                  const estate = AVAILABLE_ESTATES.find(e => e.id === id)
                  if (!estate) return null
                  const Icon = IconMap[estate.icon] || Building2
                  
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1241a1]/20 flex items-center justify-center text-[#1241a1]">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                            {estate.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            joined • {estate.units} unit{estate.units !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-emerald-500 text-xs bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="size-3" />
                        active
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Main Content */}
        <div className="flex-1 p-6 md:p-10 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Home className="size-6 text-[#1241a1]" />
              Join Estate
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Select an estate from the dropdown or view your joined estates
            </p>
          </div>

          {/* Notification Toast */}
          {notification && (
            <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
              notification.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="size-5 shrink-0" />
              ) : (
                <HelpCircle className="size-5 shrink-0" />
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          )}

          {/* Dropdown & Join Button */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end mb-8">
            <div className="w-full sm:w-2/3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                <Building2 className="inline size-4 mr-1" />
                Available Estate
              </label>
              <div className="relative">
                <select
                  value={selectedEstateId}
                  onChange={(e) => setSelectedEstateId(e.target.value)}
                  className="w-full appearance-none bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl py-3 pl-5 pr-12 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent outline-none transition shadow-sm cursor-pointer"
                >
                  {AVAILABLE_ESTATES ? AVAILABLE_ESTATES.map((estate) => (
                    <option key={estate.id} value={estate.id}>
                      {estate.name}
                    </option>
                  ))
                  : 
                  <option value="">No estates available</option>
                  }
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={handleJoinEstate}
              className="w-full sm:w-auto bg-[#1241a1] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <PlusCircle className="size-5" />
              Join Estate
            </button>
          </div>

        
          {/* Footer */}
          <div className="mt-6 pt-4 text-center border-t border-slate-200/60 dark:border-slate-700/40">
            <p className="text-slate-400 dark:text-slate-500 text-xs">
              <HelpCircle className="inline size-3 mr-1" />
              Need help? 
              <Link href="/" className="text-[#1241a1] font-medium hover:underline ml-1">
                Return to Home Page
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}