'use client'

import { useState, useEffect, useRef, useCallback} from 'react'
import { useRouter} from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import { 
  BadgeCheck,
  MapPin,
  Check,
  Siren,
  ShieldCheck,
  Smile,
  Gauge,
  Smartphone as Phone,
  LogIn,
  LogOut,
  AlertCircle,
  Receipt,
  BellRing,
  Megaphone,
  Key,
  EyeIcon,
  StepForward,
  Star,
  Search,
  LayoutDashboard,
  Calendar,
  Settings,
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
  FileText
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
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1200&h=800',
    gradient: 'from-slate-700 to-slate-900',
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
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=1200&h=800',
    gradient: 'from-red-700 to-red-900',
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
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200&h=800',
    gradient: 'from-emerald-700 to-emerald-900',
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
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=800',
    gradient: 'from-blue-700 to-blue-900',
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
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=1200&h=800',
    gradient: 'from-purple-700 to-purple-900',
    stats: { label: 'Engagement Rate', value: '92%', change: '+41%' }
  }
]

const INTEGRATION_STEPS = [
  {
    step:'01',
    title:'Setup & Configuration',
    description:'Quick setup with minimal configuration',
    icon: <CheckCircle className="w-6 h-6" />,
    details: ['Account Creation','Basic Settings','Team Invites','System Test'],
    color:'gray',
    duration:'2-4 Hours'
  },
  {
    step:'02',
    title:'Resident Onboarding',
    description:'Easy resident registration and app installation',
    icon: <UserPlus className="w-6 h-6" />,
    details: ['Bulk Registration','App Installation','Basic Training','Support Setup'],
    color:'gray',
    duration:'1-2 Days'
  },
  {
    step:'03',
    title:'Go Live',
    description:'Start using all MVP features immediately',
    icon: <Zap className="w-6 h-6" />,
    details: ['Access Control','Payment Setup','Emergency System','Full Monitoring'],
    color:'gray',
    duration:'Immediate'
  }
]

