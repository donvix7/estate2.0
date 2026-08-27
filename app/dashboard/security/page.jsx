'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  ShieldAlert, 
  UserCheck, 
  UserPlus, 
  Map, 
  Download, 
  Search, 
  AlertTriangle, 
  CheckCircle2,
  Tag,
  QrCode,
  History,
  Activity,
  Ban,
  Clock,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Shield,
  Users,
  Car,
  Phone,
  Mail,
  Building,
  FileText,
  MoreVertical,
  X,
  Plus,
  Share2,
  Check,
  Sliders,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { 
  getGuestCodes,
  getEntryExitLogs as apiGetEntryExitLogs,
  getBlacklist as apiGetBlacklist,
  getSecurityLogs,
  getAdminSecurityLogs,
  getVisitors,
  getResidents
} from '@/lib/service'
import { generateGuestCode, addToBlacklist as apiAddToBlacklist } from '@/lib/action'
import { LoadingState } from '@/components/ui/LoadingState'
import MetricCard from '@/components/MetricCard'
import { AlertModal } from '@/components/ui/AlertModal'
import { PromptModal } from '@/components/ui/PromptModal'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'

// Quick action links for security dashboard
const QUICK_LINKS = [
  {
    icon: QrCode,
    title: "Generate Pass",
    desc: "Create visitor access codes",
    action: "generate",
    href: "/dashboard/security/scan",
    bgColor: "bg-[#1241a1] hover:bg-[#1a51b1]"
  },
  {
    icon: Shield,
    title: "Verify Entry",
    desc: "Scan visitor QR / Check PIN",
    href: "/dashboard/security/scan",
    bgColor: "bg-emerald-600 hover:bg-emerald-700"
  },
  {
    icon: Ban,
    title: "Blacklist",
    desc: "Manage restricted visitors",
    action: "blacklist",
    href: "#blacklist-section",
    bgColor: "bg-rose-600 hover:bg-rose-700"
  },
  {
    icon: Activity,
    title: "Live Logs",
    desc: "Real-time activity feed",
    action: "logs",
    href: "#recent-activity",
    bgColor: "bg-amber-600 hover:bg-amber-700"
  }
]

// Safe array extractor helper
const extractArray = (res) => {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.docs)) return res.docs
  return []
}

