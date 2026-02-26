'use client'

import { useState, useEffect, useRef, useCallback} from 'react'
import { useRouter} from 'next/navigation'
import { motion, AnimatePresence} from 'framer-motion'
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
  StepForward,
  Star
} from 'lucide-react'
import FAQ from '@/components/faq'
import HeroWithCarousel from '@/components/Hero'

// Add Google Material Icons import
import '@material-symbols/font-400'

// MVP Features based on your requirements
const MVP_FEATURES = [
  {
    id:'access-control',
    title:'Access Control',
    icon: <Key className="w-6 h-6" />,
    description:'Secure visitor management with digital passes and verification',
    items: [
      'Visitor pass via app',
      'Resident profile system',
      'Entry/exit logs',
      'Security guard verification',
      'Visitor QR code/PIN generation',
      'Manual blacklist system'
    ],
    demo:'access',
    gradient:'from-gray-600 to-gray-800',
    stats: { label:'Access Efficiency', value:'95%', change:'+24%'}
  },
  {
    id:'panic-emergency',
    title:'Panic & Emergency',
    icon: <AlertTriangle className="w-6 h-6" />,
    description:'Instant emergency alerts with multi-channel notification',
    items: [
      'Panic button in resident app',
      'Panic PIN system',
      'Instant alert to estate security',
      'Admin dashboard alerts',
      'Panic activity logging'
    ],
    demo:'emergency',
    gradient:'from-gray-600 to-gray-800',
    stats: { label:'Response Time', value:'< 60s', change:'-65%'}
  },
  {
    id:'payments',
    title:'Basic Payments',
    icon: <CreditCard className="w-6 h-6" />,
    description:'Simple and secure estate dues collection',
    items: [
      'Estate dues payment',
      'Transaction history',
      'Digital receipt',
      'Arrears notification'
    ],
    demo:'payments',
    gradient:'from-gray-600 to-gray-800',
    stats: { label:'Collection Rate', value:'98%', change:'+18%'}
  },
  {
    id:'admin-dashboard',
    title:'Admin Dashboard',
    icon: <BarChart3 className="w-6 h-6" />,
    description:'Centralized management and monitoring platform',
    items: [
      'Resident management',
      'Visitor approval',
      'Panic alerts logs',
      'Payment overview'
    ],
    demo:'admin',
    gradient:'from-gray-600 to-gray-800',
    stats: { label:'Operational Efficiency', value:'85%', change:'+32%'}
  },
  {
    id:'communication',
    title:'Basic Communication',
    icon: <Megaphone className="w-6 h-6" />,
    description:'Essential announcements and notifications',
    items: [
      'Announcements',
      'Emergency notifications',
      'Admin broadcast messages'
    ],
    demo:'communication',
    gradient:'from-gray-600 to-gray-800',
    stats: { label:'Engagement Rate', value:'92%', change:'+41%'}
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
  <motion.div
    initial={{ opacity: 0, y: 15}}
    whileInView={{ opacity: 1, y: 0}}
    viewport={{ once: true}}
    transition={{ delay: index * 0.1, duration: 0.4}}
    whileHover={{ y: -3}}
    className={`relative p-5 border-2 transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl ${
      isActive
        ? ' border-emerald-500 bg-white shadow-xl shadow-emerald-900/5'
        : 'bg-slate-50/50 border-slate-200 hover:border-emerald-300 hover:bg-white hover:shadow-lg'
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
  </motion.div>
)

// MVP Demo Components
const AccessControlDemo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98}}
    animate={{ opacity: 1, scale: 1}}
    transition={{ duration: 0.4}}
    className="relative p-6 bg-white h-full"
  >
    <div className="grid md:grid-cols-2 gap-6 h-full">
      {/* Visitor Pass */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-gray-600" />
          <h4 className="font-bold text-gray-900">Visitor Pass</h4>
        </div>
        <div className=" border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
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
            <div key={i} className="flex items-center justify-between p-3 border-b border-gray-200">
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
    initial={{ opacity: 0, scale: 0.98}}
    animate={{ opacity: 1, scale: 1}}
    transition={{ duration: 0.4}}
    className="relative p-6 bg-white rounded-xl border-gray-100 h-full shadow-sm"
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
        <div className="p-4 border-gray-200 rounded-lg">
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
        
        <div className="p-4 border-gray-200 rounded-lg">
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
    initial={{ opacity: 0, scale: 0.98}}
    animate={{ opacity: 1, scale: 1}}
    transition={{ duration: 0.4}}
    className="relative p-6 bg-white h-full"
  >
    <div className="space-y-6">
      {/* Paystack Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
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
          <div className="text-sm font-mono font-semibold">PS-{Math.floor(100000 + Math.random() * 900000)}</div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="p-6 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg">
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
            <div className="h-full bg-linear-to-r from-gray-500 to-gray-600 w-4/5"></div>
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
      <button className="w-full py-4 bg-linear-to-r from-[#00A859] to-[#00C853] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3">
        <Lock className="w-5 h-5" />
        <span>Pay ₦85,000 Securely with Paystack</span>
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 border-gray-200 rounded-lg">
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
          { date:'Jun 15, 2024', amount:'₦85,000', status:'Paid', method:'Card'},
          { date:'May 15, 2024', amount:'₦85,000', status:'Paid', method:'Transfer'},
          { date:'Apr 15, 2024', amount:'₦80,000', status:'Partial', method:'USSD'}
        ].map((txn, i) => (
          <div key={i} className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors">
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
    initial={{ opacity: 0, scale: 0.98}}
    animate={{ opacity: 1, scale: 1}}
    transition={{ duration: 0.4}}
    className="relative p-6 bg-white h-full"
  >
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Active Residents</p>
          <p className="text-2xl font-bold">1,248</p>
        </div>
        <div className="p-4 border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Today's Visitors</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="p-4 border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="p-4 border-gray-200 rounded-lg">
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
    initial={{ opacity: 0, scale: 0.98}}
    animate={{ opacity: 1, scale: 1}}
    transition={{ duration: 0.4}}
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
          className="w-full h-32 p-3 border-gray-300 focus:border-gray-900 focus:outline-none rounded-lg"
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
          <div key={i} className="p-3 border-gray-200 rounded-lg">
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
    title:"Seamless Living",
    description:"Automated amenity bookings, valet requests, and guest permissions at your fingertips via our intuitive mobile app.",
    icon:"calendar_month",
    
    
  },
  {
    title:"Secure Management",
    description:"Enterprise-grade encryption for all documents, contracts, and resident data with granular access controls.",
    icon:"security",
    
  },
  {
    title:"Financial Clarity",
    description:"Transparent billing, automated collections, and real-time revenue dashboards for property managers.",
    icon:"receipt",
    
  },
  {
    title:"Community Engagement",
    description:"Integrated polls, event management, and feedback systems to foster a vibrant and connected community.",
    icon:"groups",
    
  },
  {
    title:"Maintenance Management",
    description:"Streamlined ticketing, vendor management, and automated escalation workflows for efficient facility upkeep.",
    icon:"build",
    
  },
  {
    title:"Visitor Management",
    description:"Secure, self-service visitor pre-authorization and digital check-in for seamless entry and enhanced security.",
    icon:"person_add",
    
  },
  {
    title:"Compliance & Reporting",
    description:"Automated audit trails, regulatory compliance tracking, and comprehensive reporting for governance and transparency.",
    icon:"description",
    
  },
]

const testimonies = [
  {
    name: "Daniel Nwachi",
    role: "CEO of EstateEase",
    review: "EstateEase has completely transformed how we handle resident requests. The ROI was immediate and resident satisfaction is at an all-time high. It&apos;s the gold standard for management.",
    rating: 5,
    bio: ""
  },
  {
    name: "Daniel Nwachi",
    role: "CEO of EstateEase",
    review: "EstateEase has completely transformed how we handle resident requests. The ROI was immediate and resident satisfaction is at an all-time high. It&apos;s the gold standard for management.",
    rating: 5,
    bio: ""
  },
  {
    name: "Daniel Nwachi",
    role: "CEO of EstateEase",
    review: "EstateEase has completely transformed how we handle resident requests. The ROI was immediate and resident satisfaction is at an all-time high. It&apos;s the gold standard for management.",
    rating: 5,
    bio: ""
  },
  {
    name: "Daniel Nwachi",
    role: "CEO of EstateEase",
    review: "EstateEase has completely transformed how we handle resident requests. The ROI was immediate and resident satisfaction is at an all-time high. It&apos;s the gold standard for management.",
    rating: 5,
    bio: ""
  },
  {
    name: "Daniel Nwachi",
    role: "CEO of EstateEase",
    review: "EstateEase has completely transformed how we handle resident requests. The ROI was immediate and resident satisfaction is at an all-time high. It&apos;s the gold standard for management.",
    rating: 5,
    bio: ""
  },
  {
    name: "Daniel Nwachi",
    role: "CEO of EstateEase",
    testimony: "EstateEase has completely transformed how we handle resident requests. The ROI was immediate and resident satisfaction is at an all-time high. It&apos;s the gold standard for management.",
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
    featuresRef.current?.scrollIntoView({ behavior:'smooth'})
  }
  const scrollToSetup = () => {
    setupRef.current?.scrollIntoView({ behavior:'smooth'})
  }
  const handleGetStarted = () => {
    router.push('/register')
  }

  const handleScheduleDemo = () => {
    router.push('/demo')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navigation/>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden hero-gradient py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-emerald-800 dark:text-primary px-4 py-1.5 rounded-full w-fit">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span className="text-xs font-bold uppercase tracking-widest">Next-Gen Management</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-slate-50">
                Elevate the Art of <span className="text-primary">Living.</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                The world&apos;s most sophisticated all-in-one management suite designed exclusively for luxury residences and elite property managers.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={handleGetStarted} className="bg-emerald-600 text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-1 transition-all flex items-center gap-2 group">
                  Get Started 
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button onClick={scrollToFeatures} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold px-10 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 hover:-translate-y-1 transition-all">
                  View Features
                </button>
              </div>
              <div className="flex items-center gap-6 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="flex -space-x-3">
                  <img 
                    alt="User headshot of a property manager" 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcuhqVqpTvvUWMCnx1y16VFrWTgxzTuXKLmFdffguKm9_q0Juz2og0eWY_jmFGZfp3GmdqyGv0s_mX0g9hn6AUQ51fd941MoNh7OP94ZHpX6LOSJy6NN8KTjs8VRwCFO5jcE0x_iL5_c0oSaU8gUclI4d3VoSaUEdD1UpenXo8hwlngoTsmm_wo1vguXQFRttUyGx-36QsyaL9QeCDkkfUdbVFR3G83CbQcB-iP-w-oXkpu5m_SF6MhrmxjIi69EvcoRIp3Ln9U4c"
                  />
                  <img 
                    alt="User headshot of a luxury resident" 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc3rI4uTDu4bTFFtcHNZP5cpJ81OgEmY9gdqUM-FXKuQ9XPTNrP4CnAWbuUZgp6Y2LdQYeVQecVpybBRnsbe0mQwlVF7JZiupnTkOPdDNVn1prz9ettLk55Z1Uzt7tQPRhp32iqz_MEiGe-RNSn_L9gqGPdi13YD1UDlaVDb51KRGIMGw2ks-sn3eqAZPbWoxzkkShe4V6J3Rav43-8DHBOVCW0-lZKH0IKGGbZf62wUW53Hdluxce1fjYimCltL5yFY6q6JVHWnM"
                  />
                  <img 
                    alt="User headshot of a concierge" 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1d4kWeaElGb6OA4dg0sm2uarhYOoKNH1lIEVnblyB2oGazPtnBl7vYDFMlYzgtug9rZbmGmfDV01b8JiRXIMNdodoN6h8AuUhHxEiNCVAXYzZCay7nLrJm3ScAgucddpqBxgolsAYf1cTQJWNmBpkPNIYDYvyo7fdrjifkpdVh5oDptEYL5tbj1nRp1SvK0rt5pyQaPLo3-yh5k_kuyw7czntyeEqtTm0rmmGCYPxLDeaSGofOMdwRpR3HKlmFYXamnlBH4QO1os"
                  />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Trusted by <span className="text-slate-900 dark:text-slate-100 font-bold">500+ Luxury Estates</span> globally
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-2xl"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img 
                  alt="Luxury modern villa exterior with swimming pool" 
                  className="w-full h-full object-cover aspect-[4/3]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOsxYoOvVJUHJHYJQReCVfr7pkXY65gpp37NxMDzgJ9A33xpBVnhBz0Gihs1Ijyd7TgAxpoUsSRih-bbHO6ROVvVFZMeT-lD-PdiII0gISgd7ZPpC3fqInC4GSK6_zdpjSHv-fBSSq_3ZPnwe9XdcX2b4FkaONZOOCj8TzY2oRxZgj2z4cDsbcYr0xzI9Jgq2tfait8U6CFUDRBIwdDlcRbrsq8wk77ekh67nBwN54lVwG5wkr0xO_0VZoRHpYjyhAU8kI-jGelWg"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/50 backdrop-blur-md p-6 rounded-xl ">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Morning Concierge Feed</span>
                    <span className="bg-primary/20 text-emerald-800 dark:text-primary px-3 py-1 rounded-full text-xs font-bold">Active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3  p-3 rounded-lg">
                      <span className="material-symbols-outlined text-primary">directions_car</span>
                      <span className="text-sm font-medium">Valet requested by Unit 402</span>
                    </div>
                    <div className="flex items-center gap-3  p-3 rounded-lg">
                      <span className="material-symbols-outlined text-primary">spa</span>
                      <span className="text-sm font-medium">Amenity Booking: Rooftop Spa - 2:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-24 lg:py-32 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Redefining Property Management</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Experience the pinnacle of efficiency with digital solutions tailored for high-end residential living.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group p-10 rounded-3xl bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 lg:py-32 bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Voices of Excellence</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">Hear from property managers who transformed their estates with EstateEase.</p>
              </div>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button className="w-12 h-12 rounded-full border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonies && testimonies.slice(0, 4).map((testimony, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex gap-1 text-emerald-500 mb-6">
                    <span className="material-symbols-outlined text-emerald-400 fill-emerald-400">star</span>
                    <span className="material-symbols-outlined text-emerald-400 fill-emerald-400">star</span>
                    <span className="material-symbols-outlined text-emerald-400 fill-emerald-400">star</span>
                    <span className="material-symbols-outlined text-emerald-400 fill-emerald-400">star</span>
                    <span className="material-symbols-outlined text-emerald-400 fill-emerald-400">star</span>
                  </div>
                  <p className="text-xl italic font-medium leading-relaxed mb-8 text-slate-700 dark:text-slate-300">
                    &quot;{testimony.review || testimony.testimony}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                      {testimony.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{testimony.name}</p>
                      <p className="text-sm text-slate-500">{testimony.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-emerald-50 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="relative bg-slate-900 text-white rounded-[3rem] overflow-hidden p-12 lg:p-24 text-center shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">Ready to Modernize Your Property?</h2>
                <p className="text-xl text-slate-300">Join the world&apos;s most elite property managers and give your residents the experience they deserve.</p>
                <div className="flex flex-wrap justify-center gap-6 pt-4">
                  <button onClick={handleGetStarted} className="bg-emerald-500 text-white text-lg font-bold px-10 py-4 rounded-2xl hover:bg-emerald-400 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 transition-all">
                    Get Started Now
                  </button>
                  <button onClick={handleScheduleDemo} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 text-lg font-bold hover:scale-105 px-10 py-4 rounded-2xl transition-all">
                    Schedule a Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer/>
     
    </div>
  )
}