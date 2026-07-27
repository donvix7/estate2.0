'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Key,
  AlertTriangle,
  CreditCard,
  BarChart3,
  Megaphone,
  QrCode,
  FileText,
  CheckCircle,
  Smartphone,
  Lock,
  Shield,
  Clock,
  ArrowRight,
  MapPin,
  Check,
  Play,
  Menu,
  X,
  MoreHorizontal
} from 'lucide-react'
import FAQ from '@/components/faq'
import Link from 'next/link'
import { getCurrentSession } from '@/lib/service'

// Scroll Animation Hook
const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState(new Set())

  const loadData = async () => {
    const res = await getCurrentSession();
    if(res.success){
      console.log(res)
    }
  }
  
  useEffect(() => {
  loadData();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-animate-id')
          if (!id) return
          
          setVisibleElements(prev => {
            const newSet = new Set(prev)
            if (entry.isIntersecting) {
              newSet.add(id)
            } else {
              newSet.delete(id)
            }
            return newSet
          })
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    )

    const elements = document.querySelectorAll('[data-animate-id]')
    elements.forEach(el => observer.observe(el))

    return () => {
      elements.forEach(el => observer.unobserve(el))
    }
  }, [])

  return visibleElements
}

// Animated Section Component
const AnimatedSection = ({ children, id, className = '' }) => {
  const visibleElements = useScrollAnimation()
  const isVisible = visibleElements.has(id)

  return (
    <div
      data-animate-id={id}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
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
    items: [
      'Visitor pass via app',
      'Resident profile system',
      'Entry/exit logs',
      'Security guard verification',
      'Visitor QR code/PIN generation',
      'Manual blacklist system'
    ],
    demo: 'access',
    stats: { label: 'Access Efficiency', value: '95%', change: '+24%' }
  },
  {
    id: 'panic-emergency',
    title: 'Panic & Emergency',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Instant emergency alerts with multi-channel notification',
    items: [
      'Panic button in resident app',
      'Panic PIN system',
      'Instant alert to estate security',
      'Admin dashboard alerts',
      'Panic activity logging'
    ],
    demo: 'emergency',
    stats: { label: 'Response Time', value: '< 60s', change: '-65%' }
  },
  {
    id: 'payments',
    title: 'Basic Payments',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Simple and secure estate dues collection',
    items: [
      'Estate dues payment',
      'Transaction history',
      'Digital receipt',
      'Arrears notification'
    ],
    demo: 'payments',
    stats: { label: 'Collection Rate', value: '98%', change: '+18%' }
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Centralized management and monitoring platform',
    items: [
      'Resident management',
      'Visitor approval',
      'Panic alerts logs',
      'Payment overview'
    ],
    demo: 'admin',
    stats: { label: 'Operational Efficiency', value: '85%', change: '+32%' }
  },
  {
    id: 'communication',
    title: 'Basic Communication',
    icon: <Megaphone className="w-5 h-5" />,
    description: 'Essential announcements and notifications',
    items: [
      'Announcements',
      'Emergency notifications',
      'Admin broadcast messages'
    ],
    demo: 'communication',
    stats: { label: 'Engagement Rate', value: '92%', change: '+41%' }
  }
]

