'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Circle
} from 'lucide-react'
import { WalletCard } from '@/components/resident/WalletCard'
import { getActiveBills, getServiceRequests, getRecentTransactions, getResidentTransactions, getFamilyMembers, getSubscriptions, getFamilyInvitations } from '@/lib/service'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingState } from '@/components/ui/LoadingState'
import { BackButton } from '@/components/ui/BackButton'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import Pagination from '@/components/pagination'
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

// Trading-style stat card component
const StatCard = ({ label, value, change, icon, subtitle }) => {
  const isPositive = change && change > 0
  const isNegative = change && change < 0
  
  return (
    <div className="bg-[#1a1d23]/40 bg-[#12131C] backdrop-blur-md rounded-2xl border-none p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#8a8f98] text-[#8a8f98] uppercase tracking-wider">{label}</span>
        <span className="text-[#8a8f98]">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-extrabold text-white text-white">{value}</span>
        {change !== undefined && change !== null && (
          <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-[#8a8f98]'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[10px] text-[#8a8f98] text-[#8a8f98] mt-1">{subtitle}</p>
      )}
    </div>
  )
}

// Trading-style table component
const Table = ({ headers, data, onRowClick, renderStatus, renderAction }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#1a1d23]/50 bg-[#0B0C11] border-none">
            {headers.map((header, idx) => (
              <th key={idx} className={`px-5 py-3 text-left font-bold text-[#8a8f98] text-[10px] uppercase tracking-wider ${header.align || 'text-left'}`}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {data.length > 0 ? (
            data.map((item, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-[#1a1d23]/40 hover:bg-[#151622] transition-colors cursor-pointer border-none"
                onClick={() => onRowClick && onRowClick(item)}
              >

                {headers.map((header, hIdx) => (
                  <td key={hIdx} className="px-4 py-3 text-sm">
                    {header.key === 'status' && renderStatus ? (
                      renderStatus(item)
                    ) : header.key === 'action' && renderAction ? (
                      renderAction(item)
                    ) : (
                      <span className="text-white font-medium">
                        {item[header.key] || '—'}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="size-12 bg-[#2a2d33] rounded-full flex items-center justify-center">
                    <Wrench className="size-6 text-[#8a8f98]" />
                  </div>
                  <p className="font-medium text-white">No data available</p>
                  <p className="text-xs text-[#8a8f98]">No records found for this section</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// Status badge component
const StatusBadge = ({ status, type = 'default' }) => {
  const styles = {
    active: 'bg-green-500/20 text-green-400',
    completed: 'bg-green-500/20 text-green-400',
    pending: 'bg-amber-500/20 text-amber-400',
    failed: 'bg-red-500/20 text-red-400',
    overdue: 'bg-red-500/20 text-red-400',
    default: 'bg-[#8a8f98]/20 text-[#8a8f98]'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.default}`}>
      {status === 'active' && <Circle className="size-2 mr-1.5 fill-green-400" />}
      {status === 'completed' && <Check className="size-2 mr-1.5" />}
      {status === 'pending' && <Clock className="size-2 mr-1.5" />}
      {status === 'failed' && <AlertTriangle className="size-2 mr-1.5" />}
      {status}
    </span>
  )
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
  const formatNGN = (n) => `₦${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

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
    <div className="min-h-screen bg-[#0d0f13] p-6 animate-in fade-in duration-700 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bills & Invoices</h1>
          <p className="text-[#8a8f98] text-sm font-medium">Manage your property payments and view transaction history.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-medium text-[#8a8f98] uppercase tracking-wider">Total Outstanding</p>
            <p className="text-2xl font-bold text-[#1241a1]">{formatNGN(TOTAL_OUTSTANDING)}</p>
          </div>
          <Link
            href="/dashboard/resident/finance/checkout"
            className="bg-[#1241a1] hover:bg-[#1a51b1] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap border-none"
          >
            Pay All
          </Link>
        </div>
      </div>

      {/* Wallet Card */}
      <WalletCard />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard 
          label="Active Bills" 
          value={activeBills.length} 
          icon={<Receipt className="size-4" />}
          change={12.5}
        />
        <StatCard 
          label="Total Outstanding" 
          value={formatNGN(TOTAL_OUTSTANDING)} 
          icon={<Droplets className="size-4" />}
          change={-5.2}
        />
        <StatCard 
          label="Family Members" 
          value={familyMembers.length} 
          icon={<Users className="size-4" />}
          change={0}
        />
        <StatCard 
          label="Transactions" 
          value={recentTransactions.length} 
          icon={<History className="size-4" />}
          change={8.7}
          subtitle={`${subscriptions.length} active subscriptions`}
        />
      </div>

      {/* ── Active Bills ── */}
      <section className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <Clock className="size-5 text-[#1241a1]" />
              Active Bills
            </h2>
            <p className="text-xs text-[#8a8f98] font-medium">{activeBills.length} outstanding bills</p>
          </div>
          <button className="p-2 hover:bg-[#2a2d33] rounded-lg transition-colors">
            <MoreHorizontal className="size-4 text-[#8a8f98]" />
          </button>
        </div>
        
        <Table 
          headers={[
            { key: 'date', label: 'Date' },
            { key: 'description', label: 'Description' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'action', label: '' }
          ]}
          data={activeBills}
          renderStatus={(item) => <StatusBadge status={item.status} />}
          renderAction={(item) => (
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedTx(item); }}
              className="text-[#8a8f98] hover:text-[#1241a1] transition-colors border-none bg-transparent"
            >
              <Receipt className="size-4" />
            </button>
          )}
        />
      </section>

      {/* ── Family Members ── */}
      <section className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <Users className="size-5 text-[#1241a1]" />
              Family Members
              <span className="text-xs text-[#8a8f98] font-medium ml-2">({familyMembers.length})</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => openModal('invitations')}
              className="text-xs font-semibold text-white bg-[#2a2d33] hover:bg-[#3a3d43] rounded-xl px-3 py-1.5 flex items-center gap-1 transition-colors border border-[#3a3d43]"
            >
              <Mail className="size-4" />
              Invitations ({familyInvitations.length})
            </button>
            <button 
              onClick={() => openModal('inviteMember', { email: '', relationship: '' })}
              className="text-xs font-semibold text-white bg-[#1241a1] hover:bg-[#1a51b1] rounded-xl px-3 py-1.5 flex items-center gap-1 transition-colors border-none"
            >
              <UserPlus2 className="size-4" />
              Invite
            </button>
          </div>
        </div>
        
        <Table 
          headers={[
            { key: 'name', label: 'Name' },
            { key: 'relationship', label: 'Relationship' },
            { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' },
            { key: 'action', label: '' }
          ]}
          data={familyMembers}
          renderStatus={() => (
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-green-400">
              <CheckCircle2 className="size-3 mr-1.5" />
              Active
            </span>
          )}
          renderAction={(item) => (
            <button 
              onClick={(e) => { e.stopPropagation(); openModal('removeMember', { member: item }); }}
              className="text-[#8a8f98] hover:text-red-400 transition-colors border-none bg-transparent"
            >
              <UserX className="size-4" />
            </button>
          )}
        />
      </section>

      {/* ── Subscriptions ── */}
      <section className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <Crown className="size-5 text-[#1241a1]" />
              Subscriptions
            </h2>
            <p className="text-xs text-[#8a8f98] font-medium">{subscriptions.length} active subscriptions</p>
          </div>
          <button 
            onClick={() => openModal('subscribePlan', { plan: null })}
            className="text-xs font-semibold text-white bg-[#1241a1] hover:bg-[#1a51b1] rounded-xl px-3 py-1.5 flex items-center gap-1 transition-colors border-none"
          >
            <Sparkles className="size-4" />
            Subscribe
          </button>
        </div>
        
        <Table 
          headers={[
            { key: 'name', label: 'Plan' },
            { key: 'type', label: 'Type' },
            { key: 'description', label: 'Description' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'action', label: '' }
          ]}
          data={subscriptions}
          renderStatus={(item) => <StatusBadge status={item.status} />}
          renderAction={() => (
            <button className="text-[#8a8f98] hover:text-red-400 transition-colors border-none bg-transparent">
              <Trash2 className="size-4" />
            </button>
          )}
        />
      </section>

      {/* ── Recent Transactions ── */}
      <section className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <History className="size-5 text-[#1241a1]" />
              Recent Transactions
            </h2>
            <p className="text-xs text-[#8a8f98] font-medium">{recentTransactions.length} total transactions</p>
          </div>
          <button 
            onClick={handleDownloadReport}
            className="text-xs font-semibold text-[#1241a1] hover:text-[#1a51b1] flex items-center gap-1 transition-colors border-none bg-transparent"
          >
            <Download className="size-4" />
            Download Report
          </button>
        </div>
        
        <Table 
          headers={[
            { key: 'date', label: 'Date' },
            { key: 'description', label: 'Description' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'action', label: '' }
          ]}
          data={paginatedTransactions}
          renderStatus={(item) => <StatusBadge status={item.status} />}
          renderAction={(item) => (
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedTx(item); }}
              className="text-[#8a8f98] hover:text-[#1241a1] transition-colors border-none bg-transparent"
            >
              <Receipt className="size-4" />
            </button>
          )}
        />

        {!isLoading && recentTransactions.length > 0 && (
          <div className="px-4 py-3 bg-[#2a2d33]/30 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2a2d33]">
            <p className="text-sm text-[#8a8f98]">
              Showing <span className="font-bold text-white">{startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, recentTransactions.length)}</span> of <span className="font-bold text-white">{recentTransactions.length}</span> transactions
            </p>
            <Pagination page={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage} />
          </div>
        )}
      </section>

      {/* ─── MODALS ─── */}

      {/* Remove Family Member Modal */}
      {modals.removeMember.isOpen && modals.removeMember.member && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1d23] border border-[#2a2d33] w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Remove Family Member</h3>
              <button onClick={() => closeModal('removeMember')} className="text-[#8a8f98] hover:text-white transition-colors border-none bg-transparent">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="size-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <UserX className="size-8 text-red-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">Remove {modals.removeMember.member.name}?</p>
                <p className="text-sm text-[#8a8f98] mt-1">
                  This action cannot be undone. They will lose access to family benefits and shared subscriptions.
                </p>
              </div>
              <div className="w-full flex gap-3 mt-4">
                <button 
                  onClick={() => closeModal('removeMember')}
                  className="flex-1 py-3 rounded-xl font-semibold bg-[#2a2d33] hover:bg-[#3a3d43] text-white transition-colors border-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRemoveMember}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors border-none"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Family Member Modal */}
      {modals.inviteMember.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1d23] border border-[#2a2d33] w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Invite Family Member</h3>
              <button onClick={() => closeModal('inviteMember')} className="text-[#8a8f98] hover:text-white transition-colors border-none bg-transparent">
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#8a8f98] block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={modals.inviteMember.email}
                  onChange={(e) => setModals(prev => ({
                    ...prev,
                    inviteMember: { ...prev.inviteMember, email: e.target.value }
                  }))}
                  placeholder="family@email.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all placeholder:text-[#8a8f98]/50"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#8a8f98] block mb-1.5">Relationship</label>
                <select
                  value={modals.inviteMember.relationship}
                  onChange={(e) => setModals(prev => ({
                    ...prev,
                    inviteMember: { ...prev.inviteMember, relationship: e.target.value }
                  }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#2a2d33] border border-[#3a3d43] text-white focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all appearance-none"
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
                  className="flex-1 py-3 rounded-xl font-semibold bg-[#2a2d33] hover:bg-[#3a3d43] text-white transition-colors border-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleInviteMember}
                  className="flex-1 py-3 rounded-xl font-semibold bg-[#1241a1] hover:bg-[#1a51b1] text-white transition-colors flex items-center justify-center gap-2 border-none"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1d23] border border-[#2a2d33] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Choose a Plan</h3>
              <button onClick={() => closeModal('subscribePlan')} className="text-[#8a8f98] hover:text-white transition-colors border-none bg-transparent">
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availablePlans.map((plan) => {
                const isActive = subscriptions.some(s => s.name === plan.name)
                return (
                  <div key={plan.id} className={`p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-green-500 bg-green-500/5'
                      : 'border-[#2a2d33] hover:border-[#1241a1] bg-[#2a2d33]/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{plan.name}</h4>
                      {isActive && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-[#1241a1]">${plan.price}</p>
                    <p className="text-xs text-[#8a8f98] mt-1">{plan.description}</p>
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-[#8a8f98] flex items-center gap-1.5">
                          <Check className="size-3 text-green-400" />
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
                      disabled={isActive}
                      className={`w-full mt-4 py-2.5 rounded-xl font-semibold text-sm transition-all border-none ${
                        isActive
                          ? 'bg-[#2a2d33] text-[#8a8f98] cursor-not-allowed'
                          : 'bg-[#1241a1] hover:bg-[#1a51b1] text-white'
                      }`}
                    >
                      {isActive ? 'Subscribed' : 'Subscribe'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Family Invitations Modal */}
      {modals.invitations.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1d23] border border-[#2a2d33] w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Family Invitations</h3>
              <button onClick={() => closeModal('invitations')} className="text-[#8a8f98] hover:text-white transition-colors border-none bg-transparent">
                <X className="size-5" />
              </button>
            </div>
            {familyInvitations.length === 0 ? (
              <div className="py-12 text-center">
                <Mail className="size-12 mx-auto mb-3 text-[#8a8f98] opacity-50" />
                <p className="font-semibold text-white">No pending invitations</p>
                <p className="text-sm text-[#8a8f98]">Invite family members to join your plan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {familyInvitations.map((inv, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#2a2d33] border border-[#3a3d43]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{inv.email}</p>
                        <p className="text-xs text-[#8a8f98]">
                          {inv.relationship} • {new Date(inv.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAcceptInvitation(inv.id)}
                          className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors border-none"
                        >
                          <Check className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleRejectInvitation(inv.id)}
                          className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors border-none"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-[#2a2d33]">
              <button 
                onClick={() => {
                  closeModal('invitations')
                  openModal('inviteMember', { email: '', relationship: '' })
                }}
                className="w-full py-3 rounded-xl font-semibold bg-[#1241a1] hover:bg-[#1a51b1] text-white transition-colors flex items-center justify-center gap-2 border-none"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1d23] border border-[#2a2d33] w-full max-w-sm rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="size-16 rounded-xl bg-[#1241a1]/10 flex items-center justify-center">
                <ReceiptText className="size-8 text-[#1241a1]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Transaction Receipt</h3>
                <p className="text-sm text-[#8a8f98]">{selectedTx.description}</p>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-[#2a2d33] p-3 rounded-xl text-left">
                  <p className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-bold text-white">{selectedTx.date}</p>
                </div>
                <div className="bg-[#2a2d33] p-3 rounded-xl text-left">
                  <p className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-green-400">{selectedTx.status}</p>
                </div>
                <div className="bg-[#1241a1]/5 p-4 rounded-xl text-left col-span-2 border border-[#1241a1]/20">
                  <p className="text-[10px] font-bold text-[#1241a1] uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-[#1241a1]">{selectedTx.amount}</p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3 mt-4">
                <button 
                  onClick={() => handleDownloadReceipt(selectedTx)}
                  className="w-full bg-[#1241a1] hover:bg-[#1a51b1] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#1241a1]/20 transition-all border-none"
                >
                  Download Receipt
                </button>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="w-full font-bold text-[#8a8f98] py-2 hover:text-white transition-colors border-none bg-transparent"
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