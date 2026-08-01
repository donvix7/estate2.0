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
  Check
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

// Quick action links for security dashboard
const QUICK_LINKS = [
  {
    icon: QrCode,
    title: "Generate Pass",
    desc: "Create visitor access codes",
    action: "generate",
    href: "/dashboard/security/scan",
    bgColor: "bg-blue-600 hover:bg-blue-700"
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

// Mobile quick links
const MOBILE_QUICK_LINKS = [
  {
    icon: Search,
    title: 'Lost items',
    href: '/dashboard/security/lost_and_found',
    bgColor: 'bg-blue-600'
  },
  {
    icon: Shield,
    title: 'Verify',
    href: '/dashboard/admin/scan',
    bgColor: 'bg-emerald-600'
  },
  {
    icon: Ban,
    title: 'Blacklist',
    action: 'blacklist',
    href: '#blacklist-section',
    bgColor: 'bg-rose-600'
  },
  {
    icon: Activity,
    title: 'Logs',
    action: 'logs',
    href: '#recent-activity',
    bgColor: 'bg-amber-600'
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
  const [showFilters, setShowFilters] = useState(false)
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
    // Auto-refresh every 30 seconds
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
      label: "Active Passes",
      value: activePasses,
      trend: `${passes.length} total`,
      trendColor: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600"
    },
  
    {
      icon: <Clock className="size-5" />,
      label: "Pending Verification",
      value: pendingVerifications,
      trend: "Awaiting check-in",
      trendColor: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600"
    },
    {
      icon: <ShieldAlert className="size-5" />,
      label: "Security Alerts",
      value: highAlerts,
      trend: highAlerts > 0 ? "High Priority" : "All Clear",
      trendColor: highAlerts > 0 ? "text-rose-500" : "text-emerald-500",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600"
    },
    {
      icon: <Ban className="size-5" />,
      label: "Blacklisted",
      value: blacklist.length,
      trend: "Restricted access",
      trendColor: "text-rose-500",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600"
    }
  ], [activePasses, passes.length, todayVisitors, visitors.length, pendingVerifications, highAlerts, blacklist.length])

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
    if (status === 'used' || isUsed) return 'bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400'
    if (status === 'active' || (isActive && !isUsed)) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
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
    <div className="flex flex-col gap-5 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-lg lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Security Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-sm lg:text-base">
            Real-time visitor monitoring & access control
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
          >
            <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Calendar className="size-4" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </button>
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-[#1241a1] text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <Download className="size-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Search & Filter Bar (Desktop & Mobile) */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-100 dark:bg-slate-800/40 p-3 rounded-lg ">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="size-4 text-slate-400" />
          </div>
          <input 
            className="w-full rounded-md border-none bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1241a1]/20 transition-all text-sm outline-none shadow-sm" 
            placeholder="Search visitors by name, pass code, or phone number..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">Filter Status:</span>
          {['all', 'active', 'used', 'expired'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all border-none ${
                filterType === type 
                  ? 'text-emerald-700 ' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard 
            key={index} 
            icon={metric.icon} 
            label={metric.label} 
            value={metric.value} 
            trend={metric.trend} 
            trendColor={metric.trendColor} 
            bgColor={'emerald-500'} 
            iconColor={'emerald-700'} 
          />
        ))}
      </div>

      {/* Mobile Quick Actions */}
      <section className="lg:hidden">
        <span className="text-slate-900 dark:text-white text-base font-semibold mb-3 block">Quick Actions</span>
        <div className="grid grid-cols-4 gap-3">
          {MOBILE_QUICK_LINKS.map((link, index) => {
            const Icon = link.icon
            return (
              <button 
                key={index} 
                onClick={() => handleQuickAction(link.action, link.href)}
                className="flex flex-col items-center gap-2 group border-none bg-transparent"
              >
                <div className={`size-14 rounded-full ${link.bgColor} hover:brightness-110 flex items-center justify-center text-white group-active:scale-95 transition-all shadow-md`}>
                  <Icon className="size-6" />
                </div>
                <span className="text-[11px] font-semibold uppercase text-center text-slate-600 dark:text-slate-300">
                  {link.title}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Active Passes */}
        <div id="active-passes" className="xl:col-span-2 bg-[#818b94]/10 rounded-md overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active Visitor Passes</h3>
              <p className="text-xs text-slate-500">{filteredPasses.length} passes displayed</p>
            </div>
            <button 
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white  hover:brightness-150 border-none bg-emerald-700/80 p-2 px-6"
            >
              <Plus className="size-4" />
              New Pass
            </button>
          </div>
          
          <div className="p-4">
            {filteredPasses.length > 0 ? (
              <div className="space-y-3">
                {filteredPasses.map((pass, idx) => (
                  <div 
                    key={pass.id || idx} 
                    onClick={() => setSelectedPass(pass)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-md hover:shadow-md transition-all cursor-pointer border border-slate-100 dark:border-slate-700/50 group"
                  >
                    <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <QrCode className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {pass.guestName || pass.name || pass.visitorName || 'Guest Visitor'}
                        </p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusColor(pass.isActive, pass.isUsed, pass.status)}`}>
                          {getStatusText(pass.isActive, pass.isUsed, pass.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200 font-semibold">
                          {pass.code || pass.passCode || 'CODE-N/A'}
                        </span>
                        <span>•</span>
                        <span>{pass.guestPhone || pass.phone || 'No phone'}</span>
                        {pass.modeOfTransport && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{pass.modeOfTransport}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {pass.totalAdults || 1} Adult{(pass.totalAdults > 1 || !pass.totalAdults) ? 's' : ''}
                        {pass.totalChildren > 0 ? `, ${pass.totalChildren} Child` : ''}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatDate(pass.inviteDate || pass.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <QrCode className="size-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No visitor passes found</p>
                <p className="text-xs text-slate-400 mt-1">Generate a new pass to get started</p>
                <button 
                  onClick={() => setShowGenerateModal(true)}
                  className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-all border-none"
                >
                  Generate Visitor Pass
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Entry/Exit Logs */}
        <div className="space-y-6">
          {/* Quick Actions Desktop */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((link, index) => {
              const Icon = link.icon
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(link.action, link.href)}
                  className="group text-left border-none bg-transparent"
                >
                  <div className={`${link.bgColor} p-4 rounded-md transition-all text-white h-full flex flex-col items-center text-center shadow-sm`}>
                    <Icon className="size-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">{link.title}</span>
                    <p className="text-[10px] opacity-80 mt-1">{link.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Recent Entry/Exit Logs */}
          <div id="recent-activity" className=" bg-[#818b94]/10 rounded-md overflow-hidden ">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Recent Entry & Exit Activity</h4>
                <span className="text-xs font-semibold text-slate-400">{filteredLogs.length} recent</span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, idx) => (
                  <div key={log.id || idx} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700/50">
                    <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      log.type === 'entry' || log.action === 'check-in'
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {log.type === 'entry' || log.action === 'check-in' ? <LogIn className="size-4" /> : <LogOut className="size-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {log.visitor || log.guestName || 'Visitor Check'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-mono text-[11px]">{log.passCode || log.code || 'N/A'}</span>
                        <span>•</span>
                        <span>{log.verifiedBy || log.guardName || 'Security Gate'}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                        log.type === 'entry' || log.action === 'check-in'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {log.type || log.action || 'Log'}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{formatDate(log.timestamp || log.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Activity className="size-10 mx-auto mb-2 opacity-40" />
                  <p className="font-medium text-sm">No recent activity logged</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Alerts */}
      <div id="security-alerts" className=" bg-[#818b94]/10 rounded-md overflow-hidden ">
        <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Security Alerts & Incidents</h3>
            <p className="text-xs text-slate-500">
              {securityLogs.filter(log => log.status !== 'resolved').length} active alerts requiring attention
            </p>
          </div>
        </div>
        <div className="p-4">
          {securityLogs.filter(log => log.status !== 'resolved').length > 0 ? (
            <div className="space-y-3">
              {securityLogs.filter(log => log.status !== 'resolved').slice(0, 5).map((alert, idx) => (
                <div key={alert.id || idx} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-md border-l-4 border-rose-500 shadow-sm">
                  <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.severity?.toLowerCase() === 'high' 
                      ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' 
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}>
                    <AlertTriangle className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{alert.type || alert.title || 'Security Notice'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {alert.location || 'Gate 1'} • {formatDate(alert.createdAt || alert.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase ${
                      alert.severity?.toLowerCase() === 'high' 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {alert.severity || 'Medium'}
                    </span>
                    <button 
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-3 py-1.5 bg-[#1241a1] text-white rounded text-xs font-semibold hover:bg-blue-700 transition-all border-none shadow-sm"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <CheckCircle2 className="size-12 text-emerald-500 mb-2" />
              <p className="text-slate-900 dark:text-white font-semibold text-base">All Clear</p>
              <p className="text-sm text-slate-500 mt-0.5">No pending security alerts or incident reports</p>
            </div>
          )}
        </div>
      </div>

      {/* Blacklist Summary */}
      <div id="blacklist-section" className=" bg-[#818b94]/10 rounded-md overflow-hidden ">
        <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Blacklisted Visitors</h3>
            <p className="text-xs text-slate-500">{blacklist.length} visitors restricted from entry</p>
          </div>
        </div>
        <div className="p-4">
          {blacklist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {blacklist.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <div className="size-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.name?.charAt(0) || 'B'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.name || 'Restricted Visitor'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.reason || 'Restricted by Estate Admin'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Ban className="size-12 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No blacklisted visitors</p>
              <p className="text-xs text-slate-400 mt-0.5">The estate blacklist is currently empty</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-4 py-6 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
          © {new Date().getFullYear()} Security Dashboard • Real-time Monitoring • <span className="text-emerald-500">System Online</span>
        </p>
      </footer>

      {/* Pass Detail Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="size-6 text-[#1241a1]" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Visitor Pass Details</h3>
              </div>
              <button 
                onClick={() => setSelectedPass(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-none bg-transparent"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Guest Name</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedPass.guestName || selectedPass.name || 'Guest'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Access Code</span>
                <span className="font-mono font-bold text-[#1241a1] text-base">{selectedPass.code || selectedPass.passCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Phone Number</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedPass.guestPhone || selectedPass.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Transport Mode</span>
                <span className="font-semibold capitalize text-slate-900 dark:text-white">{selectedPass.modeOfTransport || 'Car'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Guests Count</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedPass.totalAdults || 1} Adult(s), {selectedPass.totalChildren || 0} Child(ren)
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Status</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${getStatusColor(selectedPass.isActive, selectedPass.isUsed, selectedPass.status)}`}>
                  {getStatusText(selectedPass.isActive, selectedPass.isUsed, selectedPass.status)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500 font-medium">Invite Date</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatDate(selectedPass.inviteDate || selectedPass.createdAt)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => {
                  router.push('/dashboard/admin/scan')
                }}
                className="flex-1 py-2.5 bg-[#1241a1] text-white font-semibold text-xs rounded-md hover:bg-blue-700 transition-all border-none"
              >
                Scan / Check-in
              </button>
              <button 
                onClick={() => setSelectedPass(null)}
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Pass Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="size-6 text-emerald-700" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Quick Visitor Pass Generator</h3>
              </div>
              <button 
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-none bg-transparent"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleGeneratePassSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Guest Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Samuel Okon"
                  value={newPass.guestName}
                  onChange={(e) => setNewPass({ ...newPass, guestName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+2348000000000"
                  value={newPass.guestPhone}
                  onChange={(e) => setNewPass({ ...newPass, guestPhone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Visit Purpose</label>
                  <select 
                    value={newPass.purpose}
                    onChange={(e) => setNewPass({ ...newPass, purpose: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/30"
                  >
                    <option>Personal Guest</option>
                    <option>Delivery / Courier</option>
                    <option>Maintenance / Service</option>
                    <option>Official Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Transport Mode</label>
                  <select 
                    value={newPass.modeOfTransport}
                    onChange={(e) => setNewPass({ ...newPass, modeOfTransport: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/30"
                  >
                    <option value="car">Car</option>
                    <option value="walk">Walking</option>
                    <option value="bike">Bike / Motorcycle</option>
                    <option value="taxi">Taxi / Uber</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Adults</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newPass.totalAdults}
                    onChange={(e) => setNewPass({ ...newPass, totalAdults: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Children</label>
                  <input 
                    type="number" 
                    min="0"
                    value={newPass.totalChildren}
                    onChange={(e) => setNewPass({ ...newPass, totalChildren: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-[#1241a1]/30"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="submit"
                  disabled={isSubmittingPass}
                  className="flex-1 py-3 bg-[#1241a1] text-white font-semibold text-sm rounded-md hover:bg-blue-700 transition-all border-none flex items-center justify-center gap-2"
                >
                  {isSubmittingPass ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <>
                      <QrCode className="size-4" />
                      Generate Pass
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border-none"
                >
                  Cancel
                </button>
              </div>
            </form>
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