// Simplified animations
const fadeInUp = {
  initial: { opacity: 0, y: 20},
  animate: { opacity: 1, y: 0},
  transition: { duration: 0.6}
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// MVP Feature Card Component
const MVPFeatureCard = ({ feature, isActive, onClick, index}) => (
  <div
    className={`relative p-5 transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl ${
      isActive
        ? ' bg-white shadow-xl shadow-emerald-900/5'
        : 'bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/60 hover:shadow-lg'
    }`}
    onClick={onClick}
  >
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className={`p-4 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-md'
            : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
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
  </div>
)

// MVP Demo Components
const AccessControlDemo = () => (
  <div
    className="relative p-6 bg-white h-full"
  >
    <div className="grid md:grid-cols-2 gap-6 h-full">
      {/* Visitor Pass */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-gray-600" />
          <h4 className="font-bold text-gray-900">Visitor Pass</h4>
        </div>
        <div className=" p-6 rounded-lg text-center">
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
            { time:'10:30 AM', name:'John Carter', type:'Entry', status:'Approved'},
            { time:'9:15 AM', name:'Sarah Miller', type:'Exit', status:'Completed'},
            { time:'8:45 AM', name:'Mike Wilson', type:'Entry', status:'Pending'}
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3">
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
  </div>
)

const PanicEmergencyDemo = () => (
  <div
    className="relative p-6 bg-white rounded-xl h-full shadow-sm"
  >
    <div className="text-center space-y-6">
      {/* Panic Button */}
      <div className="inline-block">
        <button className="w-48 h-48 bg-linear-to-br from-red-600 to-red-700 text-white text-xl font-bold rounded-full flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 shadow-lg">
          <AlertTriangle className="w-16 h-16 mb-4" />
          <span>PANIC</span>
          <span className="text-sm font-normal mt-2">Press & Hold</span>
        </button>
      </div>

      {/* Alert Status */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="p-4 rounded-lg bg-gray-50/50">
          <p className="text-sm text-gray-600 mb-2">Alert Sent To</p>
          <div className="space-y-2">
            {['Estate Security','Admin Dashboard'].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-gray-50/50">
          <p className="text-sm text-gray-600 mb-2">Response Time</p>
          <p className="text-2xl font-bold text-gray-900">60s</p>
          <p className="text-xs text-gray-500 mt-1">Average</p>
        </div>
      </div>
    </div>
  </div>
)

const PaymentsDemo = () => (
  <div
    className="relative p-6 bg-white h-full"
  >
    <div className="space-y-6">
      {/* Paystack Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Paystack Payment</h3>
            <p className="text-sm text-gray-600">Secure payment powered by Paystack</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Transaction ID</div>
          <div className="text-sm font-mono font-semibold">PS-849201</div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="p-6 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Amount Due</p>
            <p className="text-3xl font-bold text-gray-900">$85.00</p>
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
            <div className="h-full bg-linear-to-r from-gray-500 to-gray-600 w-4/5"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>$100.00</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <p className="font-medium text-gray-900 mb-3">Select Payment Method</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="p-4 rounded-lg hover:bg-green-50 transition-colors text-center group">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-900">Card</span>
            <p className="text-xs text-gray-500 mt-1">Visa/Mastercard</p>
          </button>
          
          <button className="p-4 rounded-lg hover:bg-green-50 transition-colors text-center group">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-900">Bank Transfer</span>
            <p className="text-xs text-gray-500 mt-1">Nigerian Banks</p>
          </button>
          
          <button className="p-4 rounded-lg hover:bg-green-50 transition-colors text-center group">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-900">USSD</span>
            <p className="text-xs text-gray-500 mt-1">*723*911#</p>
          </button>
        </div>
      </div>

      {/* Paystack Pay Button */}
      <button className="w-full py-4 bg-linear-to-r from-[#00A859] to-[#00C853] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3">
        <Lock className="w-5 h-5" />
        <span>Pay $85.00 Securely with Paystack</span>
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
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
          { date:'Jun 15, 2024', amount:'$85.00', status:'Paid', method:'Card'},
          { date:'May 15, 2024', amount:'$85.00', status:'Paid', method:'Transfer'},
          { date:'Apr 15, 2024', amount:'$80.00', status:'Partial', method:'USSD'}
        ].map((txn, i) => (
          <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
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
  </div>
)

const AdminDashboardDemo = () => (
  <div
    className="relative p-6 bg-white h-full"
  >
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-gray-50/50">
          <p className="text-sm text-gray-600 mb-1">Active Residents</p>
          <p className="text-2xl font-bold">1,248</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50/50">
          <p className="text-sm text-gray-600 mb-1">Today&apos;s Visitors</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50/50">
          <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50/50">
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
  </div>
)

const CommunicationDemo = () => (
  <div
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
          className="w-full h-32 p-3 focus:outline-none rounded-lg bg-gray-50/50"
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
          { title:'Water Supply Maintenance', time:'2 hours ago', type:'Maintenance'},
          { title:'Security Alert: Suspicious Activity', time:'Yesterday', type:'Security'},
          { title:'Community Meeting Reminder', time:'2 days ago', type:'General'}
        ].map((announcement, i) => (
          <div key={i} className="p-3 rounded-lg bg-gray-50/50">
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
  </div>
)

const DemoComponent = ({ demoType}) => {
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

const features = [
  {
    title: "10x Property Management",
    description: "Automate manual tasks and streamline operations. Reclaim hours of your week with our intuitive management dashboard.",
    icon: <Gauge className="size-6" />,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Ironclad Security",
    description: "Prevent unauthorized entry with digital visitor passes, instant panic alerts, and real-time security logs.",
    icon: <ShieldCheck className="size-6" />,
    image: "https://images.unsplash.com/photo-1557989938-349f481cfaa2?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Effortless Payments",
    description: "Achieve 98%+ collection rates with automated billing, seamless online payments, and instant digital receipts.",
    icon: <CreditCard className="size-6" />,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Delightful Living",
    description: "Give residents a VIP experience with instant amenity bookings, easy communication, and fast maintenance resolutions.",
    icon: <Smile className="size-6" />,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Instant Communication",
    description: "Broadcast important announcements instantly to all residents. No more ignored mass emails or paper notices.",
    icon: <Megaphone className="size-6" />,
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Data-Driven Decisions",
    description: "Gain complete visibility into your estate's performance with real-time analytics and comprehensive reporting.",
    icon: <BarChart3 className="size-6" />,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
]

const testimonies = [
  {
    name: "Sarah Jenkins",
    role: "Estate Manager",
    review: "EstateEase has completely transformed how we handle resident requests. The ROI was immediate, and resident satisfaction is at an all-time high.",
    rating: 5,
    bio: ""
  },
  {
    name: "Mike Thompson",
    role: "Chief of Security",
    review: "The digital visitor pass system is flawless. We've eliminated unauthorized entries and the panic button feature helps our team respond to emergencies in under 60 seconds.",
    rating: 5,
    bio: ""
  },
  {
    name: "Dr. Alistair Chen",
    role: "Resident",
    review: "Paying my estate dues takes 30 seconds now. Booking the tennis court, approving my guests—everything is just so easy. It truly feels like a 5-star hotel experience.",
    rating: 5,
    bio: ""
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Finance",
    review: "Our revenue collection improved by 40% in the first quarter of using EstateEase. The automated invoicing and reconciliation tools are a lifesaver.",
    rating: 5,
    bio: ""
  },
]

const StatsBar = () => {
  const stats = [
    { value:'500+', label:'Communities', icon: <Building className="w-4 h-4" />},
    { value:'100K+', label:'Residents', icon: <Users className="w-4 h-4" />},
    { value:'99.8%', label:'Uptime', icon: <Shield className="w-4 h-4" />},
    { value:'4.8/5', label:'Rating', icon: <Award className="w-4 h-4" />},
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
  const router = useRouter()
  
  const handleGetStarted = () => {
    router.push('/register')
  }

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features')
    featuresSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111621] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#1241a1]/10 selection:text-[#1241a1]">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-[#1241a1]/20 blur-[100px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1241a1]/10 rounded-full text-[#1241a1] dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <BadgeCheck className="size-3.5" />
                  Next Generation Management
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.05]">
                  Experience <span className="text-[#1241a1]">Modern Living</span> in a Secure Community
                </h1>
                
                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  The world's most sophisticated all-in-one management suite designed exclusively for luxury residences and smart estates.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={handleGetStarted}
                    className="px-8 py-4 bg-[#1241a1] hover:bg-[#1241a1]/90 text-white rounded-xl text-lg font-bold transition-all shadow-xl shadow-[#1241a1]/25 hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                  >
                    Get Started Now
                    <ArrowRight className="size-5" />
                  </button>
                  <button 
                    onClick={handleLearnMore}
                    className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-lg font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95"
                  >
                    Learn More
                  </button>
                </div>

                <div className="flex items-center gap-4 pt-8">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    Trusted by <span className="font-bold text-slate-900 dark:text-white">10,000+ residents</span> and <span className="font-bold text-slate-900 dark:text-white">500+ estates</span>
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-[#1241a1]/10 rounded-[2.5rem] blur-2xl group-hover:bg-[#1241a1]/15 transition-colors" />
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop" 
                    alt="Luxury Estate" 
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm rounded-2xl shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg dark:text-white">Real-time Security Feed</span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Live Monitoring
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-200/20 dark:bg-slate-900/20 backdrop-blur-sm rounded-xl">
                        <QrCode className="size-5 text-[#1241a1]" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-blue-50 dark:text-white">QR Access Authorized</p>
                          <p className="text-[10px] text-blue-100">Visitor: John Doe • Unit 402 • 10:24 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-emerald-700/50 dark:bg-emerald-900/5 rounded-xl">
                        <BellRing className="size-5 text-emerald-500" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-emerald-50 dark:text-white">Patrol Check-in Successful</p>
                          <p className="text-[10px] text-emerald-100 dark:text-white">Zone B • Guard: Mike Ross • Just now</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-12 bg-white/50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by Modern Communities</p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-50 grayscale dark:invert transition-all">
              <span className="text-2xl font-black tracking-tighter italic">LAKEFRONT</span>
              <span className="text-2xl font-black tracking-tighter italic">SKYLINE</span>
              <span className="text-2xl font-black tracking-tighter italic">PARKVIEW</span>
              <span className="text-2xl font-black tracking-tighter italic">RIVERSIDE</span>
              <span className="text-2xl font-black tracking-tighter italic">OAKWOOD</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 lg:py-32 bg-white dark:bg-[#111621]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#1241a1] mb-4">Core Ecosystem</h2>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">Smart Solutions for Modern Estates</h3>
              <p className="text-lg text-slate-500 leading-relaxed">Everything you need to manage your community with precision and ease, all in one unified platform.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <ShieldCheck className="size-6" />, title: 'Seamless Access', desc: 'Secure QR-based visitor management system with instant resident notifications.' },
                { icon: <CreditCard className="size-6" />, title: 'Smart Billing', desc: 'Automated estate dues collection with real-time tracking and digital receipts.' },
                { icon: <Siren className="size-6" />, title: 'Panic Response', desc: 'One-tap emergency alerts that notify security and neighbors within seconds.' },
                { icon: <Users className="size-6" />, title: 'Community Portal', desc: 'A central hub for announcements, bookings, and interactive resident engagement.' }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 hover:shadow-2xl hover:shadow-[#1241a1]/5 hover:-translate-y-2 transition-all group">
                  <div className="size-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[#1241a1] shadow-lg mb-8 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-4 dark:text-white">{feature.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Estates */}
        <section className="py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#1241a1] mb-4">Portfolio</h2>
                <h3 className="text-4xl lg:text-5xl font-black tracking-tight mb-0">Discover Premier Living</h3>
              </div>
              <button className="flex items-center gap-2 font-bold text-[#1241a1] hover:gap-3 transition-all px-6 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                View All Estates
                <ArrowRight className="size-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'The Azure Residences', location: 'Lekki Phase 1', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000' },
                { name: 'Oakwood Heights', location: 'Victoria Island', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000' },
                { name: 'Skyloft Gardens', location: 'Ikoyi, Lagos', img: 'https://images.unsplash.com/photo-1600607687940-477a128f198e?q=80&w=1000' }
              ].map((estate, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl group/img">
                    <img src={estate.img} alt={estate.name} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
                    <div className="absolute top-6 right-6">
                      <div className="size-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                        <Heart className="size-6 shadow-sm" />
                      </div>
                    
                    </div>
                    <div className='absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out translate-y-4 group-hover:translate-y-0'>
                      <h4 className="text-2xl font-bold text-slate-200 mb-2">{estate.name}</h4>
                      <p className="text-slate-100 flex items-center gap-1.5 text-sm">
                        <MapPin className="size-4" />
                        {estate.location}
                      </p>  
                    </div>
                  </div>
                 
                </div>
              ))}
            </div>
          </div>
        </section>

       

        {/* Mobile App Promo */}
        <section className="py-24 lg:py-40 bg-white dark:bg-[#111621] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#1241a1]/5 dark:bg-slate-900/50 rounded-[3rem] p-8 lg:p-20 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-1/2 h-full bg-linear-to-tl from-[#1241a1]/10 to-transparent pointer-events-none" />
              
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#1241a1]">Mobile Experience</h2>
                    <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">Management at your Fingertips</h3>
                    <p className="text-lg text-slate-500 leading-relaxed">Download our mobile app to manage your home from anywhere in the world. Secure, fast, and remarkably easy to use.</p>
                  </div>

                  <div className="space-y-6">
                    {['Generate instant visitor QR codes', 'Receive real-time security alerts', 'Pay estate dues in one-tap', 'Book amenities & track maintenance'].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="size-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                          <Check className="size-3.5 stroke-[3]" />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:translate-x-1 transition-transform">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95">
                      <Smartphone className="size-8" />
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-bold opacity-60 leading-none mb-1">Download on the</p>
                        <p className="text-lg font-bold leading-none">App Store</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95">
                      <Play className="size-8" />
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-bold opacity-60 leading-none mb-1">Get it on</p>
                        <p className="text-lg font-bold leading-none">Google Play</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[120%] bg-[#1241a1]/20 blur-[120px] rounded-full pointer-events-none" />
                  <div className="relative flex justify-center perspective-[1000px]">
                    <div className="relative z-10 w-[280px] aspect-[9/19] bg-slate-900 rounded-[3rem] p-3 shadow-2xl skew-y-[-6deg] rotate-3 transition-transform duration-500 ease-out hover:translate-y-[-20px]">
                      <div className="w-full h-full bg-slate-800 rounded-[2.5rem] overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000" alt="Mobile App" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
                        {/* Mock App UI */}
                        <div className="absolute top-12 left-6 right-6 space-y-4">
                          <div className="size-12 bg-white/20 backdrop-blur-md rounded-xl" />
                          <div className="h-4 w-2/3 bg-white/20 backdrop-blur-md rounded-full" />
                          <div className="h-4 w-1/2 bg-white/20 backdrop-blur-md rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-10 right-0 z-20 w-[280px] aspect-[9/19] bg-slate-900 rounded-[3rem] p-3 shadow-2xl skew-y-6 rotate-[-3deg] hidden lg:block transition-transform duration-500 ease-out hover:translate-y-[-20px]">
                      <div className="w-full h-full bg-slate-800 rounded-[2.5rem] overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000" alt="Mobile App" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white dark:bg-[#111621]">
          <div className="max-w-4xl mx-auto px-6">
             <div className="text-center mb-16">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#1241a1] mb-4">Support</h2>
              <h3 className="text-4xl font-black tracking-tight mb-0">Frequently Asked Questions</h3>
            </div>
            <FAQ />
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto bg-[#1241a1] rounded-[3rem] py-20 px-8 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
             
             <div className="relative z-10 space-y-8">
               <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Ready to Transform your Estate?</h3>
               <p className="text-blue-100/70 text-lg max-w-2xl mx-auto leading-relaxed">Join the hundreds of forward-thinking estates who have already upgraded to the next generation of property management.</p>
               <div className="flex flex-wrap justify-center gap-4 pt-4">
                 <button onClick={handleGetStarted} className="px-10 py-5 bg-white text-[#1241a1] rounded-2xl text-lg font-bold hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                   Request a Free Demo
                 </button>
                 <button className="px-10 py-5 bg-[#1241a1] border border-white/30 text-white rounded-2xl text-lg font-bold hover:bg-white/10 transition-all active:scale-95">
                   Pricing Plans
                 </button>
               </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}