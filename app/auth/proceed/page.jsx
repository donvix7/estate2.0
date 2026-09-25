'use client'

import { useEffect, useState } from 'react'
import { 
  Building2, 
  CheckCircle, 
  CheckCircle2, 
  HelpCircle, 
  Home, 
  PlusCircle, 
  X, 
  LogIn, 
  Shield,
  ArrowRight,
  MapPin,
  BadgeCheck,
  Eye,
  Search,
  SlidersHorizontal
} from 'lucide-react'
import Link from 'next/link';
import { getAllEstates, setEstate } from '@/lib/service';
import { getMemberships, sendJoinRequest, setRole } from '@/lib/action';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EstateSelectionPage() {
  const [joinedEstateIds, setJoinedEstateIds] = useState([])
  const [notification, setNotification] = useState(null)
  const [estates, setEstates] = useState([])
  const [memberships, setMemberships] = useState([])
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingEstateId, setPendingEstateId] = useState(null)
  const [selectedMembership, setSelectedMembership] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const params = useSearchParams();

  const selectedrole = params.get('role');

  useEffect(() => {
    setRole(selectedrole)

    const fetchEstates = async () => {
      const estates = await getAllEstates()
      const memberships = await getMemberships()
      setEstates(estates)
      setMemberships(memberships)
      
      const joinedIds = memberships.map(m => m.estate.id)
      setJoinedEstateIds(joinedIds)
    }
    fetchEstates()
  }, [])

  const router = useRouter();

  const handleProceed = async () => {
    if (!selectedMembership) return

    await setRole(selectedrole)

    const res = await setEstate(selectedMembership.estate.id)
    if(res.ok){
      if(selectedrole === 'security'){
        router.push('/dashboard/security');
      }else if(selectedrole === 'admin'){
        router.push('/dashboard/admin');
      }else{
        router.push('/dashboard/resident');
      }
    }
    else{
      setNotification({
        message: res?.message || 'Failed to set estate. Please try again.',
        type: 'warning',
      })
      setTimeout(() => setNotification(null), 2500)
      setShowConfirmModal(false)
    }
  }

  const handleEstateClick = (membership) => {
    setSelectedMembership(membership)
    setShowConfirmModal(true)
  }

  const handleJoinEstate = async(estateId) => {
    if (!estateId) return

    if (joinedEstateIds.includes(estateId)) {
      setNotification({
        message: 'You are already a member of this estate.',
        type: 'warning',
      })
      setTimeout(() => setNotification(null), 2500)
      return
    }

    setPendingEstateId(estateId)
    setShowJoinModal(true)
  }

  const confirmJoinEstate = async () => {
    if (!pendingEstateId) return

    const res = await sendJoinRequest(pendingEstateId)

    if (!res?.success) {
      setNotification({
        message: res?.message || 'Failed to send join request. Please try again.',
        type: 'warning',
      })
      setTimeout(() => setNotification(null), 2500)
      setShowJoinModal(false)
      setPendingEstateId(null)
      return
    }

    setJoinedEstateIds([...joinedEstateIds, pendingEstateId])

    const estateName = estates.find(e => e.id === pendingEstateId)?.estateName || pendingEstateId
    setNotification({
      message: `Join request for "${estateName}" sent successfully.`,
      type: 'success',
    })
    setTimeout(() => setNotification(null), 2500)
    
    setShowJoinModal(false)
    setPendingEstateId(null)
  }

  const cancelJoinEstate = () => {
    setShowJoinModal(false)
    setPendingEstateId(null)
  }

  const cancelConfirmEstate = () => {
    setShowConfirmModal(false)
    setSelectedMembership(null)
  }

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-500/20',
      security: 'bg-slate-500/10 text-slate-300 ring-1 ring-inset ring-slate-500/20',
      resident: 'bg-sky-500/10 text-sky-300 ring-1 ring-inset ring-sky-500/20'
    }
    return styles[role] || styles.resident
  }

  const getMembership = (estateId) => {
    return memberships.find(m => m.estate.id === estateId)
  }

  const isMember = (estateId) => {
    return joinedEstateIds.includes(estateId)
  }

  const filteredEstates = estates.filter(estate => {
    const matchesSearch = estate.estateName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' ? true :
                          filterStatus === 'joined' ? isMember(estate.id) :
                          filterStatus === 'available' ? !isMember(estate.id) : true
    
    return matchesSearch && matchesStatus
  })

  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
  }

  return (
    <div className="min-h-screen w-full bg-[#111318] text-white">
      {/* Top Header */}
      <div className="border-b border-[#262a32] bg-[#0d0f13]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1241a1]/15 text-blue-300">
              <Building2 className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-base font-semibold text-white">EMSS</span>
              <p className="truncate text-xs text-[#8a8f98]">Estate management</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-[#2a2d33] bg-[#15171c] px-3 py-1.5 text-xs font-medium capitalize text-[#c6c8ce]">
            {selectedrole || 'Account'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-2">
          <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Choose an estate</p>
          <p className="mt-2 text-sm leading-6 text-[#a4a7af]">Access an estate you belong to, or request to join a new one.</p>
        </div>
        {/* Notification */}
        {notification && (
          <div className={`flex items-center gap-3 rounded-xl border p-3.5 animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="size-5 shrink-0" />
            ) : (
              <HelpCircle className="size-5 shrink-0" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-2xl border border-[#2a2d33] bg-[#15171c] p-3 sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8a8f98]" />
              <input
                type="text"
                placeholder="Search estates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[#30343d] bg-[#0d0f13] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#858a95] transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center gap-3 md:shrink-0">
              {/* Status Filter */}
              <div className="flex flex-1 items-center gap-2 md:flex-none">
                <SlidersHorizontal className="size-4 text-[#8a8f98] shrink-0" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-[#30343d] bg-[#0d0f13] px-4 py-3 text-sm text-white transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:w-auto"
                >
                  <option value="all">All Estates</option>
                  <option value="joined">Joined</option>
                  <option value="available">Available</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm text-[#a4a7af] transition-colors hover:bg-[#242730] hover:text-white"
                >
                  Clear
                </button>
              )}

              {/* Results count */}
              <div className="ml-auto whitespace-nowrap text-sm text-[#8a8f98] md:ml-0">
                <span className="font-medium text-white">{filteredEstates.length}</span>{' '}
                {filteredEstates.length === 1 ? 'estate' : 'estates'}
              </div>
            </div>
          </div>
        </div>

        {/* Estates Table (sm+) */}
        <div className="hidden overflow-hidden rounded-2xl border border-[#2a2d33] bg-[#15171c] sm:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2d33] bg-[#15171c]">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#a4a7af]">
                    Estate Name
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-[#a4a7af]">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-[#a4a7af]">
                    Your Role
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-[#a4a7af]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2d33]/70">
                {filteredEstates.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <Building2 className="mb-3 size-10 text-[#8a8f98] opacity-40" />
                        <p className="text-sm font-medium text-white">No estates found</p>
                        <p className="text-xs text-[#8a8f98] mt-1">Try adjusting your search or filters</p>
                        {(searchTerm || filterStatus !== 'all') && (
                          <button
                            onClick={clearFilters}
                            className="mt-3 text-sm text-[#1241a1] hover:underline transition-colors"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEstates.map((estate) => {
                    const member = getMembership(estate.id)
                    const joined = isMember(estate.id)
                    
                    return (
                      <tr key={estate.id} className="transition-colors hover:bg-white/[0.025]">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-[#1241a1]/10">
                              <Building2 className="size-[18px] text-blue-300" />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {estate.estateName}
                              </p>
                              {estate.location && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-[#8a8f98]">
                                  <MapPin className="size-3" />
                                  {estate.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {joined ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                              <BadgeCheck className="size-3.5" />
                              Joined
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#20232a] px-3 py-1 text-xs font-medium text-[#a4a7af]">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {joined && member ? (
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${getRoleBadge(member.role.name)}`}>
                              {member.role.name}
                            </span>
                          ) : (
                            <span className="text-xs text-[#8a8f98]">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {joined ? (
                            <button
                              onClick={() => handleEstateClick(member)}
                              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-[#343944] px-3.5 py-2 text-sm font-medium text-[#e4e5e8] transition-colors hover:bg-[#242730]"
                            >
                              <Eye className="size-4" />
                              Access
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinEstate(estate.id)}
                              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#1241a1] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                              <PlusCircle className="size-4" />
                              Join
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estates Cards (mobile only) */}
        <div className="sm:hidden space-y-3">
          {filteredEstates.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-[#2a2d33] bg-[#15171c] px-6 py-12 text-center">
              <Building2 className="mb-3 size-10 text-[#8a8f98] opacity-40" />
              <p className="text-sm font-medium text-white">No estates found</p>
              <p className="text-xs text-[#8a8f98] mt-1">Try adjusting your search or filters</p>
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-[#1241a1] hover:underline transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredEstates.map((estate) => {
              const member = getMembership(estate.id)
              const joined = isMember(estate.id)

              return (
                <div key={estate.id} className="rounded-2xl border border-[#2a2d33] bg-[#15171c] p-4 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1241a1]/10">
                        <Building2 className="size-[18px] text-blue-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">
                          {estate.estateName}
                        </p>
                        {estate.location && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-[#8a8f98]">
                            <MapPin className="size-3 shrink-0" />
                            <span className="truncate">{estate.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {joined ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                        <BadgeCheck className="size-3.5" />
                        Joined
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-[#20232a] px-3 py-1 text-xs font-medium text-[#a4a7af]">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-[#2a2d33]">
                    <div>
                      {joined && member ? (
                        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getRoleBadge(member.role.name)}`}>
                          {member.role.name}
                        </span>
                      ) : (
                        <span className="text-xs text-[#8a8f98]">No role yet</span>
                      )}
                    </div>

                    {joined ? (
                      <button
                        onClick={() => handleEstateClick(member)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#343944] px-3.5 py-2 text-sm font-medium text-[#e4e5e8] transition-colors hover:bg-[#242730]"
                      >
                        <Eye className="size-4" />
                        Access
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinEstate(estate.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#1241a1] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        <PlusCircle className="size-4" />
                        Join
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2a2d33] pt-5">
          <Link href="/" className="flex items-center gap-1 text-sm text-[#8a8f98] transition-colors hover:text-white">
            <ArrowRight className="size-4 rotate-180" />
            Back to Home
          </Link>
        </div>
      </main>

      {/* Join Estate Modal */}
      {showJoinModal && pendingEstateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div role="dialog" aria-modal="true" aria-labelledby="join-estate-title" className="w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#30343d] bg-[#15171c] shadow-2xl max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="border-b border-[#2a2d33] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1241a1]/20 rounded-xl">
                    <Building2 className="size-5 text-[#1241a1]" />
                  </div>
                  <p id="join-estate-title" className="font-semibold text-white">Request to join</p>
                </div>
                <button
                  onClick={cancelJoinEstate}
                  aria-label="Close dialog"
                  className="rounded-lg p-2 transition-colors hover:bg-[#242730]"
                >
                  <X className="size-4 text-[#8a8f98] hover:text-white" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-[#2a2d33] bg-[#0d0f13] p-4">
                <p className="mb-1 text-xs text-[#8a8f98]">Estate</p>
                <p className="font-medium text-white">
                  {estates.find(e => e.id === pendingEstateId)?.estateName}
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                <div className="flex items-start gap-2">
                  <HelpCircle className="size-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-300">
                    You'll be notified once an admin approves your request
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={cancelJoinEstate}
                className="flex-1 rounded-xl border border-[#343944] py-2.5 text-sm font-medium text-[#c6c8ce] transition-colors hover:bg-[#242730] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmJoinEstate}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1241a1] py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <CheckCircle2 className="size-4" />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Estate Modal */}
      {showConfirmModal && selectedMembership && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div role="dialog" aria-modal="true" aria-labelledby="access-estate-title" className="w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#30343d] bg-[#15171c] shadow-2xl max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="border-b border-[#2a2d33] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-500/20 rounded-xl">
                    <Shield className="size-5 text-slate-500" />
                  </div>
                  <p id="access-estate-title" className="font-semibold text-white">Access estate</p>
                </div>
                <button
                  onClick={cancelConfirmEstate}
                  aria-label="Close dialog"
                  className="rounded-lg p-2 transition-colors hover:bg-[#242730]"
                >
                  <X className="size-4 text-[#8a8f98] hover:text-white" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="space-y-3 rounded-xl border border-[#2a2d33] bg-[#0d0f13] p-4">
                <div>
                  <p className="text-xs text-[#8a8f98]">Estate</p>
                  <p className="font-medium text-white">{selectedMembership.estate.estateName}</p>
                </div>
                <div className="pt-3 border-t border-[#2a2d33]">
                  <p className="text-xs text-[#8a8f98]">Your Role</p>
                  <p className={`text-sm font-medium capitalize mt-0.5 inline-block px-3 py-1 rounded-full ${getRoleBadge(selectedMembership.role.name)}`}>
                    {selectedMembership.role.name}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#2a2d33] bg-[#0d0f13] p-3">
                <div className="flex items-start gap-2">
                  <Shield className="size-4 text-[#8a8f98] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#8a8f98]">
                    You're accessing <span className="font-medium text-white">{selectedMembership.estate.estateName}</span> with <span className="font-medium text-white capitalize">{selectedMembership.role.name}</span> privileges
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={cancelConfirmEstate}
                className="flex-1 rounded-xl border border-[#343944] py-2.5 text-sm font-medium text-[#c6c8ce] transition-colors hover:bg-[#242730] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1241a1] py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <LogIn className="size-4" />
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
