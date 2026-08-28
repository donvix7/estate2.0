'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Key,
  AlertTriangle,
  CreditCard,
  BarChart3,
  Megaphone,
  QrCode,
  FileText,
  Smartphone,
  Lock,
  ShieldCheck,
  Clock,
  ArrowRight,
  MapPin,
  Check,
  Play,
  Menu,
  X,
  MoreHorizontal,
  Folder,
  Sparkles,
  RefreshCw,
  Mic,
  LayoutDashboard,
  Smile,
  Users,
  ShieldAlert,
  DoorOpen,
  Bell,
  Wallet,
  TrendingUp,
  Send,
  Share2,
  Globe,
  Link2,
  Image as ImageIcon,
  LogIn
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import MetricCard from '@/components/MetricCard'
import FAQ from '@/components/faq'

// Scroll Reveal - fires once per element, respects reduced motion
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${className} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// MVP Features Data
const MVP_FEATURES = [
  {
    id: 'access-control',
    title: 'Access Control',
    icon: <Key className="w-5 h-5" />,
    description: 'Secure visitor management with digital passes and verification',
    demo: 'access',
    stats: { label: 'Access Efficiency', value: '95%', change: '+24%' }
  },
  {
    id: 'panic-emergency',
    title: 'Panic & Emergency',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Instant emergency alerts with multi-channel notification',
    demo: 'emergency',
    stats: { label: 'Response Time', value: '< 60s', change: '-65%' }
  },
  {
    id: 'payments',
    title: 'Basic Payments',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Simple and secure estate dues collection',
    demo: 'payments',
    stats: { label: 'Collection Rate', value: '98%', change: '+18%' }
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Centralized management and monitoring platform',
    demo: 'admin',
    stats: { label: 'Operational Efficiency', value: '85%', change: '+32%' }
  },
  {
    id: 'communication',
    title: 'Basic Communication',
    icon: <Megaphone className="w-5 h-5" />,
    description: 'Essential announcements and notifications',
    demo: 'communication',
    stats: { label: 'Engagement Rate', value: '92%', change: '+41%' }
  }
]

