'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import { 
  Shield, 
  QrCode, 
  Bell, 
  CreditCard, 
  Users, 
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Lock,
  AlertTriangle,
  Zap,
  BarChart3,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Building,
  Smartphone,
  Globe,
  Award,
  Heart,
  Target,
  ArrowUpRight,
  Play,
  Wifi,
  Signal,
  Battery,
  UserPlus,
  FileText,
  Smartphone as Phone,
  LogIn,
  LogOut,
  AlertCircle,
  Receipt,
  BellRing,
  Megaphone,
  Key,
  EyeIcon,
  StepForward
} from 'lucide-react'
import FAQ from '@/components/faq'
import HeroWithCarousel from '@/components/Hero'

// MVP Features based on your requirements
const MVP_FEATURES = [
  {
    id: 'access-control',
    title: 'Access Control',
    icon: <Key className="w-6 h-6" />,
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
    gradient: 'from-gray-600 to-gray-800',
    stats: { label: 'Access Efficiency', value: '95%', change: '+24%' }
  },
  {
    id: 'panic-emergency',
    title: 'Panic & Emergency',
    icon: <AlertTriangle className="w-6 h-6" />,
    description: 'Instant emergency alerts with multi-channel notification',
    items: [
      'Panic button in resident app',
      'Panic PIN system',
      'Instant alert to estate security',
      'Admin dashboard alerts',
      'Panic activity logging'
    ],
    demo: 'emergency',
    gradient: 'from-gray-600 to-gray-800',
    stats: { label: 'Response Time', value: '< 60s', change: '-65%' }
  },
  {
    id: 'payments',
    title: 'Basic Payments',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Simple and secure estate dues collection',
    items: [
      'Estate dues payment',
      'Transaction history',
      'Digital receipt',
      'Arrears notification'
    ],
    demo: 'payments',
    gradient: 'from-gray-600 to-gray-800',
    stats: { label: 'Collection Rate', value: '98%', change: '+18%' }
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Centralized management and monitoring platform',
    items: [
      'Resident management',
      'Visitor approval',
      'Panic alerts logs',
      'Payment overview'
    ],
    demo: 'admin',
    gradient: 'from-gray-600 to-gray-800',
    stats: { label: 'Operational Efficiency', value: '85%', change: '+32%' }
  },
  {
    id: 'communication',
    title: 'Basic Communication',
    icon: <Megaphone className="w-6 h-6" />,
    description: 'Essential announcements and notifications',
    items: [
      'Announcements',
      'Emergency notifications',
      'Admin broadcast messages'
    ],
    demo: 'communication',
    gradient: 'from-gray-600 to-gray-800',
    stats: { label: 'Engagement Rate', value: '92%', change: '+41%' }
  }
]

const INTEGRATION_STEPS = [
  {
    step: '01',
    title: 'Setup & Configuration',
    description: 'Quick setup with minimal configuration',
    icon: <CheckCircle className="w-6 h-6" />,
    details: ['Account Creation', 'Basic Settings', 'Team Invites', 'System Test'],
    color: 'gray',
    duration: '2-4 Hours'
  },
  {
    step: '02',
    title: 'Resident Onboarding',
    description: 'Easy resident registration and app installation',
    icon: <UserPlus className="w-6 h-6" />,
    details: ['Bulk Registration', 'App Installation', 'Basic Training', 'Support Setup'],
    color: 'gray',
    duration: '1-2 Days'
  },
  {
    step: '03',
    title: 'Go Live',
    description: 'Start using all MVP features immediately',
    icon: <Zap className="w-6 h-6" />,
    details: ['Access Control', 'Payment Setup', 'Emergency System', 'Full Monitoring'],
    color: 'gray',
    duration: 'Immediate'
  }
]

