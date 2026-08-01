'use client'

import { useEffect, useState } from 'react'
import { Building2, CheckCircle, CheckCircle2, GlassWater, HelpCircle, Home, Mountain, PlusCircle, TreeDeciduous } from 'lucide-react'
import Link from 'next/link';
import { getAllEstates, setEstate } from '@/lib/service';
import { getCurrentUser, getMemberships, sendJoinRequest } from '@/lib/action';
import { useRouter } from 'next/navigation';

// Mock data for available estates

// Icon mapping
const IconMap = {
  building: Building2,
  water: GlassWater,
  tree: TreeDeciduous,
  mountain: Mountain,
}

export default function EstateSelectionPage() {
  const [selectedEstateId, setSelectedEstateId] = useState('')
  const [joinedEstateIds, setJoinedEstateIds] = useState([])
  const [notification, setNotification] = useState(null)
  const [estates, setEstates] = useState([])
  const [memberships, setMemberships] = useState([])

  useEffect(() => {
    const fetchEstates = async () => {
      const estates = await getAllEstates()
      const memberships = await getMemberships()
      setEstates(estates)
      setMemberships(memberships)

    }
    fetchEstates()
  }, [])
  const router = useRouter();

  const handleProceed = async (estateId) => {
    const res = await setEstate(estateId)
    if(res.ok){
      router.push('/dashboard/resident');
    }
    else{
      setNotification({
        message: res?.message || 'Failed to set estate. Please try again.',
        type: 'warning',
      })
      setTimeout(() => setNotification(null), 2500)
    }
  }
const AVAILABLE_ESTATES = estates;

  const handleJoinEstate = async() => {
    // Guard must come before the API call
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

    const res = await sendJoinRequest(selectedEstateId)

    if (!res?.success) {
      setNotification({
        message: res?.message || 'Failed to send join request. Please try again.',
        type: 'warning',
      })
      setTimeout(() => setNotification(null), 2500)
      return
    }

    // Only add to joined list on success
    setJoinedEstateIds([...joinedEstateIds, selectedEstateId])

    // Show success notification
    const estateName = AVAILABLE_ESTATES.find(e => e.id === selectedEstateId)?.estateName || selectedEstateId
    setNotification({
      message: `Join request for "${estateName}" sent successfully.`,
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
      <div className="relative z-20 w-full max-w-[960px] flex flex-col md:flex-row bg-white/95 min-h-[500px] dark:bg-slate-900/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Visual Context */}
        <div className=" md:flex flex-1 flex-col justify-between p-10 bg-slate-100">
          
          
          <div className="space-y-4">
              <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <CheckCircle className="size-4 text-emerald-500" />
                Joined Estates
              </h4>
              <span className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium">
                {memberships.length}
              </span>
            </div>
          </div>
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 custom-scroll">
              {memberships.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm flex flex-col gap-2 items-center">
                  <Home className="size-8 mx-auto mb-2 opacity-40" />
                  No joined estates yet. Use the dropdown to join one 
                  <span className="text-slate-500 dark:text-slate-400 px-2">or</span>
                  <Link className='text-blue-100 bg-slate-900 px-4 py-2 w-fit mx:auto rounded-lg font-bold' href="/auth/login"> return to login page</Link>
                </div>
              ) : (
                memberships.map((memberships) => {
                  
                  return (
                    <div
                      key={memberships.id}
                      onClick={() => handleProceed(memberships.estate.id)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-slate-400/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                       
                        <div>
                          <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
                            {memberships.name}
                          </p>
                          <p className=" text-slate-900">
                            joined • {memberships.estate.estateName}
                          </p>
                        </div>
                      </div>
                      <span className="text-emerald-500 text-xs bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
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
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Home className="size-6 text-slate-500" />
              Join Estate
            </div>
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

          {/* Available Estate - Scrollable List */}
<div className="sm:flex-row gap-3 items-start sm:items-end mb-8">
  <div className="w-full flex flex-col">
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
      <Building2 className="inline size-4 mr-1" />
      Available Estate
    </label>
    <div className="relative">
      {/* Scrollable Container */}
      <div className="w-full border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1241a1] scrollbar-track-slate-100 dark:scrollbar-track-slate-700">
          {estates.length > 0 ? (
            estates.map((estate) => (
              <button
                key={estate.id}
                type="button"
                onClick={() => setSelectedEstateId(estate.id)}
                className={`w-full text-left px-5 py-3 hover:bg-slate-400 dark:hover:bg-slate-400 hover:text-white transition-colors text-sm border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${
                  selectedEstateId === estate.id 
                    ? 'text-slate-900 dark:text-slate-300' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{estate.estateName}</span>
                  {selectedEstateId === estate.id && (
                    <CheckCircle2 className="size-4 text-slate-900" />
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="px-5 py-8 text-center text-slate-400 text-sm">
              No estates available
            </div>
          )}
        </div>
      </div>
      
      {/* Optional: Show selected estate name below */}
      {selectedEstateId && (
        <p className="mt-2 text-xs text-slate-800 dark:text-slate-300 font-medium">
          Selected: {AVAILABLE_ESTATES.find(e => e.id === selectedEstateId)?.estateName}
        </p>
      )}
    </div>
  </div>
            <button
              onClick={handleJoinEstate}
              className="w-full mt-4  bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <PlusCircle className="size-5" />
              Join Estate
            </button>
          </div>
          <Link href="/" className="w-full mt-4 text-center text-amber-700 hover:text-amber-800 font-semibold">
            Return to Home page
          </Link>

        
         
        </div>
      </div>

    </div>
  )
}