// Interactive Demo Components (mirror the live dashboard UI)
const AccessControlDemo = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <MetricCard icon={<DoorOpen className="size-5" />} label="Total Gates" value="4" tone="indigo" />
      <MetricCard icon={<ShieldCheck className="size-5" />} label="Active" value="3" tone="green" />
      <MetricCard icon={<Clock className="size-5" />} label="Pending" value="2" tone="amber" />
    </div>

    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="size-4 text-slate-400" />
          Live Gate Status
        </h4>
        <span className="text-[10px] font-mono text-slate-400 shrink-0">estate::access</span>
      </div>
      {[
        { name: 'Main Gate Entrance', status: 'Open', tone: 'green' },
        { name: 'Service & Cargo Gate', status: 'Maintenance', tone: 'amber' },
        { name: 'Pedestrian Walkway', status: 'Closed', tone: 'red' }
      ].map((gate, i) => (
        <div key={i} className="flex items-center justify-between gap-3 p-3 bg-[#818b94]/10 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <DoorOpen className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{gate.name}</p>
              <p className="text-[10px] text-slate-400">Updated just now</p>
            </div>
          </div>
          <StatusBadge status={gate.status} tone={gate.tone} />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <QrCode className="size-4 text-slate-400" />
          Visitor Pass
        </h4>
        <div className="p-4 bg-[#818b94]/10 rounded-xl text-center">
          <div className="inline-block p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <QrCode className="w-16 h-16 text-slate-900 dark:text-white mx-auto" />
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-3">Code · 7845</p>
          <p className="text-[10px] text-slate-400">Valid until 11:59 PM</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="size-4 text-slate-400" />
          Entry Log
        </h4>
        {[
          { time: '10:30 AM', name: 'Visitor · Main Gate', status: 'Approved', tone: 'green' },
          { time: '9:15 AM', name: 'Visitor · Service Gate', status: 'Pending', tone: 'amber' },
          { time: '8:45 AM', name: 'Resident · Main Gate', status: 'Completed', tone: 'green' }
        ].map((log, i) => (
          <div key={i} className="flex items-center justify-between gap-2 p-2.5 bg-[#818b94]/10 rounded-lg">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">{log.name}</p>
              <p className="text-[10px] text-slate-400">{log.time}</p>
            </div>
            <StatusBadge status={log.status} tone={log.tone} />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const PanicEmergencyDemo = () => {
  const [panicActive, setPanicActive] = useState(false)

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
        <button
          onClick={() => setPanicActive(!panicActive)}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full text-white text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all duration-300 shadow-lg shrink-0 ${
            panicActive ? 'bg-red-600 scale-95 animate-pulse' : 'bg-red-500 hover:scale-105'
          }`}
        >
          <AlertTriangle className="size-8 sm:size-10 mb-1.5" />
          <span>{panicActive ? 'ALERT SENT' : 'PANIC'}</span>
          <span className="text-[9px] font-normal mt-0.5 opacity-80">{panicActive ? 'Tap to cancel' : 'Tap to trigger'}</span>
        </button>
        <div className="flex-1 w-full space-y-2.5">
          {[
            { name: 'Estate Security', active: panicActive },
            { name: 'Admin Dashboard', active: panicActive }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#818b94]/10 rounded-xl">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
              <StatusBadge status={item.active ? 'Active' : 'Pending'} tone={item.active ? 'green' : 'amber'} />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={<Clock className="size-5" />} label="Avg Response" value="< 60s" tone="blue" />
        <MetricCard icon={<ShieldAlert className="size-5" />} label="Alerts Today" value="3" tone="rose" />
      </div>
    </div>
  )
}

const PaymentsDemo = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <MetricCard icon={<Wallet className="size-5" />} label="Collection Rate" value="98%" tone="green" />
      <MetricCard icon={<TrendingUp className="size-5" />} label="Collected" value="$128k" tone="indigo" />
    </div>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="size-4 text-slate-400" />
          Outstanding Dues
        </h4>
        <span className="text-[10px] font-mono text-slate-400">June 2026</span>
      </div>
      {[
        { name: 'Unit 12 · Azure Residences', amount: '$85.00', status: 'Paid', tone: 'green' },
        { name: 'Unit 08 · Azure Residences', amount: '$85.00', status: 'Pending', tone: 'amber' },
        { name: 'Unit 21 · Azure Residences', amount: '$85.00', status: 'Overdue', tone: 'red' }
      ].map((inv, i) => (
        <div key={i} className="flex items-center justify-between gap-3 p-3 bg-[#818b94]/10 rounded-xl">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{inv.name}</p>
            <p className="text-[10px] text-slate-400">Estate dues · Due 15th</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white">{inv.amount}</span>
            <StatusBadge status={inv.status} tone={inv.tone} />
          </div>
        </div>
      ))}
    </div>
    <Button variant="success" className="w-full" icon={Lock}>
      Pay Now Securely
    </Button>
  </div>
)

const AdminDashboardDemo = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <MetricCard icon={<Users className="size-5" />} label="Residents" value="1,248" tone="indigo" />
      <MetricCard icon={<DoorOpen className="size-5" />} label="Visitors Today" value="24" tone="blue" />
      <MetricCard icon={<Bell className="size-5" />} label="Pending Invites" value="3" tone="amber" />
      <MetricCard icon={<Wallet className="size-5" />} label="Collection" value="98%" tone="emerald" />
    </div>
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="size-4 text-slate-400" />
          Recent Security Logs
        </h4>
        <span className="text-[10px] font-mono text-slate-400">live feed</span>
      </div>
      {[
        { type: 'Gate Entry Verified', location: 'Main Gate', status: 'Resolved', tone: 'green' },
        { type: 'Panic Alert Raised', location: 'Block C', status: 'Pending', tone: 'amber' },
        { type: 'Lost Item Reported', location: 'Amenity Center', status: 'Pending', tone: 'amber' },
        { type: 'Visitor Approved', location: 'Unit 12', status: 'Resolved', tone: 'green' }
      ].map((log, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-[#818b94]/10 rounded-xl">
          <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
            log.status === 'Resolved'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
          }`}>
            {log.status === 'Resolved' ? <ShieldCheck className="size-4" /> : <AlertTriangle className="size-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{log.type}</p>
            <p className="text-[10px] text-slate-400 truncate">{log.location}</p>
          </div>
          <StatusBadge status={log.status} tone={log.tone} />
        </div>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      <Button variant="indigo" size="sm" icon={Users}>Verify Visitor</Button>
      <Button variant="danger" size="sm" icon={Megaphone}>Broadcast Alert</Button>
      <Button variant="secondary" size="sm" icon={FileText}>View Reports</Button>
    </div>
  </div>
)

const CommunicationDemo = () => {
  const [message, setMessage] = useState('')
  const [broadcasts, setBroadcasts] = useState([
    { title: 'Water Supply Maintenance', time: '2 hours ago', status: 'Maintenance', tone: 'amber' },
    { title: 'Security Alert: Suspicious Activity', time: 'Yesterday', status: 'Security', tone: 'red' }
  ])

  const handleBroadcast = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setBroadcasts([{ title: message, time: 'Just now', status: 'General', tone: 'blue' }, ...broadcasts])
    setMessage('')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={<Megaphone className="size-5" />} label="Announcements" value="12" tone="indigo" />
        <MetricCard icon={<Bell className="size-5" />} label="Read Rate" value="92%" tone="green" />
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Megaphone className="size-4 text-slate-400" />
          Send Announcement
        </h4>
        <form onSubmit={handleBroadcast} className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-20 p-3 rounded-lg focus:outline-none bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            placeholder="Type announcement to broadcast..."
          />
          <Button type="submit" variant="indigo" className="w-full" icon={Send}>
            Broadcast to All Residents
          </Button>
        </form>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Live Board</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
          {broadcasts.map((announcement, i) => (
            <div key={i} className="p-3 bg-[#818b94]/10 rounded-xl flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{announcement.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{announcement.time}</p>
              </div>
              <StatusBadge status={announcement.status} tone={announcement.tone} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DemoComponent = ({ demoType }) => {
  switch (demoType) {
    case 'access': return <AccessControlDemo />
    case 'emergency': return <PanicEmergencyDemo />
    case 'payments': return <PaymentsDemo />
    case 'admin': return <AdminDashboardDemo />
    case 'communication': return <CommunicationDemo />
    default: return <AccessControlDemo />
  }
}

// Features List
const features = [
  {
    title: "10x Property Management",
    description: "Automate manual tasks and streamline operations. Reclaim hours of your week with our intuitive management dashboard.",
    icon: <LayoutDashboard className="text-lg sm:text-xl" />
  },
  {
    title: "Ironclad Security",
    description: "Prevent unauthorized entry with digital visitor passes, instant panic alerts, and real-time security logs.",
    icon: <ShieldCheck className="text-lg sm:text-xl" />
  },
  {
    title: "Effortless Payments",
    description: "Achieve 98%+ collection rates with automated billing, seamless online payments, and instant digital receipts.",
    icon: <CreditCard className="text-lg sm:text-xl" />
  },
  {
    title: "Delightful Living",
    description: "Give residents a VIP experience with instant amenity bookings, easy communication, and fast maintenance resolutions.",
    icon: <Smile className="text-lg sm:text-xl" />
  },
  {
    title: "Instant Communication",
    description: "Broadcast important announcements instantly to all residents. No more ignored mass emails or paper notices.",
    icon: <Megaphone className="text-lg sm:text-xl" />
  },
  {
    title: "Data-Driven Decisions",
    description: "Gain complete visibility into your estate's performance with real-time analytics and comprehensive reporting.",
    icon: <BarChart3 className="text-lg sm:text-xl" />
  }
]

// Featured Estates
const estateImages = [
  { name: 'The Azure Residences', location: 'Lekki Phase 1', img: '/estatelanding 2.jpg' },
  { name: 'Oakwood Heights', location: 'Victoria Island', img: '/estatelanding 3.jpg' },
  { name: 'Skyloft Gardens', location: 'Ikoyi, Lagos', img: '/estatelanding 4.jpg' }
]

// Trust Strip Logos
const trustCompanies = ['Northline', 'Arcform', 'Velo Group', 'Juniper', 'Meridian']

export default function HomePage() {
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState('access-control')
  const [studioPrompt, setStudioPrompt] = useState(
    "Draft an announcement to residents about water maintenance scheduled for Saturday morning, adopting our polite but firm tone."
  )
  const [studioGenerating, setStudioGenerating] = useState(false)
  const [studioResult, setStudioResult] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleGetStarted = () => {
    router.push('/auth/signup')
  }

  const runStudioGeneration = () => {
    setStudioGenerating(true)
    setStudioResult("")
    setTimeout(() => {
      setStudioGenerating(false)
      setStudioResult(
        "Subject: Scheduled Water Maintenance - Saturday, June 27\n\nDear Residents,\n\nPlease be informed that essential water system maintenance is scheduled for Saturday morning (8:00 AM to 11:00 AM). Water supply will be temporarily unavailable during this period. We kindly request that you store adequate water in advance. Thank you for your cooperation.\n\n- Estate Management"
      )
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-page-bg text-text font-body-lg antialiased selection:bg-black selection:text-white overflow-x-hidden">
      {/* 1. Floating Nav (TopAppBar) */}
      <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex items-center justify-center px-3 sm:px-4 w-full pointer-events-none">
        <div className="w-full max-w-[700px] flex items-center justify-between bg-black/95 backdrop-blur-xl rounded-full px-2 sm:px-3 py-2 shadow-xl ring-1 ring-white/10 h-[48px] sm:h-[56px]">
          <div className="flex items-center gap-2 sm:gap-4 pl-1 sm:pl-2">
            <div className="">
              <span className="text-page-bg font-bold text-xs sm:text-sm leading-none">EMMS</span>
            </div>
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              <a className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-page-bg/80 hover:text-page-bg transition-colors duration-300" href="#features">Features</a>
              <a className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-page-bg/80 hover:text-page-bg transition-colors duration-300" href="#console">Console</a>
              <a className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-page-bg/80 hover:text-page-bg transition-colors duration-300" href="#estates">Estates</a>
              <a className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-page-bg/80 hover:text-page-bg transition-colors duration-300" href="#faq">FAQ</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-page-bg hover:text-white transition-colors p-1"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link className="bg-white px-3 py-2 rounded-full flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider" href='/auth/login'>
                <LogIn className="w-5 h-5" />
                Get Started
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pointer-events-auto w-full max-w-[700px] mt-2 bg-black/95 backdrop-blur-xl rounded-2xl p-4 ring-1 ring-white/10 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <nav className="flex flex-col gap-3">
              <a className="text-sm font-semibold text-page-bg/80 hover:text-page-bg transition-colors" href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a className="text-sm font-semibold text-page-bg/80 hover:text-page-bg transition-colors" href="#console" onClick={() => setMobileMenuOpen(false)}>Console</a>
              <a className="text-sm font-semibold text-page-bg/80 hover:text-page-bg transition-colors" href="#estates" onClick={() => setMobileMenuOpen(false)}>Estates</a>
              <a className="text-sm font-semibold text-page-bg/80 hover:text-page-bg transition-colors" href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* 2. Hero Section */}
        <section className="pt-[140px] sm:pt-[180px] md:pt-[200px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto flex flex-col items-center text-center relative overflow-hidden bg-page-bg pb-[60px] sm:pb-[80px] md:pb-[120px]">
          {/* Ambient Gradient Orbs */}
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] md:w-[560px] md:h-[560px] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-[110px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
          <div className="absolute top-24 -right-40 w-[380px] h-[380px] md:w-[520px] md:h-[520px] bg-emerald-200/40 dark:bg-emerald-900/20 rounded-full blur-[110px] animate-pulse pointer-events-none" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-amber-100/50 dark:bg-amber-900/10 rounded-full blur-[100px] pointer-events-none" />

          <span className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[82px] leading-[1.05] tracking-[-0.03em] sm:tracking-[-0.04em] font-bold text-balance max-w-4xl mb-4 sm:mb-6 lg:mb-8 text-text animate-in fade-in slide-in-from-bottom-6 duration-700">
            Bring every estate into{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">
              focus
            </span>
          </span>
          <p className="text-base sm:text-lg md:text-body-lg text-muted max-w-2xl mb-6 sm:mb-8 lg:mb-10 px-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            Streamline property management, visitor control, and billing collections. Bring absolute clarity to your community&apos;s safety and operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <Button onClick={handleGetStarted} variant="primary" size="lg" className="rounded-full px-8">
              Get Started
              <ArrowRight className="size-4" />
            </Button>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg" className="rounded-full px-8">
                View Live Demo
              </Button>
            </Link>
          </div>

          <div className="w-full max-w-[1492px] bg-panel-bg overflow-hidden shadow-2xl relative z-10 rounded-2xl sm:rounded-3xl md:rounded-[40px] h-[300px] sm:h-[450px] md:h-[600px] animate-in fade-in duration-1000 delay-300">
            <Image
              src="/estatelanding.jpg"
              alt="Luxury Estate"
              width={1492}
              height={600}
              unoptimized
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 animate-float">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-lg">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                </span>
                <StatusBadge status="Live" tone="green" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 animate-float-delayed">
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span className="text-[10px] sm:text-xs font-semibold text-text">Access Verified · 2,400+ Residents</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Trust Strip */}
        <section className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-10 border-t border-line/30 max-w-[1728px] mx-auto flex flex-col items-center bg-page-bg relative z-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted mb-4 sm:mb-6 text-center">Powering operations in elite developments</p>
          <div className="marquee-container w-full">
            <div className="animate-marquee">
              {[...trustCompanies, ...trustCompanies].map((company, i) => (
                <span key={i} className="shrink-0 text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-muted pr-12 sm:pr-[60px] md:pr-[100px]">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Floating Visual Collage */}
        <section className="min-h-[900px] sm:min-h-[1100px] md:min-h-[1250px] w-full max-w-[1728px] mx-auto relative overflow-hidden bg-page-bg py-6 sm:py-8 md:py-10 border-t border-line/20">
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none mt-10 sm:mt-16 md:mt-20">
            <h2 className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] font-bold text-text tracking-tighter leading-[0.9] text-center opacity-[0.9]">
              Smart<br />Living
            </h2>
          </div>

          <div className="hidden sm:block">
            {/* 1. Top-left: Image with Glass UI Overlay */}
            <div className="absolute animate-float" style={{ left: '8%', top: '8%', width: '300px', height: '240px', zIndex: 5 }}>
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-white/10 backdrop-blur-2xl ring-1 ring-white/40 shadow-2xl hover:scale-110 transition-all duration-300">
                <Image
                  src="/estatelanding 2.jpg"
                  alt="Security Console"
                  width={300}
                  height={240}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/30 backdrop-blur-xl ring-1 ring-white/40 rounded-2xl p-4 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text">Access Scan</span>
                    <StatusBadge status="Verified" tone="green" />
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-1.5">
                    <div className="bg-black w-[100%] h-1.5 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Top-right: Tall Card with Image */}
            <div className="absolute animate-float-delayed" style={{ right: '10%', top: '12%', width: '240px', height: '280px', zIndex: 5 }}>
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-white/10 backdrop-blur-2xl ring-1 ring-white/40 shadow-2xl hover:scale-110 transition-all duration-300">
                <Image
                  src="/estatelanding 3.jpg"
                  alt="Community Entrance"
                  width={240}
                  height={280}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/40 backdrop-blur-md ring-1 ring-white/50 flex items-center justify-center shadow-sm">
                  <Sparkles className="text-text w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 3. Mid-left: Floating Glass UI */}
            <div className="absolute animate-float-slow" style={{ left: '4%', top: '42%', width: '220px', zIndex: 15 }}>
              <div className="relative w-full rounded-[28px] overflow-hidden bg-white/20 backdrop-blur-3xl ring-1 ring-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-text">Access Sync</span>
                  <div className="w-10 h-6 bg-black rounded-full relative shadow-inner cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-md">
                    <RefreshCw className="text-white w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-text">Gate Server</span>
                    <span className="text-[12px] leading-[1.6] text-muted">Connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Mid-right: Image with Content Guidelines Label */}
            <div className="absolute animate-float-delayed" style={{ right: '6%', top: '48%', width: '280px', height: '200px', zIndex: 5 }}>
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-white/10 backdrop-blur-2xl ring-1 ring-white/40 shadow-2xl hover:scale-110 transition-all duration-300">
                <Image
                  src="/estatelanding 4.jpg"
                  alt="Amenity Center"
                  width={280}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full ring-1 ring-white/50 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text">Gate Status: Live</span>
                </div>
              </div>
            </div>

            {/* 5. Bottom-left: Large Image with Brand Voice */}
            <div className="absolute animate-float" style={{ left: '12%', top: '68%', width: '320px', height: '220px', zIndex: 5 }}>
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-white/10 backdrop-blur-2xl ring-1 ring-white/40 shadow-2xl hover:scale-110 transition-all duration-300">
                <Image
                  src="/estatelanding.jpg"
                  alt="Community Life"
                  width={320}
                  height={220}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-5 left-5 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full ring-1 ring-white/50 shadow-sm flex items-center gap-2">
                  <Mic className="text-text w-4 h-4" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text">Community Voice</span>
                </div>
              </div>
            </div>

            {/* 6. Bottom-right: Wide Image */}
            <div className="absolute animate-float-slow" style={{ right: '12%', top: '72%', width: '300px', height: '200px', zIndex: 5 }}>
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-white/10 backdrop-blur-2xl ring-1 ring-white/40 shadow-2xl hover:scale-110 transition-all duration-300">
                <Image
                  src="/estatelanding 2.jpg"
                  alt="Smart Living"
                  width={300}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>

            {/* 7. Floating Comment / Profile */}
            <div className="absolute animate-float" style={{ left: '42%', top: '84%', width: 'max-content', zIndex: 20 }}>
              <div className="relative bg-white/30 hover:scale-110 transition-all duration-300 backdrop-blur-3xl rounded-[24px] flex items-center gap-4 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.1)] ring-1 ring-white/50">
                <div className="w-10 h-10 rounded-full bg-soft-card overflow-hidden shadow-sm ring-1 ring-white/60">
                  <Image
                    src="/estatelanding 3.jpg"
                    alt="Resident Representative"
                    width={40}
                    height={40}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col pr-4">
                  <span className="text-[11px] font-bold text-text">Alex Morgan</span>
                  <span className="text-[13px] leading-[1.6] text-text/80">Secured our community overnight!</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Manifesto Section */}
        <section className="py-[120px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto relative flex flex-col items-center text-center bg-soft-card tracking-tight ">
          <AnimatedSection className="max-w-[1000px]">
            <span className="text-[28px] sm:text-[36px] md:text-[42px] leading-[1.1] text-balance tracking-tight text-text font-bold">
              As smart residential communities expand across cities, the need for a unified operations hub has never been more critical. EstateEase connects your security, billing, and residents.
            </span>
          </AnimatedSection>
        </section>

        {/* 6. Community OS Section */}
        <section className="py-[60px] sm:py-[80px] md:py-[100px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-[100px] items-center">
            <AnimatedSection>
              <div className="bg-gradient-to-br from-soft-card-2 to-soft-card rounded-2xl sm:rounded-3xl md:rounded-[40px] p-4 sm:p-6 md:p-8 h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center relative overflow-hidden">
                <div className="w-full bg-white-card rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <span className="text-xs sm:text-sm font-bold text-text">Estate Files</span>
                    <MoreHorizontal className="w-5 h-5 text-muted" />
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { icon: <Folder className="text-lg sm:text-xl" />, name: 'Estate_Bylaws' },
                      { icon: <FileText className="text-lg sm:text-xl" />, name: 'Annual_Budget_2026' },
                      { icon: <ImageIcon className="text-lg sm:text-xl" />, name: 'Zoning_Map_Layout' },
                      { icon: <BarChart3 className="text-lg sm:text-xl" />, name: 'Dues_Collection_Q2' }
                    ].map((file, i) => (
                      <div key={i} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-soft-card rounded-xl transition-colors cursor-pointer">
                        <span className="text-black font-semibold">{file.icon}</span>
                        <span className="text-sm sm:text-base font-medium text-text">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <div className="flex flex-col justify-center h-full w-full">
              <AnimatedSection delay={100}>
                <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold mb-8 sm:mb-10 md:mb-12 text-text">The operating system for modern community management.</h3>
                <div className="relative pl-6 sm:pl-8 border-l-[3px] border-line space-y-8 sm:space-y-10 md:space-y-12">
                  <div className="absolute left-[-3px] top-0 w-[3px] h-1/3 bg-black"></div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text">Centralized Knowledge</h4>
                    <p className="text-sm sm:text-base md:text-body-md text-muted leading-relaxed">Bring all your bylaws, development guidelines, zoning layouts, and strategic files into one secure, unified directory.</p>
                  </div>
                  <div className="opacity-50 hover:opacity-100 transition-opacity">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text">Operational Intelligence</h4>
                    <p className="text-sm sm:text-base md:text-body-md text-muted leading-relaxed">Vibe with automated visitor registrations, secure guard notifications, and instantaneous billing generation.</p>
                  </div>
                  <div className="opacity-50 hover:opacity-100 transition-opacity">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text">Seamless Distribution</h4>
                    <p className="text-sm sm:text-base md:text-body-md text-muted leading-relaxed">Broadcast announcements, safety warnings, and dues reminders to every homeowner instantly via SMS or push.</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 7. Estate Studio Section */}
        <section className="py-[60px] sm:py-[80px] md:py-[100px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-[100px] items-center">
            <div className="flex flex-col justify-center h-full w-full order-2 lg:order-1">
              <AnimatedSection delay={100}>
                <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold mb-8 sm:mb-10 md:mb-12 text-text">Draft community alerts in seconds.</h3>
                <div className="relative pl-6 sm:pl-8 border-l-[3px] border-line space-y-6 sm:space-y-8 md:space-y-10">
                  <div className="absolute left-[-3px] top-0 w-[3px] h-1/4 bg-black"></div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-text">Automated Community Vetting</h4>
                    <p className="text-sm sm:text-base md:text-body-md text-muted leading-relaxed">Every alert generated automatically aligns with your estate rules and tone standards.</p>
                  </div>
                  <div className="opacity-60 hover:opacity-100 transition-opacity">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-text">Contextual Templates</h4>
                    <p className="text-sm sm:text-base md:text-body-md text-muted leading-relaxed">Formats styled specifically for maintenance alerts, security warnings, or general notices.</p>
                  </div>
                  <div className="opacity-60 hover:opacity-100 transition-opacity">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-text">Multi-Channel Broadcast</h4>
                    <p className="text-sm sm:text-base md:text-body-md text-muted leading-relaxed">Sync and deploy approved text across SMS, emails, and resident portal notices simultaneously.</p>
                  </div>
                  <div className="opacity-60 hover:opacity-100 transition-opacity">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-text">Sentiment Insights</h4>
                    <p className="text-sm sm:text-base md:text-body-md text-muted leading-relaxed">Track read receipts and resident reactions to optimize communication clarity.</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            <AnimatedSection className="order-1 lg:order-2">
              <div className="bg-gradient-to-tr from-[#E0EAFC] to-[#CFDEF3] rounded-2xl sm:rounded-3xl md:rounded-[40px] p-4 sm:p-6 md:p-8 h-[450px] sm:h-[500px] md:h-[600px] flex items-center justify-center relative overflow-hidden shadow-inner">
                <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full ring-1 ring-black flex items-center justify-center shrink-0">
                      <span className="text-black font-bold text-[10px] leading-none">E</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-muted">ESTATE STUDIO AI</span>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 shadow-sm">
                    <textarea
                      value={studioPrompt}
                      onChange={(e) => setStudioPrompt(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-sm sm:text-base text-text resize-none h-20 sm:h-24"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <span className="text-[10px] text-muted font-bold">120 Tokens</span>
                    <button
                      onClick={runStudioGeneration}
                      disabled={studioGenerating}
                      className="w-full sm:w-auto px-4 py-2 rounded-full bg-black text-white hover:bg-text text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <Sparkles className={`text-white w-3.5 h-3.5 ${studioGenerating ? 'animate-spin' : ''}`} />
                      <span>{studioGenerating ? 'Drafting...' : 'Draft Alert'}</span>
                    </button>
                  </div>
                  {studioResult && (
                    <div className="mt-4 p-4 bg-black text-white rounded-xl text-[10px] sm:text-xs font-mono whitespace-pre-wrap text-left shadow-lg max-h-48 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {studioResult}
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* 8. Interactive Feature Console */}
        <section id="console" className="py-[60px] sm:py-[80px] md:py-[120px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/20 scroll-mt-20 sm:scroll-mt-24">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text mb-3 sm:mb-4">Experience the Live Console</h2>
            <p className="text-sm sm:text-base md:text-body-lg text-muted leading-relaxed px-2">Toggle between features below to test-drive how safety, collections, and management run on EstateEase.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            <div className="lg:col-span-5 space-y-3 sm:space-y-4 flex flex-col justify-center">
              {MVP_FEATURES.map((feat) => {
                const isActive = activeFeature === feat.id
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveFeature(feat.id)}
                    className={`w-full text-left p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-black text-white shadow-lg scale-[1.02]'
                        : 'bg-white-card text-text hover:bg-soft-card-2'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-2">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-soft-card text-black'}`}>
                        {feat.icon}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold">{feat.title}</h4>
                      {isActive && (
                        <span className="ml-auto px-2 py-0.5 rounded bg-white text-black text-[8px] sm:text-[9px] font-bold uppercase tracking-wider animate-pulse">
                          Active Demo
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] sm:text-xs ${isActive ? 'text-white/80' : 'text-muted'}`}>{feat.description}</p>
                    {isActive && (
                      <div className="mt-3 sm:mt-4 rounded-lg bg-white/10 p-3 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] sm:text-[10px] text-white/50 font-bold uppercase">{feat.stats.label}</p>
                          <p className="text-base sm:text-lg font-bold">{feat.stats.value}</p>
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-[10px] text-white/50 font-bold uppercase">Impact</p>
                          <p className="text-base sm:text-lg font-bold text-emerald-400">{feat.stats.change}</p>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="lg:col-span-7 bg-[#F4F3EF] dark:bg-slate-800/40 rounded-2xl sm:rounded-3xl md:rounded-[32px] p-4 sm:p-6 md:p-8 flex flex-col justify-center shadow-inner relative overflow-hidden">
              <div className="absolute top-3 sm:top-4 left-4 sm:left-6 flex gap-1.5 z-20">
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="hidden sm:block absolute top-3 sm:top-4 right-4 sm:right-6 text-[9px] sm:text-[10px] font-mono text-muted select-none">
                device::sandbox-console
              </div>
              <div key={activeFeature} className="mt-2 sm:mt-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DemoComponent demoType={MVP_FEATURES.find(f => f.id === activeFeature)?.demo} />
              </div>
            </div>
          </div>
        </section>

        {/* 9. Features Grid */}
        <section id="features" className="py-[60px] sm:py-[80px] md:py-28 px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/30 scroll-mt-20 sm:scroll-mt-24">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text mb-3 sm:mb-4">Robust Modules for Elite Operations</h3>
            <p className="text-sm sm:text-base md:text-body-lg text-muted leading-relaxed px-2">Everything needed to run community operations with state-of-the-art precision.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, i) => (
              <AnimatedSection key={i} delay={i * 70}>
                <div className="h-full p-5 sm:p-6 md:p-8 bg-white-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group rounded-xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-soft-card flex items-center justify-center text-text mb-4 sm:mb-6 group-hover:bg-black group-hover:text-white transition-colors rounded-lg">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text">{feature.title}</h4>
                  <p className="text-sm sm:text-base md:text-body-md text-muted leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* 10. Featured Estates */}
        <section id="estates" className="py-[60px] sm:py-[80px] md:py-28 px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/30 scroll-mt-20 sm:scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text">Premier Client Estates</h3>
            <button className="text-xs sm:text-sm font-bold text-text pb-1 hover:text-muted transition-colors flex items-center gap-2">
              <span>View All Properties</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {estateImages.map((estate, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden shadow-xl rounded-xl sm:rounded-2xl">
                    <Image
                      src={estate.img}
                      alt={estate.name}
                      width={400}
                      height={500}
                      unoptimized
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
                    <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out translate-y-4 group-hover:translate-y-0">
                      <h4 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">{estate.name}</h4>
                      <p className="text-white/80 flex items-center gap-1.5 text-xs sm:text-sm">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {estate.location}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* 11. Mobile App Promo */}
        <section className="py-[60px] sm:py-[80px] md:py-28 px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/30 overflow-hidden">
          <div className="bg-soft-card p-5 sm:p-8 lg:p-20 relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[32px] shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <AnimatedSection className="space-y-6 sm:space-y-8 md:space-y-10">
                <div>
                  <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-muted mb-3 sm:mb-4">Mobile Experience</h2>
                  <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text">Estate Management in Your Pocket</h3>
                  <p className="text-sm sm:text-base md:text-body-lg text-muted leading-relaxed mt-3 sm:mt-4">Download the resident app to request visitor entry codes, receive push panic notifications, check payment logs, or file facilities maintenance reports.</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {['Generate instant visitor QR codes', 'Receive real-time security alerts', 'Pay estate dues in one-tap', 'Book amenities & track maintenance'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4 group">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black flex items-center justify-center text-white rounded-full group-hover:scale-110 transition-transform">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-text group-hover:translate-x-1 transition-transform">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button className="flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white hover:bg-text rounded-xl transition-all shadow-xl active:scale-95">
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                    <div className="text-left">
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold opacity-60 leading-none mb-1">Download on the</p>
                      <p className="text-xs sm:text-sm font-bold leading-none">App Store</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white hover:bg-text rounded-xl transition-all shadow-xl active:scale-95">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                    <div className="text-left">
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold opacity-60 leading-none mb-1">Get it on</p>
                      <p className="text-xs sm:text-sm font-bold leading-none">Google Play</p>
                    </div>
                  </button>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={150}>
                <div className="relative flex justify-center">
                  <div className="relative z-10 w-[200px] sm:w-[240px] md:w-[280px] aspect-[9/19] bg-black p-2 sm:p-3 shadow-2xl rotate-3 transition-transform duration-500 ease-out hover:translate-y-[-20px] rounded-[28px] sm:rounded-[32px] md:rounded-[36px] ring-1 ring-white/10 animate-float-slow">
                    <div className="w-full h-full bg-slate-800 overflow-hidden relative rounded-[20px] sm:rounded-[24px] md:rounded-[28px]">
                      <Image
                        src="/estatelanding 2.jpg"
                        alt="Mobile App Interface"
                        width={280}
                        height={600}
                        unoptimized
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute -right-2 sm:right-4 bottom-10 z-20 animate-float-delayed">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 shadow-xl">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      <span className="text-[10px] sm:text-xs font-bold text-text">Panic Alert Delivered</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 12. FAQ Section */}
        <section id="faq" className="py-[60px] sm:py-[80px] md:py-28 px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto bg-page-bg border-t border-line/30 scroll-mt-20 sm:scroll-mt-24">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-muted mb-3 sm:mb-4">Support Hub</h2>
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text">Frequently Asked Questions</h3>
          </div>
          <AnimatedSection>
            <FAQ />
          </AnimatedSection>
        </section>

        {/* 13. CTA Section */}
        <section className="py-[60px] sm:py-[80px] md:py-[100px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto">
          <div className="bg-black py-12 sm:py-16 md:py-20 px-6 sm:px-8 text-center relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[40px] ring-1 ring-white/10">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/20 rounded-full blur-[110px] pointer-events-none"></div>
            <div className="relative space-y-6 sm:space-y-8 flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-1 ring-white/25 flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl leading-none">E</span>
              </div>
              <span className="text-[28px] sm:text-[40px] md:text-[60px] font-bold text-white tracking-tighter leading-[1.05] max-w-4xl text-balance">
                Experience the future of community operations
              </span>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button onClick={handleGetStarted} className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white text-black text-xs sm:text-sm font-bold rounded-full hover:bg-page-bg transition-all shadow-xl hover:-translate-y-1 active:scale-95 uppercase tracking-wider">
                  Get Started
                </button>
                <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-transparent text-white text-xs sm:text-sm font-bold rounded-full hover:bg-white/10 transition-all active:scale-95 uppercase tracking-wider ring-1 ring-white/30">
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 14. Footer */}
      <footer className="bg-black text-white pt-8 sm:pt-10 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-4 sm:px-6 md:px-10 rounded-t-[32px] sm:rounded-t-[48px] md:rounded-t-[64px] relative z-20">
        <div className="max-w-[1728px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-6 sm:mb-8 md:mb-10">
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-1 ring-white/25 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-base sm:text-lg leading-none">E</span>
              </div>
              <p className="text-sm sm:text-base md:text-body-md text-white/50 max-w-xs">
                The operating system for modern residential communities. Empowering operations through intelligent, automated tools.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                  <Share2 className="w-4 h-4 text-white/70" />
                </a>
                <a className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                  <Globe className="w-4 h-4 text-white/70" />
                </a>
                <a className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                  <Link2 className="w-4 h-4 text-white/70" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white mb-4 sm:mb-6">Product</h4>
              <ul className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#features">Platform</a></li>
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#console">Interactive Console</a></li>
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#estates">Properties</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white mb-4 sm:mb-6">Company</h4>
              <ul className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#">About Us</a></li>
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#">Careers</a></li>
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#">Newsroom</a></li>
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white mb-4 sm:mb-6">Resources</h4>
              <ul className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#faq">FAQ</a></li>
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#">Documentation</a></li>
                <li><a className="text-sm sm:text-base md:text-body-md text-white/60 hover:text-white transition-colors" href="#">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-4 sm:pt-5 md:pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-[10px] sm:text-[11px] text-white/40">© 2026 EstateEase Inc. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6 md:gap-8">
              <a className="text-[10px] sm:text-[11px] text-white/40 hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="text-[10px] sm:text-[11px] text-white/40 hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="text-[10px] sm:text-[11px] text-white/40 hover:text-white transition-colors" href="#">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
