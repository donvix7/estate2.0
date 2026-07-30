'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ChevronRight, 
  ChevronLeft,
  Clock, 
  Droplets, 
  Zap, 
  Building2, 
  History, 
  Download, 
  Receipt, 
  ReceiptText,
  Cloud,
  Wrench,
  Megaphone,
  Shield,
  Search,
  AlertTriangle,
  User,
  Map,
  UserPlus2,
  User2,
  ReceiptEuro,
  Trash2,
  X,
  Check,
  Mail,
  Send,
  Crown,
  Sparkles,
  Gift,
  Users,
  UserX,
  Clock as ClockIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { WalletCard } from '@/components/resident/WalletCard'
import { getActiveBills, getServiceRequests, getRecentTransactions, getResidentTransactions, getFamilyMembers, getSubscriptions, getFamilyInvitations } from '@/lib/service'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingState } from '@/components/ui/LoadingState'
import { BackButton } from '@/components/ui/BackButton'
import { removeMember, inviteFamilyMember, acceptFamilyInvitation, rejectFamilyInvitation, subscribeToPlan } from '@/lib/action'
import { toast } from 'react-toastify'

const ICONS = {
  Cloud,
  Droplets,
  Wrench,
  Megaphone,
  Shield,
  Receipt,
  Map,
  Search,
  AlertTriangle,
  User,
  Building2,
  Zap
}

