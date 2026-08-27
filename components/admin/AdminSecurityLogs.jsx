'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { 
  ChevronRight, 
  Download, 
  BellRing, 
  Search, 
  Calendar, 
  ChevronDown, 
  Filter, 
  AlertTriangle, 
  ArrowRight, 
  ChevronLeft,
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  X,
  Home,
  PersonStanding,
  LogIn
} from 'lucide-react'
import { getActiveSessions, getAdminSecurityLogs, getSecurityGuards } from '@/lib/service'
import { approveSecurityLogin, rejectSecurityLogin, logSecurityIncident } from '@/lib/action'
import { LoadingState } from '@/components/ui/LoadingState'
import MetricCard from '../MetricCard'

const SEVERITY_STYLES = {
  High:   'bg-rose-500/10 text-rose-600 text-rose-400',
  Medium: 'bg-amber-500/10 text-amber-600 text-amber-400',
  Low:    'bg-[#1a1d23] text-white0',
}

const STATUS_DOT = {
  'Resolved':      'bg-emerald-500',
  'In Progress':   'bg-amber-500',
  'Pending Review':'bg-[#2a2d33]',
}

const LOG_ICONS = {
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
}

export default function ActivityPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filterSeverity, setFilterSeverity] = useState('All')
  const [filterDate, setFilterDate] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [activeSessions, setActiveSessions] = useState(0)
  const [guards, setGuards] = useState([])
  const [logs, setLogs] = useState([])
  const [formData, setFormData] = useState({
    type: 'Perimeter Breach',
    location: '',
    severity: 'Low',
    sub: ''
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const response = await getAdminSecurityLogs()
      console.log(response)
      // Handle both array and object response
      const logsData = Array.isArray(response) ? response : response?.data || []
      setLogs(logsData)
    } catch (error) {
      console.error('Error fetching logs:', error)
      toast.error('Failed to load security logs')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGuards = async () => {
    try {
      const response = await getSecurityGuards('guards')
      const guardsData = Array.isArray(response) ? response : response?.data || []
      setGuards(guardsData)
    } catch (error) {
      console.error('Error fetching guards:', error)
    }
  }
  const fetchActiveSessions = async (guardId) => {
    try {
      const response = await getActiveSessions(guardId)
      const guardsData = Array.isArray(response) ? response : response?.data || []
      setActiveSessions(response.data)
    } catch (error) {
      console.error('Error fetching guards:', error)
    }
  }

  useEffect(() => {
    fetchLogs()
    fetchGuards()
    fetchActiveSessions()

    const handleExportEvent = () => handleExport()
    const handleEntryEvent = () => setShowEntryModal(true)

    window.addEventListener('export-logs', handleExportEvent)
    window.addEventListener('open-security-entry', handleEntryEvent)

    return () => {
      window.removeEventListener('export-logs', handleExportEvent)
      window.removeEventListener('open-security-entry', handleEntryEvent)
    }
  }, [])

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      const matchesSearch = 
        log.type?.toLowerCase().includes(searchLower) ||
        log.location?.toLowerCase().includes(searchLower) ||
        log.visitor?.toLowerCase().includes(searchLower) ||
        log.description?.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    // Severity filter
    if (filterSeverity !== 'All' && log.severity !== filterSeverity) {
      return false
    }

    // Type filter
    if (filterType !== 'All' && log.typeId !== filterType) {
      return false
    }

    // Date filter
    if (filterDate !== 'All') {
      const today = new Date().toISOString().split('T')[0]
      const logDate = log.createdAt ? new Date(log.createdAt).toISOString().split('T')[0] : ''
      if (logDate !== today) return false
    }

    return true
  })

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const handleApproveEntry = async () => {
    try {
      const res = await approveSecurityLogin(selectedLog.id)
      console.log( 'approve message', res)
      fetchLogs()
      setShowEntryModal(false)
      setSelectedLog(null)
    } catch (error) {
      console.error('Error approving entry:', error)
    }
  }

  const handleRejectEntry = async () => {
    try {
      const res = await rejectSecurityLogin(selectedLog.id)
      console.log(res)
      fetchLogs()
      setShowEntryModal(false)
      setSelectedLog(null)
    } catch (error) {
      console.error('Error rejecting entry:', error)
    }
  }

  const handleExport = () => {
    try {
      const headers = "Date,Time,Type,Location,Severity,Status\n"
      const csvContent = filteredLogs.map(l => {
        const date = l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''
        const time = l.createdAt ? new Date(l.createdAt).toLocaleTimeString() : ''
        return `${date},${time},${l.type || ''},${l.location || ''},${l.severity || ''},${l.status || ''}`
      }).join("\n")
      
      const blob = new Blob([headers + csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `security_logs_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('Logs exported successfully')
    } catch (error) {
      toast.error('Failed to export logs')
    }
  }

  const handleLogSubmit = async () => {
    if (!formData.location) {
      toast.error('Please enter a location')
      return
    }

    const typeConfig = {
      'Perimeter Breach':   { icon: 'ShieldAlert',   color: 'bg-rose-500/10 text-rose-500',    typeId: 'security' },
      'Visitor Arrival':    { icon: 'UserCheck',     color: 'bg-[#1241a1]/10 text-[#1241a1]', typeId: 'visitor' },
      'Unauthorized Access': { icon: 'ShieldCheck',   color: 'bg-amber-500/10 text-amber-500',  typeId: 'security' },
      'Maintenance Entry':   { icon: 'CheckCircle2', color: 'bg-emerald-500/10 text-emerald-500', typeId: 'system' }
    }

    const config = typeConfig[formData.type] || typeConfig['Perimeter Breach']
    
    const newLog = {
      ...formData,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      typeId: config.typeId,
      icon: config.icon,
      iconColor: config.color,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    }

    try {
      await logSecurityIncident(newLog)
      toast.success('Security incident logged successfully')
      setShowEntryModal(false)
      fetchLogs()
      setFormData({ type: 'Perimeter Breach', location: '', severity: 'Low', sub: '' })
    } catch (error) {
      console.error('Error logging incident:', error)
      toast.error('Failed to log incident')
    }
  }

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingState message="Scanning Security Perimeter..." />
      </div>
    )
  }

  // Calculate stats
  const totalAttempts = logs.length
  const highSeverity = logs.filter(l => l.severity === 'High').length
  const resolved = logs.filter(l => l.status === 'Resolved').length

  return (
    <div className="flex flex-col gap-4 lg:gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<LogIn className="size-5" />}
          label="Total Attempts"
          value={totalAttempts}
          color='indigo'
        />
        <MetricCard
          icon={<PersonStanding className="size-5" />}
          label="Security Guards"
          value={guards.length}
          color={'indigo'}
          
        />
      
        <MetricCard
          icon={<CheckCircle2 className="size-5" />}
          label="Resolved"
          value={resolved}
          color={'indigo'}
          
        />
      </div>

      {/* Logs Table */}
      <div className="bg-[#1a1d23] bg-[#1a1d23]/30 rounded-md overflow-hidden">

        {/* Table toolbar */}
        <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b border-[#2a2d33] border-[#2a2d33]">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="relative flex-1 max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8f98] size-5 group-focus-within:text-[#1241a1] transition-colors" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search by type or location..."
                className="w-full bg-white bg-[#1a1d23]/50 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap relative">
              <button 
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={`bg-[#1a1d23] px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-[#2a2d33]  transition-colors ${filterDate !== 'All' ? 'ring-2 ring-[#1241a1]' : ''}`}
              >
                <Calendar className="size-4" />
                {filterDate === 'All' ? 'Filter Date' : filterDate}
                <ChevronDown className="size-4" />
              </button>
              {showDateDropdown && (
                <div className="absolute top-12 left-0 z-50 bg-[#1a1d23] shadow-2xl rounded-md p-2 min-w-[140px] animate-in zoom-in-95 duration-200">
                  {['All', 'Today', 'This Week'].map(d => (
                    <button
                      key={d}
                      onClick={() => { setFilterDate(d); setShowDateDropdown(false); setPage(1) }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold rounded-md hover:bg-[#2a2d33]  transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={`bg-[#1a1d23] px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-[#2a2d33]  transition-colors ${filterType !== 'All' ? 'ring-2 ring-[#1241a1]' : ''}`}
              >
                <Filter className="size-4" />
                {filterType === 'All' ? 'Filter Type' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                <ChevronDown className="size-4" />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-12 left-32 z-50 bg-[#1a1d23] shadow-2xl rounded-md p-2 min-w-[160px] animate-in zoom-in-95 duration-200">
                  {['All', 'security', 'visitor', 'system', 'emergency'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setFilterType(t); setShowTypeDropdown(false); setPage(1) }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold rounded-md hover:bg-[#2a2d33]  transition-colors capitalize"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              <button 
                onClick={() => setFilterSeverity(prev => prev === 'High' ? 'All' : 'High')}
                className={`px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${
                  filterSeverity === 'High' 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-rose-50 border-none bg-rose-500/10 text-rose-600 text-rose-400 hover:bg-rose-100 hover:bg-rose-500/20'
                }`}
              >
                <AlertTriangle className="size-4" />
                High Severity
              </button>
            </div>
          </div>
          <span className="text-xs text-white0 text-[#8a8f98]">Showing {filteredLogs.length} entries</span>
        </div>

        {/* Table View (Desktop) */}
        <div className="hidden md:block bg-[#818b94]/10 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1a1d23]/50">
              <tr>
                {['Timestamp', 'Guard', 'Location', 'Severity', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold text-white0 text-[#8a8f98] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-[#8a8f98] text-sm font-medium">No logs found.</td></tr>
              ) : paginatedLogs.map((log, i) => {
                const Icon = LOG_ICONS[log.icon] || ShieldAlert
                const severityClass = SEVERITY_STYLES[log.severity] || SEVERITY_STYLES.Low
                const statusDot = STATUS_DOT[log.status] || 'bg-[#2a2d33]'
                
                return (
                  <tr 
                    key={log.id || i} 
                    onClick={() => setSelectedLog(log)}
                    className="group hover:bg-white  transition-all cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-white text-white">
                        {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-xs text-white0 text-[#8a8f98] font-medium">
                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold whitespace-nowrap text-white text-white">{log.guard.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-white text-white">{log.gate.name || '—'}</div>
                      <div className="text-xs text-white0 text-[#8a8f98] font-medium">{log.sub || ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${severityClass}`}>
                        {log.severity || 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full shrink-0 ${statusDot}`} />
                        <span className="text-sm font-semibold text-white text-white whitespace-nowrap">{log.status || 'Pending'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[#1241a1] hover:underline text-sm font-semibold">View</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Card View (Mobile) */}
        <div className="md:hidden flex flex-col divide-y divide-[#2a2d33] bg-[#818b94]/10">
          {paginatedLogs.length === 0 ? (
            <div className="p-8 text-center text-[#8a8f98] text-sm font-medium">No logs found.</div>
          ) : paginatedLogs.map((log, i) => {
            const Icon = LOG_ICONS[log.icon] || ShieldAlert
            const severityClass = SEVERITY_STYLES[log.severity] || SEVERITY_STYLES.Low
            const statusDot = STATUS_DOT[log.status] || 'bg-[#2a2d33]'
            
            return (
              <div 
                key={log.id || i} 
                onClick={() => setSelectedLog(log)}
                className="group p-4 flex flex-col gap-4 active:bg-[#2a2d33] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-md flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#1241a1] group-hover:text-white ${log.iconColor || 'bg-[#1a1d23] text-white0'}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white text-white leading-tight">{log.type}</h4>
                      <p className="text-[10px] font-semibold text-white0 text-[#8a8f98] uppercase tracking-tight mt-0.5">{log.location}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${severityClass}`}>
                    {log.severity}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-[#8a8f98]">Timestamp</span>
                      <span className="text-xs font-semibold text-[#8a8f98] ">
                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ''}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-[#8a8f98]">Status</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`size-1.5 rounded-full ${statusDot}`} />
                        <span className="text-xs font-semibold text-[#8a8f98] ">{log.status || 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-[#1241a1] text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1 pr-1">
                    Detail <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d23]/30 border-t border-[#2a2d33] border-[#2a2d33]">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md text-sm font-semibold text-[#8a8f98]  hover:bg-[#2a2d33]  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-white0 text-[#8a8f98]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md text-sm font-semibold text-[#8a8f98]  hover:bg-[#2a2d33]  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d0f13]/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1d23] w-full max-w-md rounded-md p-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-semibold mb-6">Create Security Entry</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#8a8f98]">Incident Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="bg-[#1a1d23] p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-[#1241a1]/20"
                >
                  <option>Perimeter Breach</option>
                  <option>Visitor Arrival</option>
                  <option>Unauthorized Access</option>
                  <option>Maintenance Entry</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#8a8f98]">Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Sector 4 Gate" 
                  className="bg-[#1a1d23] p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-[#1241a1]/20" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#8a8f98]">Observation (Optional)</label>
                <input 
                  type="text" 
                  value={formData.sub}
                  onChange={e => setFormData({ ...formData, sub: e.target.value })}
                  placeholder="Additional details..." 
                  className="bg-[#1a1d23] p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-[#1241a1]/20" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#8a8f98]">Severity</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setFormData({ ...formData, severity: s })}
                      className={`flex-1 py-2 rounded-md text-[10px] font-semibold transition-colors uppercase tracking-widest ${formData.severity === s ? 'bg-[#1241a1] text-white' : 'bg-[#1a1d23] hover:bg-[#1241a1]/10'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowEntryModal(false)}
                className="flex-1 py-3 font-semibold text-[#8a8f98] hover:text-[#8a8f98] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogSubmit}
                className="flex-1 py-3 bg-indigo-700 text-white font-semibold rounded-md active:scale-[0.98] transition-all"
              >
                Log Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d0f13]/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1d23] w-full max-w-2xl rounded-md p-8 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className={`size-16 rounded-md flex items-center justify-center ${selectedLog.iconColor || 'bg-indigo-700 text-white'}`}>
                {(() => {
                  const Icon = LOG_ICONS[selectedLog.icon] || ShieldAlert;
                  return <Icon className="size-8" />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedLog.type}</h3>
                <p className="text-sm text-white0 font-medium">{selectedLog.location}</p>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-[#1a1d23] bg-[#1a1d23]/50 p-3 rounded-md text-left">
                  <p className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-widest mb-1">Time</p>
                  <p className="text-sm font-semibold">
                    {selectedLog.createdAt ? new Date(selectedLog.createdAt).toLocaleTimeString('en-US', { hour12: true }) : 'N/A'}
                  </p>
                </div>
                <div className="bg-[#1a1d23] bg-[#1a1d23]/50 p-3 rounded-md text-left">
                  <p className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-semibold">{selectedLog.status || 'Pending'}</p>
                </div>
                <div className="bg-[#1a1d23] bg-[#1a1d23]/50 p-3 rounded-md text-left col-span-1">
                  <p className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-widest mb-1">Guard</p>
                  <p className="text-xs font-medium">{selectedLog.guard.username || 'No additional details'}</p>
                </div>
                 <div className="bg-[#1a1d23] bg-[#1a1d23]/50 p-3 rounded-md text-left col-span-1">
                  <p className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-widest mb-1">Gate</p>
                  <p className="text-xs font-medium">{selectedLog.gate.name || 'No additional details'}</p>
                </div>
                
              </div>

              <div className="w-full flex flex-col gap-3 mt-4">
                <button 
                onClick={handleApproveEntry}
                className="w-full bg-emerald-500/10 text-emerald-400 font-semibold py-3 rounded-md transition-all active:scale-95 hover:bg-emerald-500/20 border border-emerald-500/20">Approve Login</button>
                 <button 
                onClick={handleRejectEntry}
                className="w-full bg-red-500/10 text-red-400 font-semibold py-3 rounded-md transition-all active:scale-95 hover:bg-red-500/20 border border-red-500/20">Reject Login</button>
                
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="w-full font-semibold text-[#8a8f98] py-2 hover:text-[#8a8f98] transition-colors hover:bg-indigo-700 hover:text-white rounded-md"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}