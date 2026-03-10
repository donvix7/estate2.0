'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'

const REQUESTS = [
  {
    id: '#MN-1024',
    issue: 'HVAC Repair',
    subtitle: 'Heating not turning on',
    location: 'Block A – Apt 101',
    priority: 'High',
    status: 'In Progress',
    date: 'Oct 24, 2024',
    timeline: [
      { label: 'Reported',    time: 'Oct 24, 2024 • 09:12 AM', done: true },
      { label: 'Scheduled',   time: 'Oct 24, 2024 • 11:30 AM', done: true },
      { label: 'In Progress', time: 'Started 45 mins ago',       done: false, current: true },
    ],
    technician: { name: 'Robert Chen', title: 'Senior HVAC Specialist', initials: 'RC', color: 'bg-sky-600' },
  },
  {
    id: '#MN-1025',
    issue: 'Leaky Faucet',
    subtitle: 'Kitchen sink water drip',
    location: 'Block B – Apt 204',
    priority: 'Medium',
    status: 'Scheduled',
    date: 'Oct 22, 2024',
    timeline: [
      { label: 'Reported',  time: 'Oct 22, 2024 • 08:00 AM', done: true },
      { label: 'Scheduled', time: 'Oct 22, 2024 • 10:00 AM', done: false, current: true },
    ],
    technician: { name: 'Grace Eze', title: 'Plumbing Specialist', initials: 'GE', color: 'bg-emerald-600' },
  },
  {
    id: '#MN-1026',
    issue: 'Electrical Outage',
    subtitle: 'Master bedroom outlets',
    location: 'Block C – Apt 307',
    priority: 'Urgent',
    status: 'Pending',
    date: 'Oct 21, 2024',
    timeline: [
      { label: 'Reported', time: 'Oct 21, 2024 • 07:45 AM', done: true },
      { label: 'Pending',  time: 'Awaiting assignment',       done: false, current: true },
    ],
    technician: null,
  },
  {
    id: '#MN-1027',
    issue: 'Pest Control',
    subtitle: 'Seasonal treatment',
    location: 'Block D – Apt 412',
    priority: 'Low',
    status: 'Completed',
    date: 'Oct 18, 2024',
    timeline: [
      { label: 'Reported',  time: 'Oct 18, 2024 • 09:00 AM', done: true },
      { label: 'Scheduled', time: 'Oct 18, 2024 • 11:00 AM', done: true },
      { label: 'Completed', time: 'Oct 18, 2024 • 03:30 PM', done: true },
    ],
    technician: { name: 'Victor Okafor', title: 'Pest Control Expert', initials: 'VO', color: 'bg-amber-600' },
  },
]

const PRIORITY_STYLES = {
  High:   'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
  Medium: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
  Urgent: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
  Low:    'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
}

const STATUS_DOT = {
  'In Progress': 'bg-blue-500',
  'Scheduled':   'bg-[#1241a1]',
  'Pending':     'bg-slate-400 dark:bg-slate-600',
  'Completed':   'bg-emerald-500',
}

const STATUS_BADGE = {
  'In Progress': 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
  'Scheduled':   'bg-[#1241a1]/10 text-[#1241a1]',
  'Pending':     'bg-slate-100 dark:bg-slate-800 text-slate-500',
  'Completed':   'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
}

const TAB_FILTERS = {
  all:     () => true,
  active:  r => ['In Progress', 'Scheduled', 'Pending'].includes(r.status),
  history: r => r.status === 'Completed',
}