export default function FinancePage() {
  const [activeBills, setActiveBills] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTx, setSelectedTx] = useState(null)
  const [familyMembers, setFamilyMembers] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [familyInvitations, setFamilyInvitations] = useState([])
  
  // Modal States
  const [modals, setModals] = useState({
    removeMember: { isOpen: false, member: null },
    inviteMember: { isOpen: false, email: '', relationship: '' },
    subscribePlan: { isOpen: false, plan: null },
    invitations: { isOpen: false }
  })

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [constantBills, txs, members, subscriptions, invitations] = await Promise.all([
          getActiveBills(),
          getResidentTransactions(),
          getFamilyMembers(),
          getSubscriptions(),
          getFamilyInvitations()
        ])
        
        constantBills.success ? setActiveBills(constantBills.data) : setActiveBills([])
        txs.success ? setRecentTransactions(txs.data) : setRecentTransactions([])
        members.success ? setFamilyMembers(members.data) : setFamilyMembers([])
        subscriptions.success ? setSubscriptions(subscriptions.data) : setSubscriptions([])
        invitations.success ? setFamilyInvitations(invitations.data) : setFamilyInvitations([])
      } catch (error) {
        console.error('Failed to load finance data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Family Member Management
  const handleRemoveMember = async () => {
    const member = modals.removeMember.member
    if (!member) return

    setIsLoading(true)
    try {
      const res = await removeMember(member.id)
      setFamilyMembers(prev => prev.filter(m => m.id !== member.id))
      toast.success(res.message || 'Family member removed successfully')
      closeModal('removeMember')
    } catch (error) {
      console.error('Failed to remove family member:', error)
      toast.error('Failed to remove family member')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInviteMember = async () => {
    const { email, relationship } = modals.inviteMember
    if (!email || !relationship) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const res = await inviteFamilyMember({ email, relationship })
      toast.success(res.message || 'Invitation sent successfully')
      closeModal('inviteMember')
      // Refresh invitations
      const invitations = await getFamilyInvitations()
      if (invitations.success) setFamilyInvitations(invitations.data)
    } catch (error) {
      console.error('Failed to invite family member:', error)
      toast.error('Failed to send invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptInvitation = async (invitationId) => {
    setIsLoading(true)
    try {
      const res = await acceptFamilyInvitation(invitationId)
      toast.success(res.message || 'Invitation accepted')
      setFamilyInvitations(prev => prev.filter(inv => inv.id !== invitationId))
      // Refresh family members
      const members = await getFamilyMembers()
      if (members.success) setFamilyMembers(members.data)
    } catch (error) {
      console.error('Failed to accept invitation:', error)
      toast.error('Failed to accept invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectInvitation = async (invitationId) => {
    setIsLoading(true)
    try {
      const res = await rejectFamilyInvitation(invitationId)
      toast.success(res.message || 'Invitation rejected')
      setFamilyInvitations(prev => prev.filter(inv => inv.id !== invitationId))
    } catch (error) {
      console.error('Failed to reject invitation:', error)
      toast.error('Failed to reject invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribePlan = async () => {
    const plan = modals.subscribePlan.plan
    if (!plan) return

    setIsLoading(true)
    try {
      const res = await subscribeToPlan(plan.id)
      toast.success(res.message || `Subscribed to ${plan.name} plan`)
      closeModal('subscribePlan')
      // Refresh subscriptions
      const subscriptions = await getSubscriptions()
      if (subscriptions.success) setSubscriptions(subscriptions.data)
    } catch (error) {
      console.error('Failed to subscribe to plan:', error)
      toast.error('Failed to subscribe to plan')
    } finally {
      setIsLoading(false)
    }
  }

  // Modal Helpers
  const openModal = (name, data = null) => {
    setModals(prev => ({
      ...prev,
      [name]: { ...prev[name], isOpen: true, ...data }
    }))
  }

  const closeModal = (name) => {
    setModals(prev => ({
      ...prev,
      [name]: { ...prev[name], isOpen: false }
    }))
  }

  const handleDownloadReport = () => {
    const headers = "Date,Description,Amount,Status\n"
    const csvContent = recentTransactions.map(tx => `${tx.date},${tx.description},${tx.amount},${tx.status}`).join("\n")
    const blob = new Blob([headers + csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `finance_report_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleDownloadReceipt = (tx) => {
    const content = `RECEIPT\n-------\nDate: ${tx.date}\nDescription: ${tx.description}\nAmount: ${tx.amount}\nStatus: ${tx.status}\n\nThank you for your payment.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `receipt_${tx.date.replace(/ /g, '_')}.txt`
    link.click()
  }

  const TOTAL_OUTSTANDING = activeBills.reduce((s, b) => s + b.amount, 0)
  const formatNGN = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  const totalPages = Math.ceil(recentTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTransactions = recentTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Available plans for subscription
  const availablePlans = [
    { id: 'basic', name: 'Basic', price: 29, description: 'Essential features', features: ['Access to portal', 'Pay bills', 'View announcements'] },
    { id: 'premium', name: 'Premium', price: 59, description: 'Enhanced features', features: ['All Basic features', 'Family members (5)', 'Priority support'] },
    { id: 'enterprise', name: 'Enterprise', price: 99, description: 'Complete solution', features: ['All Premium features', 'Unlimited family', '24/7 support'] }
  ]

  if (isLoading) {
    return <LoadingState message="Auditing Financial Records..." />
  }

  return (
    <div className="min-h-screen">
      <div className="py-8 space-y-10">

        <PageHeader 
          title="Bills & Invoices" 
          description="Manage your property payments and view transaction history."
          icon={Receipt}
          iconColor="blue"
        >
          <div className="p-6 rounded-md flex items-center justify-between gap-8 min-w-[300px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-200 mb-1">Total Outstanding</p>
              <p className="text-3xl font-semibold text-slate-900 dark:text-amber-700">{formatNGN(TOTAL_OUTSTANDING)}</p>
            </div>
            <Link
              href="/dashboard/resident/finance/checkout"
              className="bg-amber-700 hover:brightness-110 text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-all whitespace-nowrap"
            >
              Pay All
            </Link>
          </div>
        </PageHeader>

        {/* Wallet Card */}
        <WalletCard />

        {/* ── Active Bills ── */}
        <section>
          <span className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="size-5 text-amber-700" />
            Active Bills
          </span>
          <div className="bg-slate-100 dark:dark:bg-[#818b94]/10 rounded-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {['Date', 'Description', 'Amount', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeBills.length > 0 ? (
                  activeBills.map((tx, i) => (
                    <tr key={i} className="group hover:bg-white dark:hover:bg-slate-800 transition-all">
                      <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap">{tx.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{tx.description}</td>
                      <td className={`px-6 py-4 text-sm font-semibold ${tx.amountClass || ''}`}>{tx.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tx.statusClass}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedTx(tx)}
                          className="text-slate-400 group-hover:text-[#1241a1] transition-colors"
                        >
                          <Receipt className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Wrench className="size-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-medium text-slate-600 dark:text-slate-300">No active bills</p>
                        <p className="text-xs">You have no outstanding bills at the moment.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Family Members Section ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="size-5 text-amber-700" />
              Family Members
              <span className="text-sm font-normal text-slate-400 ml-2">
                ({familyMembers.length} members)
              </span>
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => openModal('invitations')}
                className="text-xs font-semibold text-white bg-amber-700 hover:bg-amber-700/10 rounded-md px-3 py-1.5 flex items-center gap-1 transition-colors"
              >
                <Mail className="size-4" />
                Invitations ({familyInvitations.length})
              </button>
              <button 
                onClick={() => openModal('inviteMember', { email: '', relationship: '' })}
                className="text-xs font-semibold text-white bg-[#1241a1] hover:bg-[#1241a1]/90 rounded-md px-3 py-1.5 flex items-center gap-1 transition-colors"
              >
                <UserPlus2 className="size-4" />
                Invite Member
              </button>
            </div>
          </div>
          <div className="bg-slate-100 dark:dark:bg-[#818b94]/10 rounded-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {['Name', 'Relationship', 'Phone', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {familyMembers.length > 0 ? (
                  familyMembers.map((member, i) => (
                    <tr key={i} className="group hover:bg-white dark:hover:bg-slate-800 transition-all">
                      <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap">{member.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{member.relationship}</td>
                      <td className="px-6 py-4 text-sm">{member.phone}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          <CheckCircle2 className="size-3 mr-1" />
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => openModal('removeMember', { member })}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <UserX className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <User2 className="size-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-medium text-slate-600 dark:text-slate-300">No Family Members</p>
                        <p className="text-xs">Invite family members to share your subscription benefits.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Subscriptions Section ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Crown className="size-5 text-amber-500" />
              My Subscriptions
            </h3>
            <button 
              onClick={() => openModal('subscribePlan', { plan: null })}
              className="text-xs font-semibold text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-md px-3 py-1.5 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="size-4" />
              Subscribe
            </button>
          </div>
          <div className="bg-slate-100 dark:dark:bg-[#818b94]/10 rounded-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {['Plan Name', 'Type', 'Description', 'Amount', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subscriptions.length > 0 ? (
                  subscriptions.map((sub, i) => (
                    <tr key={i} className="group hover:bg-white dark:hover:bg-slate-800 transition-all">
                      <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap">{sub.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{sub.type}</td>
                      <td className="px-6 py-4 text-sm">{sub.description}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{sub.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          sub.status === 'active' ? 'bg-green-100 text-green-700' :
                          sub.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Gift className="size-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-medium text-slate-600 dark:text-slate-300">No Active Subscriptions</p>
                        <p className="text-xs">Subscribe to a plan to unlock premium features.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Recent Transactions ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <History className="size-5 text-slate-500" />
              Recent Transactions
            </h3>
            <button 
              onClick={handleDownloadReport}
              className="text-sm font-semibold text-[#1241a1] hover:underline flex items-center gap-1"
            >
              <Download className="size-4" />
              Download PDF Report
            </button>
          </div>
          <div className="bg-slate-100 dark:dark:bg-[#818b94]/10 rounded-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {['Date', 'Description', 'Amount', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx, i) => (
                    <tr key={i} className="group hover:bg-white dark:hover:bg-slate-800 transition-all">
                      <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap">{tx.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{tx.description}</td>
                      <td className={`px-6 py-4 text-sm font-semibold ${tx.amountClass || ''}`}>{tx.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tx.statusClass}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedTx(tx)}
                          className="text-slate-400 group-hover:text-[#1241a1] transition-colors"
                        >
                          <Receipt className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Wrench className="size-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-medium text-slate-600 dark:text-slate-300">No transactions</p>
                        <p className="text-xs">You have no transactions at the moment.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && recentTransactions.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-900">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-700 dark:text-slate-300">{startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, recentTransactions.length)}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{recentTransactions.length}</span> transactions
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button 
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`size-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        currentPage === p 
                          ? 'bg-[#1241a1] text-white shadow-xl shadow-[#1241a1]/20' 
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ─── MODALS ─── */}

      {/* Remove Family Member Modal */}
      {modals.removeMember.isOpen && modals.removeMember.member && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Remove Family Member</h3>
              <button onClick={() => closeModal('removeMember')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="size-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <UserX className="size-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-lg font-semibold">Remove {modals.removeMember.member.name}?</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  This action cannot be undone. They will lose access to family benefits and shared subscriptions.
                </p>
              </div>
              <div className="w-full flex gap-3 mt-4">
                <button 
                  onClick={() => closeModal('removeMember')}
                  className="flex-1 py-3 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRemoveMember}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Family Member Modal */}
      {modals.inviteMember.isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 min-w-2xl rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Invite Family Member</h3>
              <button onClick={() => closeModal('inviteMember')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={modals.inviteMember.email}
                  onChange={(e) => setModals(prev => ({
                    ...prev,
                    inviteMember: { ...prev.inviteMember, email: e.target.value }
                  }))}
                  placeholder="family@email.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Relationship</label>
                <select
                  value={modals.inviteMember.relationship}
                  onChange={(e) => setModals(prev => ({
                    ...prev,
                    inviteMember: { ...prev.inviteMember, relationship: e.target.value }
                  }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all appearance-none"
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => closeModal('inviteMember')}
                  className="flex-1 py-3 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleInviteMember}
                  className="flex-1 py-3 rounded-xl font-semibold bg-amber-700 hover:bg-amber-700/90 text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="size-4" />
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe to Plan Modal */}
      {modals.subscribePlan.isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Choose a Plan</h3>
              <button onClick={() => closeModal('subscribePlan')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availablePlans.map((plan) => (
                <div key={plan.id} className={`p-4 rounded-xl border-2 transition-all ${
                  subscriptions.some(s => s.name === plan.name)
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-[#1241a1]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{plan.name}</h4>
                    {subscriptions.some(s => s.name === plan.name) && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Active</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-[#1241a1]">${plan.price}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <Check className="size-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => {
                      setModals(prev => ({
                        ...prev,
                        subscribePlan: { ...prev.subscribePlan, plan }
                      }))
                      handleSubscribePlan()
                    }}
                    disabled={subscriptions.some(s => s.name === plan.name)}
                    className={`w-full mt-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      subscriptions.some(s => s.name === plan.name)
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-[#1241a1] hover:bg-[#1241a1]/90 text-white'
                    }`}
                  >
                    {subscriptions.some(s => s.name === plan.name) ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Family Invitations Modal */}
      {modals.invitations.isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900  min-w-2xl rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Family Invitations</h3>
              <button onClick={() => closeModal('invitations')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            {familyInvitations.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Mail className="size-12 mx-auto mb-3 opacity-50" />
                <p className="font-semibold">No pending invitations</p>
                <p className="text-sm">Invite family members to join your plan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {familyInvitations.map((inv, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{inv.email}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {inv.relationship} • {new Date(inv.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAcceptInvitation(inv.id)}
                          className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <Check className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleRejectInvitation(inv.id)}
                          className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => {
                  closeModal('invitations')
                  openModal('inviteMember', { email: '', relationship: '' })
                }}
                className="w-full py-3 rounded-xl font-semibold bg-[#1241a1] hover:bg-[#1241a1]/90 text-white transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus2 className="size-4" />
                Invite New Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="size-16 rounded-2xl bg-[#1241a1]/5 flex items-center justify-center text-[#1241a1] shadow-lg">
                <ReceiptText className="size-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Transaction Receipt</h3>
                <p className="text-sm text-slate-500">{selectedTx.description}</p>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-bold">{selectedTx.date}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-emerald-600">{selectedTx.status}</p>
                </div>
                <div className="bg-[#1241a1]/5 p-4 rounded-2xl text-left col-span-2">
                  <p className="text-[10px] font-bold text-[#1241a1] uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-[#1241a1]">{selectedTx.amount}</p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3 mt-4">
                <button 
                  onClick={() => handleDownloadReceipt(selectedTx)}
                  className="w-full bg-[#1241a1] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#1241a1]/20 active:scale-[0.98] transition-all"
                >
                  Download Receipt
                </button>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="w-full font-bold text-slate-400 py-2 hover:text-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}