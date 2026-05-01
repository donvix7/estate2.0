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
  X
} from 'lucide-react'
import { getAdminSecurityLogs } from '@/lib/service'
import { logSecurityIncident } from '@/lib/action'


const SEVERITY_STYLES = {
  High:   'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Low:    'bg-slate-100 dark:bg-slate-800 text-slate-500',
}

const STATUS_DOT = {
  'Resolved':      'bg-emerald-500',
  'In Progress':   'bg-amber-500',
  'Pending Review':'bg-slate-400 dark:bg-slate-600',
}

const LOG_ICONS = {
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
}

// Stats will be calculated in the component

const BARS = [40, 55, 85, 30, 60, 90, 45]
const BAR_FILL = [60, 40, 10, 70, 30, 20, 50]
const LABELS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59']

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
  const [logs, setLogs] = useState([])
  const [formData, setFormData] = useState({
    type: 'Perimeter Breach',
    location: '',
    severity: 'Low',
    sub: ''
  })

  const fetchLogs = async () => {
    const logs = await getAdminSecurityLogs()
    setLogs(logs.docs)
  }

  useEffect(() => {
    fetchLogs()
  }, [])
  const itemsPerPage = 5

  const filtered = logs.filter(l => {
    const matchesSearch = l.type.toLowerCase().includes(search.toLowerCase()) ||
                          l.location.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || l.severity === filterSeverity;
    const matchesType = filterType === 'All' || l.typeId === filterType;
    
    // Simple mock logic for date filtering
    const matchesDate = filterDate === 'All' || l.date === 'Mar 08, 2025'; // Mocking "Today" as Mar 08
    
    return matchesSearch && matchesSeverity && matchesType && matchesDate;
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleExport = () => {
    const headers = "Date,Time,Type,Location,Severity,Status\n"
    const csvContent = filtered.map(l => `${l.date},${l.time},${l.type},${l.location},${l.severity},${l.status}`).join("\n")
    const blob = new Blob([headers + csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `security_logs_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
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
      status: 'Pending Review'
    }

    try {
      await logSecurityIncident(newLog)
      toast.success('Security incident logged successfully')
      setShowEntryModal(false)
      fetchLogs()
      setFormData({ type: 'Perimeter Breach', location: '', severity: 'Low', sub: '' })
    } catch (error) {
      toast.error('Failed to log incident')
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/dashboard/resident" className="hover:text-[#1241a1] transition-colors">Dashboard</Link>
            <ChevronRight className="size-4" />
            <span className="text-[#1241a1] font-semibold">Security Logs</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Security Incident Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time monitoring of all perimeter and entry activities.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="size-4" />
            Export CSV
          </button>
          <button 
            onClick={() => setShowEntryModal(true)}
            className="flex items-center gap-2 bg-[#1241a1] text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#1241a1]/90 transition-colors shadow-lg shadow-[#1241a1]/20"
          >
            <BellRing className="size-4" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Alerts</p>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500">+{logs.length} Total</span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{logs.length}</p>
          <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full bg-[#1241a1] w-[${Math.min(100, logs.length * 10)}%] transition-all`} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Alarms</p>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-rose-500 text-white animate-pulse">LIVE</span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{logs.filter(l => l.status === 'In Progress').length}</p>
          <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full bg-rose-500 w-[${Math.min(100, (logs.filter(l => l.status === 'In Progress').length / (logs.length || 1)) * 100)}%] transition-all`} />
          </div>
        </div>
      </div>

      {/* ── Logs Table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">

        {/* Table toolbar */}
        <div className="p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="relative flex-1 max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-[#1241a1] transition-colors" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search by type or location..."
                className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#1241a1]/30 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap relative">
              <button 
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={`bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${filterDate !== 'All' ? 'ring-2 ring-[#1241a1]' : ''}`}
              >
                <Calendar className="size-4" />
                {filterDate === 'All' ? 'Filter Date' : filterDate}
                <ChevronDown className="size-4" />
              </button>
              {showDateDropdown && (
                <div className="absolute top-12 left-0 z-50 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl p-2 min-w-[140px] animate-in zoom-in-95 duration-200">
                  {['All', 'Today'].map(d => (
                    <button
                      key={d}
                      onClick={() => { setFilterDate(d); setShowDateDropdown(false); setPage(1) }}
                      className="w-full text-left px-4 py-2 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={`bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${filterType !== 'All' ? 'ring-2 ring-[#1241a1]' : ''}`}
              >
                <Filter className="size-4" />
                {filterType === 'All' ? 'Filter Type' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                <ChevronDown className="size-4" />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-12 left-32 z-50 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl p-2 min-w-[160px] animate-in zoom-in-95 duration-200">
                  {['All', 'security', 'visitor', 'system', 'emergency'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setFilterType(t); setShowTypeDropdown(false); setPage(1) }}
                      className="w-full text-left px-4 py-2 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors capitalize"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              <button 
                onClick={() => setFilterSeverity(prev => prev === 'High' ? 'All' : 'High')}
                className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                  filterSeverity === 'High' 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-rose-50 -ml-1 border-none dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20'
                }`}
              >
                <AlertTriangle className="size-4" />
                High Severity
              </button>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Showing {filtered.length} entries</span>
        </div>

        {/* Table View (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {['Timestamp', 'Incident Type', 'Visitor', 'Verified By', 'Resident ID', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No logs found.</td></tr>
              ) : paginated.map((log, i) => (
                <tr 
                  key={i} 
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold">{new Date(log.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{log.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${log.iconColor}`}>
                        {(() => {
                          const Icon = LOG_ICONS[log.icon] || ShieldAlert;
                          return <Icon className="size-5" />;
                        })()}
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap">{log.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{log.visitor}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{log.sub}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${SEVERITY_STYLES[log.verifiedBy]}`}>{log.verifiedBy}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full shrink-0 ${STATUS_DOT[log.status] || 'bg-slate-400'}`} />
                      <span className="text-sm whitespace-nowrap">{log.residentID}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#1241a1] hover:underline text-sm font-bold">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card View (Mobile) */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
          {paginated.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No logs found.</div>
          ) : paginated.map((log, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedLog(log)}
              className="p-4 flex flex-col gap-4 active:bg-slate-50 dark:active:bg-slate-800/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${log.iconColor} shadow-sm`}>
                    {(() => {
                      const Icon = LOG_ICONS[log.icon] || ShieldAlert;
                      return <Icon className="size-5" />;
                    })()}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">{log.type}</h4>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight mt-0.5">{log.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${SEVERITY_STYLES[log.severity]}`}>
                  {log.severity}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Timestamp</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{log.time}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`size-1.5 rounded-full ${STATUS_DOT[log.status] || 'bg-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{log.status}</span>
                    </div>
                  </div>
                </div>
                <button className="text-[#1241a1] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 pr-1">
                  Detail <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 disabled:opacity-40 flex items-center gap-1 hover:text-[#1241a1] transition-colors"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`size-8 shrink-0 rounded-lg text-sm font-bold ${page === n ? 'bg-[#1241a1] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 disabled:opacity-40 flex items-center gap-1 hover:text-[#1241a1] transition-colors"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

     

      {/* Manual Entry Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black mb-6">Create Security Entry</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Incident Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#1241a1]/30"
                >
                  <option>Perimeter Breach</option>
                  <option>Visitor Arrival</option>
                  <option>Unauthorized Access</option>
                  <option>Maintenance Entry</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Sector 4 Gate" 
                  className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#1241a1]/30" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Observation (Optional)</label>
                <input 
                  type="text" 
                  value={formData.sub}
                  onChange={e => setFormData({ ...formData, sub: e.target.value })}
                  placeholder="Additional details..." 
                  className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#1241a1]/30" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Severity</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setFormData({ ...formData, severity: s })}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors uppercase tracking-widest text-[10px] ${formData.severity === s ? 'bg-[#1241a1] text-white' : 'bg-slate-50 dark:bg-slate-800 hover:bg-[#1241a1]/10'}`}
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
                className="flex-1 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogSubmit}
                className="flex-1 py-3 bg-[#1241a1] text-white font-bold rounded-xl shadow-xl shadow-[#1241a1]/20 active:scale-[0.98] transition-all"
              >
                Log Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className={`size-16 rounded-2xl flex items-center justify-center ${selectedLog.iconColor} shadow-lg`}>
                {(() => {
                  const Icon = LOG_ICONS[selectedLog.icon] || ShieldAlert;
                  return <Icon className="size-8" />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedLog.type}</h3>
                <p className="text-sm text-slate-500">{selectedLog.location}</p>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-sm font-bold">{selectedLog.time}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold">{selectedLog.status}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-left col-span-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Observation</p>
                  <p className="text-xs">{selectedLog.sub}</p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3 mt-4">
                <button className="w-full bg-[#1241a1] text-white font-bold py-3 rounded-xl">Generate Incident Report</button>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="w-full font-bold text-slate-400 py-2"
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
