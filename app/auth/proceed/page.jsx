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
      admin: 'bg-[#1241a1]/20 text-[#1241a1] border border-[#1241a1]/30',
      security: 'bg-[#1241a1]/20 text-[#1241a1] border border-[#1241a1]/30',
      resident: 'bg-[#1241a1]/20 text-[#1241a1] border border-[#1241a1]/30'
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
    <div className="min-h-screen w-full bg-[#0d0f13]">
      {/* Top Header */}
      <div className="border-b border-[#2a2d33] bg-[#0d0f13]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1241a1]/20 rounded-xl">
              <Building2 className="size-5 text-[#1241a1]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Available Estates</h1>
              <p className="text-xs text-[#8a8f98]">Browse and manage your estate memberships</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1241a1]/10 text-[#1241a1] border border-[#1241a1]/20">
            <span className="size-1.5 rounded-full bg-[#1241a1] animate-pulse"></span>
            Active
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Notification */}
        {notification && (
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${
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
        <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8a8f98]" />
              <input
                type="text"
                placeholder="Search estates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0d0f13] border border-[#2a2d33] rounded-lg text-sm text-white placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#1241a1] focus:border-[#1241a1] transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-[#8a8f98]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-[#0d0f13] border border-[#2a2d33] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#1241a1] focus:border-[#1241a1] transition-all cursor-pointer"
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
                className="px-4 py-2.5 text-sm text-[#8a8f98] hover:text-white hover:bg-[#2a2d33] rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}

            {/* Results count */}
            <div className="flex items-center text-sm text-[#8a8f98] whitespace-nowrap">
              <span className="font-medium text-white">{filteredEstates.length}</span>
              <span className="ml-1">estates</span>
            </div>
          </div>
        </div>

        {/* Estates Table */}
        <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2d33] bg-[#0d0f13]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">
                    Estate Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">
                    Your Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2d33]">
                {filteredEstates.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Building2 className="size-12 text-[#8a8f98] opacity-30 mb-3" />
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
                      <tr key={estate.id} className="hover:bg-[#2a2d33]/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              joined 
                                ? 'bg-[#1241a1]/10' 
                                : 'bg-[#0d0f13]'
                            }`}>
                              <Building2 className={`size-4 ${
                                joined ? 'text-[#1241a1]' : 'text-[#8a8f98]'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {estate.estateName}
                              </p>
                              {estate.location && (
                                <p className="text-xs text-[#8a8f98] flex items-center gap-1">
                                  <MapPin className="size-3" />
                                  {estate.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {joined ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1241a1]/10 text-[#1241a1] rounded-full text-xs font-medium border border-[#1241a1]/20">
                              <BadgeCheck className="size-3.5" />
                              Joined
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0d0f13] text-[#8a8f98] rounded-full text-xs font-medium border border-[#2a2d33]">
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
                              className="px-4 py-2 bg-[#1241a1] hover:bg-[#1a51b1] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ml-auto"
                            >
                              <Eye className="size-4" />
                              Access
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinEstate(estate.id)}
                              className="px-4 py-2 bg-[#2a2d33] hover:bg-[#3a3d43] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ml-auto"
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

        {/* Footer */}
        <div className="pt-6 border-t border-[#2a2d33] flex items-center justify-between">
          <Link href="/" className="text-sm text-[#8a8f98] hover:text-white transition-colors flex items-center gap-1">
            <ArrowRight className="size-4 rotate-180" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 text-xs text-[#8a8f98]">
            <span>Secure Connection</span>
            <span className="w-1 h-1 rounded-full bg-[#2a2d33]" />
            <span>v2.0</span>
          </div>
        </div>
      </div>

      {/* Join Estate Modal */}
      {showJoinModal && pendingEstateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1a1d23] rounded-2xl shadow-2xl overflow-hidden border border-[#2a2d33] animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-[#2a2d33]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1241a1]/20 rounded-xl">
                    <Building2 className="size-5 text-[#1241a1]" />
                  </div>
                  <h3 className="font-semibold text-white">Join Estate</h3>
                </div>
                <button
                  onClick={cancelJoinEstate}
                  className="p-1 rounded-lg hover:bg-[#2a2d33] transition-colors"
                >
                  <X className="size-4 text-[#8a8f98] hover:text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-[#0d0f13] rounded-xl p-4 border border-[#2a2d33]">
                <p className="text-xs text-[#8a8f98] mb-1">Estate</p>
                <p className="font-medium text-white">
                  {estates.find(e => e.id === pendingEstateId)?.estateName}
                </p>
              </div>

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <HelpCircle className="size-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-300">
                    You'll be notified once an admin approves your request
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={cancelJoinEstate}
                className="flex-1 py-2.5 rounded-xl border border-[#2a2d33] text-[#8a8f98] hover:text-white hover:bg-[#2a2d33] transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmJoinEstate}
                className="flex-1 py-2.5 rounded-xl bg-[#1241a1] hover:bg-[#1a51b1] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
          <div className="w-full max-w-2xl bg-[#1a1d23] rounded-2xl shadow-2xl overflow-hidden border border-[#2a2d33] animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-[#2a2d33]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1241a1]/20 rounded-xl">
                    <Shield className="size-5 text-[#1241a1]" />
                  </div>
                  <h3 className="font-semibold text-white">Access Estate</h3>
                </div>
                <button
                  onClick={cancelConfirmEstate}
                  className="p-1 rounded-lg hover:bg-[#2a2d33] transition-colors"
                >
                  <X className="size-4 text-[#8a8f98] hover:text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-[#0d0f13] rounded-xl p-4 border border-[#2a2d33] space-y-3">
                <div>
                  <p className="text-xs text-[#8a8f98]">Estate</p>
                  <p className="font-medium text-white">{selectedMembership.estate.estateName}</p>
                </div>
                <div className="pt-3 border-t border-[#2a2d33]">
                  <p className="text-xs text-[#8a8f98]">Your Role</p>
                  <p className="text-sm font-medium capitalize mt-0.5 inline-block px-3 py-1 rounded-full bg-[#1241a1]/20 text-[#1241a1] border border-[#1241a1]/30">
                    {selectedMembership.role.name}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#0d0f13] rounded-xl border border-[#2a2d33]">
                <div className="flex items-start gap-2">
                  <Shield className="size-4 text-[#8a8f98] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#8a8f98]">
                    You're accessing <span className="font-medium text-white">{selectedMembership.estate.estateName}</span> with <span className="font-medium text-white capitalize">{selectedMembership.role.name}</span> privileges
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={cancelConfirmEstate}
                className="flex-1 py-2.5 rounded-xl border border-[#2a2d33] text-[#8a8f98] hover:text-white hover:bg-[#2a2d33] transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 py-2.5 rounded-xl bg-[#1241a1] hover:bg-[#1a51b1] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