// Simplified animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// MVP Feature Card Component
const MVPFeatureCard = ({ feature, isActive, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    whileHover={{ y: -3 }}
    className={`relative p-4 border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
      isActive
        ? 'border-gray-800 bg-white shadow-lg'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
    }`}
    onClick={onClick}
  >
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br ' + feature.gradient + ' text-white'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {feature.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {feature.items.slice(0, 3).map((item, i) => (
              <span
                key={i}
                className={`px-2 py-1 text-xs font-medium ${
                  isActive ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-700'
                }`}
              >
                {item}
              </span>
            ))}
            {feature.items.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-500">
                +{feature.items.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)

// MVP Demo Components
const AccessControlDemo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="relative p-6 bg-white h-full"
  >
    <div className="grid md:grid-cols-2 gap-6 h-full">
      {/* Visitor Pass */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-gray-600" />
          <h4 className="font-bold text-gray-900">Visitor Pass</h4>
        </div>
        <div className="border-2 border-dashed border-gray-300 p-6 text-center">
          <div className="inline-block p-4 bg-gray-100 mb-4">
            <QrCode className="w-24 h-24 text-gray-700" />
          </div>
          <p className="text-sm text-gray-600 mb-2">Visitor Code: 7845</p>
          <p className="text-xs text-gray-500">Valid until: Today 11:59 PM</p>
        </div>
      </div>

      {/* Access Logs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h4 className="font-bold text-gray-900">Entry/Exit Logs</h4>
        </div>
        <div className="space-y-3">
          {[
            { time: '10:30 AM', name: 'John Carter', type: 'Entry', status: 'Approved' },
            { time: '9:15 AM', name: 'Sarah Miller', type: 'Exit', status: 'Completed' },
            { time: '8:45 AM', name: 'Mike Wilson', type: 'Entry', status: 'Pending' }
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">{log.name}</p>
                <p className="text-xs text-gray-500">{log.time} • {log.type}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium ${
                log.status === 'Approved' ? 'bg-green-100 text-green-800' :
                log.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
)

const PanicEmergencyDemo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="relative  p-6 bg-white h-full"
  >
    <div className="text-center space-y-6">
      {/* Panic Button */}
      <div className="inline-block">
        <button className="w-48 h-48 bg-gradient-to-br from-red-600 to-red-700 text-white text-xl font-bold rounded-full flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 shadow-lg">
          <AlertTriangle className="w-16 h-16 mb-4" />
          <span>PANIC</span>
          <span className="text-sm font-normal mt-2">Press & Hold</span>
        </button>
      </div>

      {/* Alert Status */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Alert Sent To</p>
          <div className="space-y-2">
            {['Estate Security', 'Admin Dashboard'].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Response Time</p>
          <p className="text-2xl font-bold text-gray-900">60s</p>
          <p className="text-xs text-gray-500 mt-1">Average</p>
        </div>
      </div>
    </div>
  </motion.div>
)

const PaymentsDemo = () => (
  <motion.div
  initial={{ opacity: 0, scale: 0.98 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4 }}
  className="relative p-6 bg-white h-full"
>
  <div className="space-y-6">
    {/* Paystack Header */}
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Paystack Payment</h3>
          <p className="text-sm text-gray-600">Secure payment powered by Paystack</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500">Transaction ID</div>
        <div className="text-sm font-mono font-semibold">PS-{Math.floor(100000 + Math.random() * 900000)}</div>
      </div>
    </div>

    {/* Payment Summary */}
    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Total Amount Due</p>
          <p className="text-3xl font-bold text-gray-900">₦85,000</p>
          <p className="text-sm text-gray-500 mt-1">Monthly Estate Dues</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Due Date</p>
          <p className="text-xl font-semibold text-gray-900">15th June 2024</p>
          <div className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Due in 5 days
          </div>
        </div>
      </div>
      
      {/* Payment Progress */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Community Payment Progress</span>
          <span className="font-semibold">85% collected</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gray-500 to-gray-600 w-4/5"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>₦0</span>
          <span>₦100,000</span>
        </div>
      </div>
    </div>

    {/* Payment Methods */}
    <div>
      <p className="font-medium text-gray-900 mb-3">Select Payment Method</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center group">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-900">Card</span>
          <p className="text-xs text-gray-500 mt-1">Visa/Mastercard</p>
        </button>
        
        <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center group">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Smartphone className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-900">Bank Transfer</span>
          <p className="text-xs text-gray-500 mt-1">Nigerian Banks</p>
        </button>
        
        <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center group">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-900">USSD</span>
          <p className="text-xs text-gray-500 mt-1">*723*911#</p>
        </button>
      </div>
    </div>

    {/* Paystack Pay Button */}
    <button className="w-full py-4 bg-gradient-to-r from-[#00A859] to-[#00C853] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3">
      <Lock className="w-5 h-5" />
      <span>Pay ₦85,000 Securely with Paystack</span>
    </button>

    {/* Security Badge */}
    <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <Shield className="w-4 h-4 text-green-600" />
      <span className="text-sm text-gray-600">Secured by Paystack • PCI DSS compliant</span>
    </div>

    {/* Recent Transactions */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-medium text-gray-900">Recent Transactions</p>
        <button className="text-sm text-green-600 font-medium hover:text-green-700">
          View All
        </button>
      </div>
      {[
        { date: 'Jun 15, 2024', amount: '₦85,000', status: 'Paid', method: 'Card' },
        { date: 'May 15, 2024', amount: '₦85,000', status: 'Paid', method: 'Transfer' },
        { date: 'Apr 15, 2024', amount: '₦80,000', status: 'Partial', method: 'USSD' }
      ].map((txn, i) => (
        <div key={i} className="flex items-center justify-between p-3 border border-gray-200 hover:border-gray-300 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{txn.date}</p>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                txn.status === 'Paid' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {txn.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">via {txn.method}</p>
          </div>
          <span className="font-bold text-gray-900">{txn.amount}</span>
        </div>
      ))}
    </div>
  </div>
</motion.div>
)

const AdminDashboardDemo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="relative p-6 bg-white h-full"
  >
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Active Residents</p>
          <p className="text-2xl font-bold">1,248</p>
        </div>
        <div className="p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Today's Visitors</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Collection Rate</p>
          <p className="text-2xl font-bold">98%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <p className="font-medium text-gray-900">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            Approve Visitors
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            Send Announcement
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            View Alerts
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            Payment Report
          </button>
        </div>
      </div>
    </div>
  </motion.div>
)

const CommunicationDemo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="relative p-6 bg-white h-full"
  >
    <div className="space-y-6">
      {/* Compose Message */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-orange-600" />
          <h4 className="font-bold text-gray-900">Send Announcement</h4>
        </div>
        <textarea 
          className="w-full h-32 p-3 border border-gray-300 focus:border-gray-900 focus:outline-none"
          placeholder="Type your announcement here..."
        />
        <button className="w-full py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors">
          Broadcast to All Residents
        </button>
      </div>

      {/* Recent Announcements */}
      <div className="space-y-3">
        <p className="font-medium text-gray-900">Recent Announcements</p>
        {[
          { title: 'Water Supply Maintenance', time: '2 hours ago', type: 'Maintenance' },
          { title: 'Security Alert: Suspicious Activity', time: 'Yesterday', type: 'Security' },
          { title: 'Community Meeting Reminder', time: '2 days ago', type: 'General' }
        ].map((announcement, i) => (
          <div key={i} className="p-3 border border-gray-200">
            <div className="flex justify-between items-start mb-1">
              <p className="font-medium">{announcement.title}</p>
              <span className={`px-2 py-1 text-xs ${
                announcement.type === 'Security' ? 'bg-gray-100 text-gray-800' :
                announcement.type === 'Maintenance' ? 'bg-gray-100 text-gray-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {announcement.type}
              </span>
            </div>
            <p className="text-sm text-gray-500">{announcement.time}</p>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
)

const DemoComponent = ({ demoType }) => {
  switch(demoType) {
    case 'access':
      return <AccessControlDemo />
    case 'emergency':
      return <PanicEmergencyDemo />
    case 'payments':
      return <PaymentsDemo />
    case 'admin':
      return <AdminDashboardDemo />
    case 'communication':
      return <CommunicationDemo />
    default:
      return <AccessControlDemo />
  }
}

const StatsBar = () => {
  const stats = [
    { value: '500+', label: 'Communities', icon: <Building className="w-4 h-4" /> },
    { value: '100K+', label: 'Residents', icon: <Users className="w-4 h-4" /> },
    { value: '99.8%', label: 'Uptime', icon: <Shield className="w-4 h-4" /> },
    { value: '4.8/5', label: 'Rating', icon: <Award className="w-4 h-4" /> },
  ]

  return (
    <div className="py-8 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-white/10">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  const router = useRouter()
  const featuresRef = useRef(null)
  const setupRef = useRef(null)

  const carouselIntervalRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (mounted) {
      carouselIntervalRef.current = setInterval(() => {
        setActiveFeature(prev => (prev + 1) % MVP_FEATURES.length)
      }, 10000)

      return () => {
        if (carouselIntervalRef.current) {
          clearInterval(carouselIntervalRef.current)
        }
      }
    }
  }, [mounted])

  const navigateFeature = (direction) => {
    if (direction === 'next') {
      setActiveFeature(prev => (prev + 1) % MVP_FEATURES.length)
    } else {
      setActiveFeature(prev => (prev - 1 + MVP_FEATURES.length) % MVP_FEATURES.length)
    }
  }

  const handleFeatureClick = (index) => {
    setActiveFeature(index)
  }

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
const scrollToSetup = () => {
    setupRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const handleGetStarted = () => {
    router.push('/register')
  }

  const handleScheduleDemo = () => {
    router.push('/demo')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navigation />
      <HeroWithCarousel/>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 min-h-screen flex flex-col justify-center">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">MVP NOW AVAILABLE</span>
            
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">

              <span className="block text-gray-900">Essential Security</span>

              <span className="block text-gray-900">For Your Community</span>

            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">

              Start with our core features: Access Control, Emergency Response, Payments, 
              Admin Dashboard, and Basic Communication. Everything you need to secure your community.

            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">

              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />

              </button>

              <button
                onClick={scrollToFeatures}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-900 hover:text-gray-900 transition-colors flex items-center gap-2"
              >

                <Play className="w-5 h-5" />
                View Features

              </button>
                


            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No setup fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsBar />

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="relative py-24 bg-white ">

        <div>

          <div className="text-center mb-16">

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 border border-blue-200 mb-6">

              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">CORE FEATURES MVP</span>

            </div>
            <h2 className="text-4xl font-bold mb-6">

              <span className="block text-gray-900">Everything You Need</span>
              <span className="block text-gray-900">To Get Started</span>

            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our MVP includes all essential features for modern community security management.
            </p>
          </div>
        </div>
       <div className='grid lg:grid-cols-2'>
         <div className="container mx-auto px-4">
          

          <div className="max-w-7xl mx-auto">
            {/* Feature Cards */}
            <div className="mb-12 grid grid-cols-1 gap-6">
              {MVP_FEATURES.map((feature, index) => (
                <div key={index} className="h-full">
                  <MVPFeatureCard
                    feature={feature}
                    isActive={activeFeature === index}
                    onClick={() => handleFeatureClick(index)}
                    index={index}


                  />
                </div>
              ))}
            </div>

          </div>
          
        </div>
              {/* Demo Container */}

        <div className="relative overflow-hidden">
          <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateFeature('prev')}
                    className="p-3 border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {MVP_FEATURES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleFeatureClick(index)}
                        className={`w-2 h-2 transition-all ${
                          activeFeature === index ? 'bg-gray-900 w-6' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => navigateFeature('next')}
                    className="p-3 border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
          <div className="text-center md:text-right">
                  <p className="text-sm text-gray-600 mb-1">Live Demo</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {MVP_FEATURES[activeFeature].title}
                  </h3>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-[500px]"
                  >
                    <DemoComponent demoType={MVP_FEATURES[activeFeature].demo} />
                  </motion.div>
                </AnimatePresence>
              </div>
       </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 bg-gray-50 bg-gray-100" id='setup' ref={setupRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 mb-6">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">SIMPLE SETUP</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="block text-gray-900">Get Started in</span>
              <span className="block text-gray-900">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {INTEGRATION_STEPS.map((step, index) => (
              <div key={index} className="relative">
                <div className="border p-6 bg-white h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="p-3 bg-gray-100 text-gray-700">
                        {step.icon}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm">
                      {step.duration}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  
                  <div className="space-y-3">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50">
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* CTA Section - Simplified */}
<section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
  <div className="container mx-auto px-4">
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 mb-8 rounded-full">
        <Shield className="w-5 h-5" />
        <span className="text-sm font-semibold">START SECURING TODAY</span>
      </div>
      
      <h2 className="text-5xl md:text-6xl font-bold mb-6">
        <span className="block">Ready to Get Started?</span>
        <span className="block text-gray-300 mt-4 text-4xl md:text-5xl">Try Our MVP Free for 30 Days</span>
      </h2>
      
      <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
        No credit card required. Get instant access to all core features with full support.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
        <button
          onClick={handleGetStarted}
          className="px-12 py-5 bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 hover:scale-105 shadow-lg"
        >
          Start Free Trial
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleScheduleDemo}
          className="px-12 py-5 border-2 border-white text-white font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105"
        >
          <span className="flex items-center gap-3">
            Schedule Demo
            <Play className="w-5 h-5" />
          </span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="p-4 border border-white/10 rounded-lg">
          <CheckCircle className="w-6 h-6 text-gray-500 mx-auto mb-2" />
          <p className="font-medium">No Credit Card</p>
          <p className="text-sm text-gray-400">Free trial with no payment required</p>
        </div>
        <div className="p-4 border border-white/10 rounded-lg">
          <Users className="w-6 h-6 text-gray-500 mx-auto mb-2" />
          <p className="font-medium">24/7 Support</p>
          <p className="text-sm text-gray-400">Dedicated support team always available</p>
        </div>
        <div className="p-4 border border-white/10 rounded-lg">
          <Zap className="w-6 h-6 text-gray-500 mx-auto mb-2" />
          <p className="font-medium">Instant Setup</p>
          <p className="text-sm text-gray-400">Get started in minutes, not days</p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <FAQ />
        </div>
      </section>

      <Footer />
    </div>
  )
}