export default function SecurityDashboard() {
  const router = useRouter()
  
  // Data State
  const [isLoading, setIsLoading] = useState(true)
  const [passes, setPasses] = useState([])
  const [entryExitLogs, setEntryExitLogs] = useState([])
  const [blacklist, setBlacklist] = useState([])
  const [securityLogs, setSecurityLogs] = useState([])
  const [visitors, setVisitors] = useState([])
  const [residents, setResidents] = useState([])
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedPass, setSelectedPass] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  // Quick Pass Generator Form State
  const [newPass, setNewPass] = useState({
    guestName: '',
    guestPhone: '',
    purpose: 'Personal Guest',
    inviteDate: new Date().toISOString().split('T')[0],
    modeOfTransport: 'car',
    totalAdults: 1,
    totalChildren: 0
  })
  const [isSubmittingPass, setIsSubmittingPass] = useState(false)
  
  // Modal States
  const [alertConfig, setAlertConfig] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    type: 'info' 
  })
  const [promptConfig, setPromptConfig] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    placeholder: '', 
    onConfirm: () => {} 
  })

  // Load Data
  const loadData = async () => {
    setIsRefreshing(true)
    try {
      const [
        passesData,
        logsData,
        blacklistData,
        secLogsData,
        visitorsData,
        residentsData
      ] = await Promise.all([
        getGuestCodes(),
        apiGetEntryExitLogs(),
        apiGetBlacklist(),
        getSecurityLogs(),
        getVisitors(),
        getResidents()
      ])

      setPasses(extractArray(passesData))
      setEntryExitLogs(extractArray(logsData))
      setBlacklist(extractArray(blacklistData))
      setSecurityLogs(extractArray(secLogsData))
      setVisitors(extractArray(visitorsData))
      setResidents(extractArray(residentsData))
    } catch (error) {
      console.error('Failed to load security data:', error)
      setAlertConfig({
        isOpen: true,
        title: 'Error Loading Data',
        message: 'Failed to load security data. Please try again.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Safe Metrics calculations
  const activePasses = useMemo(() => {
    return passes.filter(p => (p.isActive || p.status === 'active') && !p.isUsed).length
  }, [passes])

  const todayVisitors = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return visitors.filter(v => {
      const createdDate = v.createdAt || v.inviteDate || v.date || v.timestamp
      if (!createdDate) return false
      try {
        return new Date(createdDate).toISOString().split('T')[0] === today
      } catch {
        return false
      }
    }).length
  }, [visitors])

  const pendingVerifications = useMemo(() => {
    return entryExitLogs.filter(log => log.status === 'pending' || log.status === 'unverified' || !log.verified).length
  }, [entryExitLogs])

  const highAlerts = useMemo(() => {
    return securityLogs.filter(log => (log.severity?.toLowerCase() === 'high' || log.priority?.toLowerCase() === 'high') && log.status !== 'resolved').length
  }, [securityLogs])

  const metrics = useMemo(() => [
    {
      icon: <QrCode className="size-5" />,
      label: "Active Guest Passes",
      value: activePasses,
      trend: `${passes.length} Total`,
      trendColor: "text-blue-500",
      tone: "blue"
    },
    {
      icon: <Clock className="size-5" />,
      label: "Pending Verifications",
      value: pendingVerifications,
      trend: "Check-in Queue",
      trendColor: "text-amber-500",
      tone: "amber"
    },
    {
      icon: <ShieldAlert className="size-5" />,
      label: "Security Alerts",
      value: highAlerts,
      trend: highAlerts > 0 ? "Action Required" : "System Clear",
      trendColor: highAlerts > 0 ? "text-rose-500" : "text-emerald-500",
      tone: "rose"
    },
    {
      icon: <Ban className="size-5" />,
      label: "Blacklist Watch",
      value: blacklist.length,
      trend: "Restricted",
      trendColor: "text-rose-500",
      tone: "rose"
    }
  ], [activePasses, passes.length, pendingVerifications, highAlerts, blacklist.length])

  // Filter and search functions
  const filteredPasses = useMemo(() => {
    let filtered = passes
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        (p.guestName && p.guestName.toLowerCase().includes(term)) ||
        (p.code && p.code.toLowerCase().includes(term)) ||
        (p.guestPhone && p.guestPhone.includes(term))
      )
    }
    if (filterType === 'active') {
      filtered = filtered.filter(p => (p.isActive || p.status === 'active') && !p.isUsed)
    } else if (filterType === 'used') {
      filtered = filtered.filter(p => p.isUsed || p.status === 'used')
    } else if (filterType === 'expired') {
      filtered = filtered.filter(p => (!p.isActive && !p.isUsed) || p.status === 'expired')
    }
    return filtered
  }, [passes, searchTerm, filterType])

  const filteredLogs = useMemo(() => {
    let filtered = entryExitLogs
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(log => 
        (log.visitor && log.visitor.toLowerCase().includes(term)) ||
        (log.passCode && log.passCode.toLowerCase().includes(term))
      )
    }
    return filtered.slice(0, 6)
  }, [entryExitLogs, searchTerm])

  const formatDate = (date) => {
    if (!date) return '—'
    try {
      return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return String(date)
    }
  }

  const getStatusColor = (isActive, isUsed, status) => {
    if (status === 'used' || isUsed) return 'bg-[#1a1d23] text-[#8a8f98] border border-[#2a2d33]'
    if (status === 'active' || (isActive && !isUsed)) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  }

  const getStatusText = (isActive, isUsed, status) => {
    if (status === 'used' || isUsed) return 'Used'
    if (status === 'active' || (isActive && !isUsed)) return 'Active'
    return 'Expired'
  }

  const handleRefresh = () => {
    loadData()
  }

  const handleResolveAlert = (alertId) => {
    setSecurityLogs(prev => prev.map(log => log.id === alertId ? { ...log, status: 'resolved' } : log))
    setAlertConfig({
      isOpen: true,
      title: 'Alert Resolved',
      message: 'Security alert has been marked as resolved.',
      type: 'success'
    })
  }

  const handleExportReport = () => {
    try {
      const csvHeader = "ID,Guest Name,Pass Code,Phone,Transport,Adults,Children,Status,Created Date\n"
      const csvRows = passes.map(p => 
        `"${p.id || ''}","${p.guestName || ''}","${p.code || ''}","${p.guestPhone || ''}","${p.modeOfTransport || ''}",${p.totalAdults || 1},${p.totalChildren || 0},"${getStatusText(p.isActive, p.isUsed, p.status)}","${p.inviteDate || ''}"`
      ).join("\n")
      
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `security-report-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      setAlertConfig({
        isOpen: true,
        title: 'Report Exported',
        message: 'Security report CSV file generated successfully.',
        type: 'success'
      })
    } catch (error) {
      setAlertConfig({
        isOpen: true,
        title: 'Export Failed',
        message: 'Unable to generate report at this time.',
        type: 'error'
      })
    }
  }

  const handleQuickAction = (action, href) => {
    if (action === 'blacklist') {
      const el = document.getElementById('blacklist-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else if (action === 'logs') {
      const el = document.getElementById('recent-activity')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else if (href) {
      router.push(href)
    }
  }

  const handleGeneratePassSubmit = async (e) => {
    e.preventDefault()
    if (!newPass.guestName || !newPass.guestPhone) {
      setAlertConfig({
        isOpen: true,
        title: 'Missing Fields',
        message: 'Please provide both Guest Name and Phone Number.',
        type: 'warning'
      })
      return
    }

    setIsSubmittingPass(true)
    try {
      const payload = {
        type: 'ONE_TIME',
        guestName: newPass.guestName,
        guestPhone: newPass.guestPhone,
        purpose: newPass.purpose,
        inviteDate: newPass.inviteDate,
        modeOfTransport: newPass.modeOfTransport,
        totalAdults: parseInt(newPass.totalAdults) || 1,
        totalChildren: parseInt(newPass.totalChildren) || 0
      }
      
      const res = await generateGuestCode(payload)
      setShowGenerateModal(false)
      setNewPass({
        guestName: '',
        guestPhone: '',
        purpose: 'Personal Guest',
        inviteDate: new Date().toISOString().split('T')[0],
        modeOfTransport: 'car',
        totalAdults: 1,
        totalChildren: 0
      })

      loadData()
      setAlertConfig({
        isOpen: true,
        title: 'Pass Generated!',
        message: `Visitor access code generated successfully.`,
        type: 'success'
      })
    } catch (err) {
      console.error(err)
      setAlertConfig({
        isOpen: true,
        title: 'Generation Failed',
        message: 'Failed to generate guest code. Please try again.',
        type: 'error'
      })
    } finally {
      setIsSubmittingPass(false)
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading Security Dashboard..." />
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-12">
      
      {/* Header Bar */}
      <PageHeader
        title="Gate Security Command"
        description="Real-time visitor access control & gate management"
        icon={Shield}
        iconColor="blue"
      >
        <Button
          variant="secondary"
          size="md"
          onClick={handleRefresh}
          icon={RefreshCw}
          className={`rounded-full ${isRefreshing ? 'opacity-50' : ''}`}
        >
          Refresh Feed
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleExportReport}
          icon={Download}
          className="rounded-full"
        >
          Export Report
        </Button>
      </PageHeader>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            trend={metric.trend}
            trendColor={metric.trendColor}
            tone={metric.tone}
          />
        ))}
      </div>      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#1a1d23] backdrop-blur-md p-3 rounded-2xl border-none shadow-sm">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search visitor by name, access code, or phone number..."
          className="w-full sm:max-w-md"
        />
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-semibold text-[#8a8f98] whitespace-nowrap mr-1">Status:</span>
          {['all', 'active', 'used', 'expired'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border-none ${
                filterType === type
                  ? 'bg-[#1a1d23] text-white shadow-sm'
                  : 'bg-[#1a1d23]/80 text-[#8a8f98] hover:bg-[#2a2d33]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-Column Reference Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 cols): Quick Pass Generator Form Widget & Gate Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Visitor Pass Generator Widget */}
          <Card>
            <CardHeader>
              <CardTitle icon={QrCode} title="Gate Pass Control" subtitle="Issue Guest Access Pass" live={true} />
            </CardHeader>
            <CardBody padded={true}>
              <form onSubmit={handleGeneratePassSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] block mb-1">Guest Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Alex Johnson"
                    value={newPass.guestName}
                    onChange={(e) => setNewPass({ ...newPass, guestName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d23]/80 border-none text-sm font-medium text-white outline-none focus:ring-2 focus:ring-slate-400/20 shadow-inner"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] block mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+234 800 000 0000"
                    value={newPass.guestPhone}
                    onChange={(e) => setNewPass({ ...newPass, guestPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d23]/80 border-none text-sm font-medium text-white outline-none focus:ring-2 focus:ring-slate-400/20 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] block mb-1">Purpose</label>
                    <select 
                      value={newPass.purpose}
                      onChange={(e) => setNewPass({ ...newPass, purpose: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1a1d23]/80 border-none text-xs font-medium text-white outline-none shadow-inner"
                    >
                      <option>Personal Guest</option>
                      <option>Delivery</option>
                      <option>Maintenance</option>
                      <option>Official</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] block mb-1">Transport</label>
                    <select 
                      value={newPass.modeOfTransport}
                      onChange={(e) => setNewPass({ ...newPass, modeOfTransport: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1a1d23]/80 border-none text-xs font-medium text-white outline-none shadow-inner"
                    >
                      <option value="car">Car</option>
                      <option value="walk">Walk</option>
                      <option value="bike">Bike</option>
                      <option value="taxi">Taxi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] block mb-1">Adults</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newPass.totalAdults}
                      onChange={(e) => setNewPass({ ...newPass, totalAdults: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1a1d23]/80 border-none text-xs font-medium text-white shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] block mb-1">Children</label>
                    <input 
                      type="number" 
                      min="0"
                      value={newPass.totalChildren}
                      onChange={(e) => setNewPass({ ...newPass, totalChildren: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1a1d23]/80 border-none text-xs font-medium text-white shadow-inner"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmittingPass}
                  className="w-full py-3 bg-[#1a1d23] text-white font-bold text-xs rounded-full hover:opacity-90 transition-all border-none flex items-center justify-center gap-2 shadow-md mt-2"
                >
                  {isSubmittingPass ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <>
                      <QrCode className="size-4" />
                      Generate Visitor Pass
                    </>
                  )}
                </button>
              </form>
            </CardBody>
          </Card>

          {/* Gate Verification Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle icon={Shield} title="Gate Actions" subtitle="Verification & Control" />
            </CardHeader>
            <CardBody padded={true} className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/security/scan" className="p-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl border-none text-center font-bold text-xs flex flex-col items-center gap-2 transition-all">
                <Shield className="size-6" />
                Scan QR Code
              </Link>
              <button 
                onClick={() => handleQuickAction('blacklist')} 
                className="p-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border-none text-center font-bold text-xs flex flex-col items-center gap-2 transition-all border-none"
              >
                <Ban className="size-6" />
                Blacklist Watch
              </button>
            </CardBody>
          </Card>

        </div>

        {/* Center & Right Column (8 cols): Main Active Visitor Data Table & Activity Feed */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Visitor Passes Data Grid Table */}
          <Card id="active-passes">
            <CardHeader>
              <CardTitle
                icon={QrCode}
                title="Active Visitor Access Passes"
                subtitle={`${filteredPasses.length} visitor passes active in system`}
                live={true}
              />
              <Button variant="success" size="sm" icon={Plus} onClick={() => setShowGenerateModal(true)} className="rounded-full border-none">
                New Pass
              </Button>
            </CardHeader>

            <CardBody padded={false}>
              {filteredPasses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#1a1d23]/50 border-none">
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Guest Name</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Pass Code</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Phone & Transport</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98]">Guests</th>
                        <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8f98] text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-0">
                      {filteredPasses.map((pass, idx) => (
                        <tr 
                          key={pass.id || idx}
                          onClick={() => setSelectedPass(pass)}
                          className="hover:bg-[#2a2d33] transition-colors cursor-pointer border-none"
                        >
                          <td className="px-5 py-3.5 font-bold text-white text-xs md:text-sm">
                            {pass.guestName || pass.name || 'Guest Visitor'}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#1a1d23]/90 text-[#8a8f98] font-bold border-none shadow-inner">
                              {pass.code || pass.passCode || 'CODE-N/A'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#8a8f98]">
                            {pass.guestPhone || 'No phone'} • <span className="capitalize">{pass.modeOfTransport || 'car'}</span>
                          </td>
                          <td className="px-5 py-3.5 text-xs font-semibold text-[#8a8f98]">
                            {pass.totalAdults || 1} Adult(s) {pass.totalChildren > 0 ? `, ${pass.totalChildren} Child` : ''}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${getStatusColor(pass.isActive, pass.isUsed, pass.status)}`}>
                              {getStatusText(pass.isActive, pass.isUsed, pass.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={QrCode}
                  title="No visitor passes found"
                  description="Generate a new pass using the control panel to get started"
                />
              )}
            </CardBody>
          </Card>

          {/* Security Incidents & Blacklist Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Entry/Exit Feed */}
            <Card id="recent-activity">
              <CardHeader>
                <CardTitle icon={Activity} title="Gate Entry Activity" subtitle={`${filteredLogs.length} recent logs`} />
              </CardHeader>
              <CardBody padded={true} className="space-y-3">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, idx) => (
                    <div key={log.id || idx} className="flex items-center justify-between p-3 bg-[#1a1d23] rounded-xl border border-[#2a2d33]">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                          log.type === 'entry' || log.action === 'check-in'
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {log.type === 'entry' || log.action === 'check-in' ? <LogIn className="size-4" /> : <LogOut className="size-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{log.visitor || log.guestName || 'Visitor'}</p>
                          <p className="text-[10px] text-[#8a8f98]">{log.passCode || 'N/A'} • {formatDate(log.timestamp || log.createdAt)}</p>
                        </div>
                      </div>
                      <StatusBadge
                        status={log.type || log.action || 'Log'}
                        tone={log.type === 'entry' || log.action === 'check-in' ? 'green' : 'red'}
                      />
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Activity} title="No recent activity" />
                )}
              </CardBody>
            </Card>

            {/* Blacklisted Watchlist */}
            <Card id="blacklist-section">
              <CardHeader>
                <CardTitle icon={Ban} title="Blacklisted Visitors" subtitle={`${blacklist.length} restricted`} />
              </CardHeader>
              <CardBody padded={true} className="space-y-3">
                {blacklist.length > 0 ? (
                  blacklist.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-rose-500/5 rounded-xl border border-rose-500/20">
                      <div className="size-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {item.name?.charAt(0) || 'B'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-white truncate">{item.name || 'Restricted Visitor'}</p>
                        <p className="text-[10px] text-[#8a8f98] truncate">{item.reason || 'Restricted by Estate Admin'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Ban} title="No blacklisted visitors" description="Estate watchlist is clean" />
                )}
              </CardBody>
            </Card>

          </div>

        </div>

      </div>

      <footer className="mt-6 py-6 text-center border-t border-[#2a2d33]">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8a8f98]">
          © {new Date().getFullYear()} Security Command Portal • Gate Status: <span className="text-emerald-500 font-semibold">Active ● Live</span>
        </p>
      </footer>

      {/* Pass Detail Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1d23] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-[#2a2d33]">
            <div className="flex items-center justify-between border-b border-[#2a2d33] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="size-6 text-[#1241a1]" />
                <h3 className="font-bold text-lg text-white">Visitor Pass Details</h3>
              </div>
              <button 
                onClick={() => setSelectedPass(null)}
                className="text-[#8a8f98] hover:text-[#8a8f98] border-none bg-transparent"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-[#2a2d33]">
                <span className="text-[#8a8f98] font-medium">Guest Name</span>
                <span className="font-bold text-white">{selectedPass.guestName || selectedPass.name || 'Guest'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#2a2d33]">
                <span className="text-[#8a8f98] font-medium">Access Code</span>
                <span className="font-mono font-extrabold text-[#1241a1] text-base">{selectedPass.code || selectedPass.passCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#2a2d33]">
                <span className="text-[#8a8f98] font-medium">Phone Number</span>
                <span className="font-semibold text-white">{selectedPass.guestPhone || selectedPass.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#2a2d33]">
                <span className="text-[#8a8f98] font-medium">Transport Mode</span>
                <span className="font-semibold capitalize text-white">{selectedPass.modeOfTransport || 'Car'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#2a2d33]">
                <span className="text-[#8a8f98] font-medium">Guests Count</span>
                <span className="font-semibold text-white">
                  {selectedPass.totalAdults || 1} Adult(s), {selectedPass.totalChildren || 0} Child(ren)
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#8a8f98] font-medium">Status</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${getStatusColor(selectedPass.isActive, selectedPass.isUsed, selectedPass.status)}`}>
                  {getStatusText(selectedPass.isActive, selectedPass.isUsed, selectedPass.status)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => {
                  router.push('/dashboard/security/scan')
                }}
                className="flex-1 py-2.5 bg-[#1a1d23] text-white font-bold text-xs rounded-full hover:opacity-90 transition-all border-none"
              >
                Scan / Verify Entry
              </button>
              <button 
                onClick={() => setSelectedPass(null)}
                className="py-2.5 px-5 bg-[#1a1d23] text-[#8a8f98] font-bold text-xs rounded-full hover:bg-[#2a2d33] transition-all border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Modals */}
      <AlertModal 
        isOpen={alertConfig.isOpen} 
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
      <PromptModal
        isOpen={promptConfig.isOpen}
        onClose={() => setPromptConfig({ ...promptConfig, isOpen: false })}
        title={promptConfig.title}
        message={promptConfig.message}
        placeholder={promptConfig.placeholder}
        confirmText={promptConfig.confirmText}
        onConfirm={promptConfig.onConfirm}
      />
    </div>
  )
}