// Interactive Demo Components
const AccessControlDemo = () => (
  <div className="p-4 sm:p-6 bg-white-card border border-line rounded-xl shadow-sm">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-muted" />
          <h4 className="font-bold text-text text-sm">Visitor Pass</h4>
        </div>
        <div className="p-4 sm:p-6 border border-line text-center bg-soft-card rounded-lg">
          <div className="inline-block p-4 bg-white mb-4 rounded-lg shadow-inner">
            <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-text mx-auto" />
          </div>
          <p className="text-sm font-semibold text-text mb-1">Visitor Code: 7845</p>
          <p className="text-xs text-muted">Valid until: Today 11:59 PM</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted" />
          <h4 className="font-bold text-text text-sm">Entry/Exit Logs</h4>
        </div>
        <div className="space-y-3">
          {[
            { time: '10:30 AM', name: 'John Carter', type: 'Entry', status: 'Approved' },
            { time: '9:15 AM', name: 'Sarah Miller', type: 'Exit', status: 'Completed' },
            { time: '8:45 AM', name: 'Mike Wilson', type: 'Entry', status: 'Pending' }
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-line bg-soft-card rounded-lg">
              <div>
                <p className="text-xs font-semibold text-text">{log.name}</p>
                <p className="text-[10px] text-muted">{log.time} • {log.type}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                log.status === 'Approved' ? 'bg-black text-white' :
                log.status === 'Pending' ? 'bg-muted-light text-text' :
                'bg-line text-text'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const PanicEmergencyDemo = () => {
  const [panicActive, setPanicActive] = useState(false)
  
  return (
    <div className="p-4 sm:p-6 bg-white-card border border-line rounded-xl shadow-sm text-center">
      <div className="space-y-6">
        <div className="inline-block">
          <button 
            onClick={() => setPanicActive(!panicActive)}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full text-white text-sm sm:text-base font-bold flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
              panicActive ? 'bg-red-600 scale-95 animate-pulse' : 'bg-black hover:scale-105'
            }`}
          >
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 mb-2" />
            <span>{panicActive ? 'ALERT SENT' : 'PANIC'}</span>
            <span className="text-[10px] font-normal mt-1">{panicActive ? 'Tap to Cancel' : 'Tap to Trigger'}</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="p-4 border border-line bg-soft-card rounded-lg text-left">
            <p className="text-[11px] text-muted mb-2 font-bold uppercase tracking-wider">Alert Status</p>
            <div className="space-y-2">
              {[
                { name: 'Estate Security', status: panicActive },
                { name: 'Admin Dashboard', status: panicActive }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span>{item.name}</span>
                  {item.status ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-muted-light" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border border-line bg-soft-card rounded-lg text-left flex flex-col justify-center">
            <p className="text-[11px] text-muted mb-1 font-bold uppercase tracking-wider">Avg Response</p>
            <p className="text-2xl font-bold text-text leading-none">&lt; 60s</p>
            <p className="text-[10px] text-muted mt-1">Real-time GPS tracking</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const PaymentsDemo = () => (
  <div className="p-4 sm:p-6 bg-white-card border border-line rounded-xl shadow-sm space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-line gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black flex items-center justify-center rounded-lg">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-text text-sm">Paystack Checkout</h3>
          <p className="text-[11px] text-muted">Secured community billing</p>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <div className="text-[10px] text-muted font-bold uppercase">Txn ID</div>
        <div className="text-xs font-mono font-bold">PS-849201</div>
      </div>
    </div>
    <div className="p-4 border border-line bg-soft-card rounded-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <p className="text-[11px] text-muted mb-0.5">Amount Due</p>
          <p className="text-2xl font-bold text-text leading-none">$85.00</p>
          <p className="text-[10px] text-muted mt-1">June 2026 Estate Dues</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[11px] text-muted mb-0.5">Due Date</p>
          <p className="text-sm font-semibold text-text">15th June 2026</p>
          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-line text-text text-[9px] font-bold rounded">
            <Clock className="w-2.5 h-2.5" />
            Due in 5 days
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted">Collection Progress</span>
          <span className="font-bold text-text">85% collected</span>
        </div>
        <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
          <div className="h-full bg-black w-4/5 rounded-full"></div>
        </div>
      </div>
    </div>
    <button className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-text transition-all duration-300 flex items-center justify-center gap-2 text-xs">
      <Lock className="w-4 h-4" />
      <span>Pay $85.00 Securely</span>
    </button>
  </div>
)

const AdminDashboardDemo = () => (
  <div className="p-4 sm:p-6 bg-white-card border border-line rounded-xl shadow-sm space-y-4">
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="p-3 border border-line bg-soft-card rounded-lg">
        <p className="text-[10px] text-muted font-bold uppercase">Residents</p>
        <p className="text-lg sm:text-xl font-bold text-text">1,248</p>
      </div>
      <div className="p-3 border border-line bg-soft-card rounded-lg">
        <p className="text-[10px] text-muted font-bold uppercase">Visitors Today</p>
        <p className="text-lg sm:text-xl font-bold text-text">24</p>
      </div>
      <div className="p-3 border border-line bg-soft-card rounded-lg">
        <p className="text-[10px] text-muted font-bold uppercase">Pending Invites</p>
        <p className="text-lg sm:text-xl font-bold text-text">3</p>
      </div>
      <div className="p-3 border border-line bg-soft-card rounded-lg">
        <p className="text-[10px] text-muted font-bold uppercase">Collection</p>
        <p className="text-lg sm:text-xl font-bold text-text">98%</p>
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-xs font-bold text-text">Quick Console Actions</p>
      <div className="flex flex-wrap gap-2">
        {['Verify Visitor', 'Broadcast Alert', 'View Alerts', 'Report'].map((action, i) => (
          <button key={i} className="px-3 py-1.5 border border-line bg-soft-card text-text rounded hover:bg-line transition-colors text-[10px] font-semibold">
            {action}
          </button>
        ))}
      </div>
    </div>
  </div>
)

const CommunicationDemo = () => {
  const [message, setMessage] = useState('')
  const [broadcasts, setBroadcasts] = useState([
    { title: 'Water Supply Maintenance', time: '2 hours ago', type: 'Maintenance' },
    { title: 'Security Alert: Suspicious Activity', time: 'Yesterday', type: 'Security' }
  ])

  const handleBroadcast = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setBroadcasts([
      { title: message, time: 'Just now', type: 'General' },
      ...broadcasts
    ])
    setMessage('')
  }

  return (
    <div className="p-4 sm:p-6 bg-white-card border border-line rounded-xl shadow-sm space-y-4">
      <form onSubmit={handleBroadcast} className="space-y-3">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-muted" />
          <h4 className="font-bold text-text text-sm">Send Announcement</h4>
        </div>
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-20 p-3 rounded-lg focus:outline-none border border-line bg-soft-card text-xs"
          placeholder="Type announcement to broadcast..."
        />
        <button type="submit" className="w-full py-2 bg-black text-white font-semibold rounded-lg hover:bg-text transition-colors text-xs">
          Broadcast to All Residents
        </button>
      </form>
      <div className="space-y-2">
        <p className="text-xs font-bold text-text">Live Board</p>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {broadcasts.map((announcement, i) => (
            <div key={i} className="p-2 border border-line bg-soft-card rounded text-[11px] flex justify-between items-start">
              <div>
                <p className="font-semibold text-text">{announcement.title}</p>
                <p className="text-[9px] text-muted mt-0.5">{announcement.time}</p>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-line text-text text-[8px] font-bold">
                {announcement.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DemoComponent = ({ demoType }) => {
  switch(demoType) {
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
    icon: "dashboard"
  },
  {
    title: "Ironclad Security",
    description: "Prevent unauthorized entry with digital visitor passes, instant panic alerts, and real-time security logs.",
    icon: "shield"
  },
  {
    title: "Effortless Payments",
    description: "Achieve 98%+ collection rates with automated billing, seamless online payments, and instant digital receipts.",
    icon: "payments"
  },
  {
    title: "Delightful Living",
    description: "Give residents a VIP experience with instant amenity bookings, easy communication, and fast maintenance resolutions.",
    icon: "sentiment_satisfied"
  },
  {
    title: "Instant Communication",
    description: "Broadcast important announcements instantly to all residents. No more ignored mass emails or paper notices.",
    icon: "campaign"
  },
  {
    title: "Data-Driven Decisions",
    description: "Gain complete visibility into your estate's performance with real-time analytics and comprehensive reporting.",
    icon: "bar_chart"
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
    router.push('/auth/register')
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
        <div className="pointer-events-auto w-full max-w-[700px] flex items-center justify-between bg-black/95 backdrop-blur-xl rounded-full px-2 sm:px-3 py-2 shadow-xl border border-white/10 h-[48px] sm:h-[56px]">
          <div className="flex items-center gap-2 sm:gap-4 pl-1 sm:pl-2">
            <div className="w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full border border-page-bg/80 flex items-center justify-center shrink-0">
              <span className="text-page-bg font-bold text-xs sm:text-sm leading-none">E</span>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              <a className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-page-bg/80 hover:text-page-bg transition-colors duration-300" href="#features">Features</a>
              <a className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-page-bg/80 hover:text-page-bg transition-colors duration-300" href="#console">Console</a>
              <a className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-page-bg/80 hover:text-page-bg transition-colors duration-300" href="#estates">Estates</a>
              <a className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-page-bg/80 hover:text-page-bg transition-colors duration-300" href="#faq">FAQ</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-page-bg hover:text-white transition-colors p-1"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href='/auth/login'>
            <button 
              className="rounded-full bg-white text-black hover:bg-page-bg/85 transition-all duration-300 shrink-0 flex items-center px-3 sm:px-4 text-[9px] sm:text-[10px] h-7 sm:h-8 font-semibold uppercase tracking-wider"
            >
              Get Started
            </button>
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pointer-events-auto w-full max-w-[700px] mt-2 bg-black/95 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl">
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
        <section className="pt-[140px] sm:pt-[180px] md:pt-[200px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto flex flex-col items-center text-center relative overflow-visible bg-page-bg pb-[60px] sm:pb-[80px] md:pb-[120px]">
          <h1 className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[82px] leading-[1.05] tracking-[-0.03em] sm:tracking-[-0.04em] font-bold text-balance max-w-4xl mb-4 sm:mb-6 lg:mb-8 text-text">
            Bring every estate into focus
          </h1>
          <p className="text-base sm:text-lg md:text-body-lg text-muted max-w-2xl mb-6 sm:mb-8 lg:mb-10 px-2">
            Streamline property management, visitor control, and billing collections. Bring absolute clarity to your community's safety and operations.
          </p>
          <div className="w-full max-w-[1492px] bg-panel-bg overflow-hidden shadow-2xl relative z-10 rounded-2xl sm:rounded-3xl md:rounded-[40px] h-[300px] sm:h-[450px] md:h-[600px] border border-line/30">
            <Image 
              src="/estatelanding.jpg"
              alt="Luxury Estate"
              width={1492}
              height={600}
              unoptimized
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </section>

        {/* 3. Trust Strip */}
        <section className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-10 border-t border-line/30 max-w-[1728px] mx-auto flex flex-col items-center bg-page-bg relative z-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted mb-4 sm:mb-6 text-center">Powering operations in elite developments</p>
          <div className="flex justify-center items-center text-muted w-full overflow-hidden">
            <div className="flex gap-12 sm:gap-[60px] md:gap-[100px] items-center text-muted animate-marquee whitespace-nowrap">
              {[...trustCompanies, ...trustCompanies].map((company, i) => (
                <span key={i} className="text-lg sm:text-xl md:text-2xl lg:text-[24px] font-semibold tracking-tight hover:opacity-100 transition-all duration-300 cursor-default opacity-100">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Floating Visual Collage */}
        <section className="min-h-[900px] sm:min-h-[1100px] md:min-h-[1250px] w-full max-w-[1728px] mx-auto relative overflow-hidden bg-page-bg py-6 sm:py-8 md:py-10 border-t border-line/20">
          {/* Central Anchor */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none mt-10 sm:mt-16 md:mt-20">
            <h2 className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] font-bold text-text tracking-tighter leading-[0.9] text-center opacity-[0.9]">
              Smart<br/>Living
            </h2>
          </div>
          
          {/* Floating Cards - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:block">
            {/* 1. Top-left: Image with Glass UI Overlay */}
            <div className="absolute rounded-[32px] hover:scale-110 transition-all duration-300 overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/40 shadow-2xl" style={{ left: '8%', top: '8%', width: '300px', height: '240px', zIndex: 5 }}>
              <Image 
                src="/estatelanding 2.jpg" 
                alt="Security Console"
                width={300}
                height={240}
                unoptimized
                className="w-full h-full object-cover hover:scale-110 transition-all duration-300" 
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-4 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text">Access Scan</span>
                  <span className="text-[10px] font-semibold text-text">Verified</span>
                </div>
                <div className="w-full bg-black/10 rounded-full h-1.5">
                  <div className="bg-black w-[100%] h-1.5 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* 2. Top-right: Tall Card with Image */}
            <div className="absolute rounded-[32px] overflow-hidden hover:scale-110 transition-all duration-300 bg-white/10 backdrop-blur-2xl border border-white/40 shadow-2xl" style={{ right: '10%', top: '12%', width: '240px', height: '280px', zIndex: 5 }}>
              <Image 
                src="/estatelanding 3.jpg" 
                alt="Community Entrance"
                width={240}
                height={280}
                unoptimized
                className="w-full h-full object-cover " 
              />
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-text text-sm">auto_awesome</span>
              </div>
            </div>

            {/* 3. Mid-left: Floating Glass UI */}
            <div className="absolute rounded-[28px] overflow-hidden bg-white/20 backdrop-blur-3xl border border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col p-5" style={{ left: '4%', top: '42%', width: '220px', zIndex: 15 }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-text">Access Sync</span>
                <div className="w-10 h-6 bg-black rounded-full relative shadow-inner cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-sm">sync</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-text">Gate Server</span>
                  <span className="text-[12px] leading-[1.6] text-muted">Connected</span>
                </div>
              </div>
            </div>

            {/* 4. Mid-right: Image with Content Guidelines Label */}
            <div className="absolute rounded-[32px] hover:scale-110 transition-all duration-300 overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/40 shadow-2xl" style={{ right: '6%', top: '48%', width: '280px', height: '200px', zIndex: 5 }}>
              <Image 
                src="/estatelanding 4.jpg" 
                alt="Amenity Center"
                width={280}
                height={200}
                unoptimized
                className="w-full h-full object-cover hover:scale-110 transition-all duration-300" 
              />
              <div className="absolute top-4 left-4 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/50 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text">Gate Status: Live</span>
              </div>
            </div>

            {/* 5. Bottom-left: Large Image with Brand Voice */}
            <div className="absolute rounded-[32px] hover:scale-110 transition-all duration-300 overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/40 shadow-2xl" style={{ left: '12%', top: '68%', width: '320px', height: '220px', zIndex: 5 }}>
              <Image 
                src="/estatelanding.jpg" 
                alt="Community Life"
                width={320}
                height={220}
                unoptimized
                className="w-full h-full object-cover hover:scale-110 transition-all duration-300" 
              />
              <div className="absolute bottom-5 left-5 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/50 shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-text text-sm">record_voice_over</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text">Community Voice</span>
              </div>
            </div>

            {/* 6. Bottom-right: Wide Image */}
            <div className="absolute rounded-[32px] hover:scale-110 transition-all duration-300 overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/40 shadow-2xl" style={{ right: '12%', top: '72%', width: '300px', height: '200px', zIndex: 5 }}>
              <Image 
                src="/estatelanding 2.jpg" 
                alt="Smart Living"
                width={300}
                height={200}
                unoptimized
                className="w-full h-full object-cover hover:scale-110 transition-all duration-300 opacity-90" 
              />
            </div>

            {/* 7. Floating Comment / Profile */}
            <div className="absolute bg-white/30 hover:scale-110 transition-all duration-300 backdrop-blur-3xl rounded-[24px] flex items-center gap-4 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-white/50 z-20" style={{ left: '42%', top: '84%', width: 'max-content', zIndex: 20 }}>
              <div className="w-10 h-10 rounded-full bg-soft-card overflow-hidden shadow-sm border border-white/60">
                <Image 
                  src="/estatelanding 3.jpg" 
                  alt="Resident Representative"
                  width={40}
                  height={40}
                  unoptimized
                  className="w-full h-full object-cover hover:scale-110 transition-all duration-300" 
                />
              </div>
              <div className="flex flex-col pr-4">
                <span className="text-[11px] font-bold text-text">Alex Morgan</span>
                <span className="text-[13px] leading-[1.6] text-text/80">Secured our community overnight!</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Manifesto Section */}
        <section className="py-[60px] sm:py-[100px] md:py-[160px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto relative flex flex-col items-center text-center bg-page-bg">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] leading-[1.1] text-balance tracking-tight text-text relative z-10 max-w-[1000px] font-light">
            As smart residential communities expand across cities, the need for a unified operations hub has never been more critical. EstateEase connects your security, billing, and residents.
          </h2>
        </section>

        {/* 6. Community OS Section */}
        <section className="py-[60px] sm:py-[80px] md:py-[100px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-[100px] items-center">
            <div className="bg-gradient-to-br from-soft-card-2 to-soft-card rounded-2xl sm:rounded-3xl md:rounded-[40px] p-4 sm:p-6 md:p-8 h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center relative overflow-hidden ">
              <div className="w-full  bg-white-card rounded-xl sm:rounded-2xl shadow-xl border border-line/20 p-4 sm:p-5 md:p-6 ">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <span className="text-xs sm:text-sm font-bold text-text">Estate Files</span>
                  <span className="material-symbols-outlined text-muted text-lg sm:text-xl"><MoreHorizontal/></span>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-soft-card rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-black font-semibold text-lg sm:text-xl">folder</span>
                    <span className="text-sm sm:text-base font-medium text-text">Estate_Bylaws</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-soft-card rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-black font-semibold text-lg sm:text-xl">description</span>
                    <span className="text-sm sm:text-base font-medium text-text">Annual_Budget_2026</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-soft-card rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-black font-semibold text-lg sm:text-xl">image</span>
                    <span className="text-sm sm:text-base font-medium text-text">Zoning_Map_Layout</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-soft-card rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-black font-semibold text-lg sm:text-xl">analytics</span>
                    <span className="text-sm sm:text-base font-medium text-text">Dues_Collection_Q2</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center h-full w-full">
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
            </div>
          </div>
        </section>

        {/* 7. Estate Studio Section */}
        <section className="py-[60px] sm:py-[80px] md:py-[100px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-[100px] items-center">
            <div className="flex flex-col justify-center h-full w-full order-2 lg:order-1">
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
            </div>
            <div className="bg-gradient-to-tr from-[#E0EAFC] to-[#CFDEF3] rounded-2xl sm:rounded-3xl md:rounded-[40px] p-4 sm:p-6 md:p-8 h-[450px] sm:h-[500px] md:h-[600px] flex items-center justify-center relative overflow-hidden border border-line/30 shadow-inner order-1 lg:order-2">
              <div className="w-full  bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-white/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center shrink-0">
                    <span className="text-black font-bold text-[10px] leading-none">E</span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-muted">ESTATE STUDIO AI</span>
                </div>
                <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-sm">
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
                    <span className={`material-symbols-outlined text-white text-xs ${studioGenerating ? 'animate-spin' : 'animate-pulse'}`}>
                      {studioGenerating ? 'sync' : 'auto_awesome'}
                    </span>
                    <span>{studioGenerating ? 'Drafting...' : 'Draft Alert'}</span>
                  </button>
                </div>
                {studioResult && (
                  <div className="mt-4 p-4 bg-black text-white rounded-xl text-[10px] sm:text-xs font-mono whitespace-pre-wrap text-left shadow-lg border border-white/10 max-h-48 overflow-y-auto">
                    {studioResult}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Interactive Feature Console */}
        <section id="console" className="py-[60px] sm:py-[80px] md:py-[120px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/20">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text mb-3 sm:mb-4">Experience the Live Console</h2>
            <p className="text-sm sm:text-base md:text-body-lg text-muted leading-relaxed px-2">Toggle between features below to test-drive how safety, collections, and management run on EstateEase.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Feature Select Tabs (Left) */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4 flex flex-col justify-center">
              {MVP_FEATURES.map((feat) => {
                const isActive = activeFeature === feat.id
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveFeature(feat.id)}
                    className={`w-full text-left p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'bg-black text-white border-black shadow-lg scale-[1.02]' 
                        : 'bg-white-card text-text border-line/60 hover:bg-soft-card-2'
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
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] sm:text-[10px] text-white/50 font-bold uppercase">{feat.stats.label}</p>
                          <p className="text-base sm:text-lg font-bold">{feat.stats.value}</p>
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-[10px] text-white/50 font-bold uppercase">Impact</p>
                          <p className="text-base sm:text-lg font-bold text-green-400">{feat.stats.change}</p>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Live Interactive Preview Screen (Right) */}
            <div className="lg:col-span-7 bg-[#F4F3EF] rounded-2xl sm:rounded-3xl md:rounded-[32px] p-4 sm:p-6 md:p-8 border border-line/30 flex flex-col justify-center shadow-inner relative overflow-hidden">
              <div className="absolute top-3 sm:top-4 left-4 sm:left-6 flex gap-1.5 z-20">
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="hidden sm:block absolute top-3 sm:top-4 right-4 sm:right-6 text-[9px] sm:text-[10px] font-mono text-muted select-none">
                device::sandbox-console
              </div>
              <div className="mt-2 sm:mt-4 w-full">
                <DemoComponent demoType={MVP_FEATURES.find(f => f.id === activeFeature)?.demo} />
              </div>
            </div>
          </div>
        </section>

        {/* 9. Features Grid */}
        <section id="features" className="py-[60px] sm:py-[80px] md:py-28 px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/30">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text mb-3 sm:mb-4">Robust Modules for Elite Operations</h3>
            <p className="text-sm sm:text-base md:text-body-lg text-muted leading-relaxed px-2">Everything needed to run community operations with state-of-the-art precision.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, i) => (
              <AnimatedSection key={i} id={`feature-${i}`} className="p-5 sm:p-6 md:p-8 border border-line bg-white-card hover:shadow-xl transition-all group rounded-xl">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border border-line bg-soft-card flex items-center justify-center text-text mb-4 sm:mb-6 group-hover:bg-black group-hover:text-white transition-colors rounded-lg">
                  <span className="material-symbols-outlined text-lg sm:text-xl">{feature.icon}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text">{feature.title}</h4>
                <p className="text-sm sm:text-base md:text-body-md text-muted leading-relaxed">{feature.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* 10. Featured Estates */}
        <section id="estates" className="py-[60px] sm:py-[80px] md:py-28 px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text">Premier Client Estates</h3>
            <button className="text-xs sm:text-sm font-bold border-b border-black text-text pb-1 hover:text-muted hover:border-muted transition-colors flex items-center gap-2">
              <span>View All Properties</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {estateImages.map((estate, i) => (
              <AnimatedSection key={i} id={`estate-${i}`} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden shadow-xl border border-line/20 rounded-xl sm:rounded-2xl group/img">
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
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* 11. Mobile App Promo */}
        <section className="py-[60px] sm:py-[80px] md:py-28 px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-page-bg border-t border-line/30 overflow-hidden">
          <div className="bg-soft-card p-5 sm:p-8 lg:p-20 relative overflow-hidden border border-line rounded-2xl sm:rounded-3xl md:rounded-[32px] shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <AnimatedSection id="app-content" className="space-y-6 sm:space-y-8 md:space-y-10">
                <div>
                  <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-muted mb-3 sm:mb-4">Mobile Experience</h2>
                  <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text">Estate Management in Your Pocket</h3>
                  <p className="text-sm sm:text-base md:text-body-lg text-muted leading-relaxed mt-3 sm:mt-4">Download the resident app to request visitor entry codes, receive push panic notifications, check payment logs, or file facilities maintenance reports.</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {['Generate instant visitor QR codes', 'Receive real-time security alerts', 'Pay estate dues in one-tap', 'Book amenities & track maintenance'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4 group">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black flex items-center justify-center text-white rounded-full">
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
              <AnimatedSection id="app-image">
                <div className="relative flex justify-center">
                  <div className="relative z-10 w-[200px] sm:w-[240px] md:w-[280px] aspect-[9/19] bg-black p-2 sm:p-3 shadow-2xl rotate-3 transition-transform duration-500 ease-out hover:translate-y-[-20px] rounded-[28px] sm:rounded-[32px] md:rounded-[36px] border border-white/10">
                    <div className="w-full h-full bg-slate-800 overflow-hidden relative rounded-[20px] sm:rounded-[24px] md:rounded-[28px]">
                      <Image 
                        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000" 
                        alt="Mobile App Interface" 
                        width={280} 
                        height={600} 
                        unoptimized 
                        className="w-full h-full object-cover opacity-80" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 12. FAQ Section */}
        <section id="faq" className="py-[60px] sm:py-[80px] md:py-28 px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto bg-page-bg border-t border-line/30">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-muted mb-3 sm:mb-4">Support Hub</h2>
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-text">Frequently Asked Questions</h3>
          </div>
          <AnimatedSection id="faq-content">
            <FAQ />
          </AnimatedSection>
        </section>

        {/* 13. CTA Section */}
        <section className="py-[60px] sm:py-[80px] md:py-[100px] px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto">
          <div className="bg-black py-12 sm:py-16 md:py-20 px-6 sm:px-8 text-center relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[40px] border border-white/10">
            <div className="relative space-y-6 sm:space-y-8 flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/25 flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl leading-none">E</span>
              </div>
              <span className="text-[28px] sm:text-[40px] md:text-[60px] font-bold text-white tracking-tighter leading-[1.05] max-w-4xl text-balance">
                Experience the future of community operations
              </span>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button onClick={handleGetStarted} className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white text-black text-xs sm:text-sm font-bold rounded-full hover:bg-page-bg transition-all shadow-xl hover:-translate-y-1 active:scale-95 uppercase tracking-wider">
                  Get Started
                </button>
                <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-transparent border border-white/30 text-white text-xs sm:text-sm font-bold rounded-full hover:bg-white/10 transition-all active:scale-95 uppercase tracking-wider">
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
            {/* Brand Column */}
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/25 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-base sm:text-lg leading-none">E</span>
              </div>
              <p className="text-sm sm:text-base md:text-body-md text-white/50 max-w-xs">
                The operating system for modern residential communities. Empowering operations through intelligent, automated tools.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                  <span className="material-symbols-outlined text-base sm:text-[20px] text-white/70">share</span>
                </a>
                <a className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                  <span className="material-symbols-outlined text-base sm:text-[20px] text-white/70">public</span>
                </a>
                <a className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                  <span className="material-symbols-outlined text-base sm:text-[20px] text-white/70">hub</span>
                </a>
              </div>
            </div>
            {/* Navigation Columns */}
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

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 50px)); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .text-balance {
          text-wrap: balance;
        }
        /* Mobile touch improvements */
        @media (max-width: 640px) {
          button, a {
            -webkit-tap-highlight-color: transparent;
          }
        }
      `}</style>
    </div>
  )
}