export default function MaintenanceOverviewPage() {
  const [selected, setSelected] = useState(REQUESTS[0])
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [contactType, setContactType] = useState(null)
  const detailRef = useRef(null)

  const handleSelect = (req) => {
    setSelected(req)
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  const visible = REQUESTS.filter(r =>
    TAB_FILTERS[tab](r) &&
    (r.issue.toLowerCase().includes(search.toLowerCase()) ||
     r.location.toLowerCase().includes(search.toLowerCase()) ||
     r.id.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col lg:flex-row -m-4 lg:-m-8 min-h-[calc(100vh-4rem)]">

      {/* ── Left: Requests List ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 gap-6 bg-slate-50 dark:bg-background-dark">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
              <Link href="/dashboard/resident" className="hover:text-[#1241a1] transition-colors">Dashboard</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-[#1241a1] font-semibold">Maintenance</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Maintenance Overview</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and track all your property repair requests</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg gap-0.5">
              {[['all', 'All'], ['active', 'Active'], ['history', 'History']].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    tab === id
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <Link
              href="/dashboard/resident/maintenance/new"
              className="bg-[#1241a1] hover:bg-[#1241a1]/90 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-[#1241a1]/20"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New Request
            </Link>
          </div>
        </div>

        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by issue, ID, or location..."
            className="w-full bg-white dark:bg-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1241a1]/30 outline-none transition-all"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                {['ID', 'Issue', 'Location', 'Priority', 'Status'].map(h => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${h === 'Priority' ? 'text-center' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="">
              {visible.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-sm">No requests found.</td></tr>
              ) : visible.map(req => (
                <tr
                  key={req.id}
                  onClick={() => handleSelect(req)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                    selected?.id === req.id
                      ? 'bg-[#1241a1]/5 '
                      : ''
                  }`}
                >
                  <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">{req.id}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{req.issue}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{req.subtitle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{req.location}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${PRIORITY_STYLES[req.priority] || ''}`}>{req.priority}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${STATUS_DOT[req.status] || 'bg-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{req.status}</span>
                      </div>
                      <button className="lg:hidden text-[10px] font-black uppercase tracking-widest text-[#1241a1] bg-[#1241a1]/5 px-2 py-1 rounded-md">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Right: Detail Panel ── */}
      {selected && (
        <aside ref={detailRef} className="w-full lg:w-96 shrink-0 bg-white dark:bg-slate-900 overflow-y-auto ">
          <div className="p-6 flex flex-col gap-7">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${STATUS_BADGE[selected.status] || ''}`}>{selected.status}</span>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <h3 className="text-lg font-bold leading-snug">{selected.id}: {selected.issue}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-base">location_on</span>
                {selected.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                Submitted {selected.date}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status Timeline</h4>
              <div className="flex flex-col pl-2">
                {selected.timeline.map((step, i) => {
                  const isLast = i === selected.timeline.length - 1
                  return (
                    <div key={step.label} className="relative flex items-start gap-4 pb-6">
                      {!isLast && <div className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />}
                      <div className={`z-10 size-4 rounded-full shrink-0 mt-0.5 ${
                        step.done ? 'bg-emerald-500' : step.current ? 'bg-[#1241a1] shadow-[0_0_0_4px_rgba(18,65,161,0.2)]' : 'bg-slate-300 dark:bg-slate-700'
                      }`} />
                      <div className="flex flex-col">
                        <p className="text-xs font-bold">{step.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{step.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {selected.technician ? (
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assigned Technician</h4>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`size-12 rounded-xl flex items-center justify-center text-white font-black text-base ${selected.technician.color}`}>
                      {selected.technician.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{selected.technician.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{selected.technician.title}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setContactType('message')}
                      className="flex-1 bg-white dark:bg-slate-700 text-xs font-bold py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span> Message
                    </button>
                    <button 
                      onClick={() => setContactType('call')}
                      className="flex-1 bg-white dark:bg-slate-700 text-xs font-bold py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">call</span> Call
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Awaiting technician assignment
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Photos &amp; Files</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 cursor-pointer">
                  <span className="material-symbols-outlined">add</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              {selected.status !== 'Completed' && (
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                  Mark as Completed
                </button>
              )}
              <Link
                href="/dashboard/resident/maintenance/new"
                className="w-full bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-bold py-3 rounded-xl transition-colors text-sm text-center block"
              >
                New Request
              </Link>
              <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
                Reassign Technician
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Contact Modal */}
      {contactType && selected?.technician && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className=" dark:bg-slate-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className={`size-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl ${selected.technician.color} shadow-lg`}>
                {selected.technician.initials}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selected.technician.name}</h3>
                <p className="text-sm text-slate-500">{selected.technician.title}</p>
              </div>
              
              <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Contact Method</span>
                  <span className="font-bold uppercase tracking-widest text-[10px] text-[#1241a1] px-2 py-1 bg-[#1241a1]/5 rounded-md">
                    {contactType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Estate ID</span>
                  <span className="font-bold">E-TECH-842</span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={() => {
                    alert(`${contactType === 'call' ? 'Initializing encrypted voice path...' : 'Opening secure messaging channel...'}`);
                    setContactType(null);
                  }}
                  className="w-full bg-[#1241a1] hover:bg-[#1241a1]/90 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-[#1241a1]/20"
                >
                  Proceed to {contactType === 'call' ? 'Call' : 'Message'}
                </button>
                <button 
                  onClick={() => setContactType(null)}
                  className="w-full font-bold text-slate-400 hover:text-slate-600 py-2 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}