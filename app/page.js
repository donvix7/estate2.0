'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
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
  Camera,
  MapPin,
  Database,
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
  Battery
} from 'lucide-react'
import FAQ from '@/components/faq'

// Enhanced Feature Data
const FEATURES = [
  {
    id: 'access-control',
    title: 'Intelligent Access Control',
    icon: <Lock className="w-6 h-6" />,
    description: 'Advanced visitor management with biometric verification and smart entry systems',
    items: ['Dynamic QR Code Passes', 'Facial Recognition', 'Automated Entry/Exit Logs', 'Real-time Blacklist Alerts', 'Biometric Verification'],
    demo: 'access',
    gradient: 'from-gray-700 to-gray-900',
    stats: { label: 'Access Efficiency', value: '95%', change: '+24%' }
  },
  {
    id: 'emergency',
    title: 'Emergency Response System',
    icon: <AlertTriangle className="w-6 h-6" />,
    description: 'Instant panic response with multi-channel emergency notification',
    items: ['One-tap SOS Button', 'GPS Location Sharing', 'Multi-admin Alert System', 'Emergency Broadcast', 'Incident Documentation'],
    demo: 'emergency',
    gradient: 'from-gray-700 to-gray-900',
    stats: { label: 'Response Time', value: '< 60s', change: '-65%' }
  },
  {
    id: 'payments',
    title: 'Secure Digital Payments',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Seamless financial transactions with automated compliance tracking',
    items: ['Automated Dues Collection', 'Encrypted Transactions', 'Digital Receipts', 'Arrears Management', 'Expense Analytics'],
    demo: 'payments',
    gradient: 'from-gray-700 to-gray-900',
    stats: { label: 'Collection Rate', value: '98%', change: '+18%' }
  },
  {
    id: 'dashboard',
    title: 'Centralized Admin Dashboard',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Comprehensive management platform with real-time monitoring',
    items: ['Resident Analytics', 'Visitor Approvals', 'Emergency Monitoring', 'Financial Overview', 'Compliance Reports'],
    demo: 'admin',
    gradient: 'from-gray-700 to-gray-900',
    stats: { label: 'Operational Efficiency', value: '85%', change: '+32%' }
  },
  {
    id: 'communication',
    title: 'Smart Communication Hub',
    icon: <MessageSquare className="w-6 h-6" />,
    description: 'Integrated messaging system for announcements and alerts',
    items: ['Targeted Announcements', 'Emergency Broadcasts', 'Real-time Notifications', 'Group Messaging', 'Chat History'],
    demo: 'communication',
    gradient: 'from-gray-700 to-gray-900',
    stats: { label: 'Engagement Rate', value: '92%', change: '+41%' }
  },
  {
    id: 'surveillance',
    title: 'Advanced Surveillance',
    icon: <Camera className="w-6 h-6" />,
    description: 'Integrated security monitoring with AI-powered threat detection',
    items: ['CCTV Integration', 'Motion Detection', 'License Plate Recognition', 'Suspicious Activity Alerts', 'Cloud Storage'],
    demo: 'surveillance',
    gradient: 'from-gray-700 to-gray-900',
    stats: { label: 'Threat Detection', value: '99.7%', change: '+56%' }
  }
]

const INTEGRATION_STEPS = [
  {
    step: '01',
    title: 'Setup & Integration',
    description: 'Quick installation with existing security infrastructure',
    icon: <Database className="w-6 h-6" />,
    details: ['24-hour Setup', 'API Integration', 'System Compatibility', 'Data Migration'],
    color: 'blue',
    duration: '2-4 Hours'
  },
  {
    step: '02',
    title: 'Onboard Community',
    description: 'Easy resident registration and system training',
    icon: <Users className="w-6 h-6" />,
    details: ['Bulk Registration', 'Training Sessions', 'Mobile App Setup', 'Support Portal'],
    color: 'green',
    duration: '1-2 Days'
  },
  {
    step: '03',
    title: 'Go Live & Monitor',
    description: '24/7 monitoring dashboard and support',
    icon: <Eye className="w-6 h-6" />,
    details: ['Real-time Dashboard', '24/7 Support', 'Performance Analytics', 'Regular Updates'],
    color: 'purple',
    duration: 'Ongoing'
  }
]

// Updated Animation variants - smoother transitions
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1]
  }
}

const fadeInScale = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { 
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1]
  }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const hoverLift = {
  y: -4,
  transition: { 
    duration: 0.3,
    ease: "easeOut"
  }
}

const slideIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { 
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1]
  }
}

// Memoized Components with smoother animations
const FeatureCard = memo(({ feature, isActive, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ 
      delay: index * 0.1, 
      duration: 0.5,
      ease: "easeOut"
    }}
    whileHover={hoverLift}
    className={`group relative p-4 border transition-all duration-300 cursor-pointer overflow-hidden ${
      isActive
        ? 'border-gray-300 bg-white shadow-lg scale-[1.02]'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
    }`}
    onClick={onClick}
  >
    {/* Animated background - smoother transition */}
    {isActive && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white/80"
      />
    )}
    
    <div className="relative z-10">
      <div className="flex items-start gap-4">
        <motion.div 
          whileHover={{ rotate: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`p-3 transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-br ' + feature.gradient + ' text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 group-hover:scale-105'
          }`}
        >
          {feature.icon}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
            {isActive && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold"
              >
                <TrendingUp className="w-3 h-3" />
                {feature.stats.change}
              </motion.div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{feature.description}</p>
          <div className="flex flex-wrap gap-2">
            {feature.items.slice(0, 2).map((item, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={`px-2 py-1 text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-50 text-gray-700 group-hover:bg-gray-100'
                }`}
              >
                {item}
              </motion.span>
            ))}
            {feature.items.length > 2 && (
              <span className="px-2 py-1 text-xs text-gray-500">
                +{feature.items.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
      
      {isActive && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{feature.stats.value}</div>
              <div className="text-xs text-gray-600">{feature.stats.label}</div>
            </div>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900">
              <span>Learn more</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  </motion.div>
))

FeatureCard.displayName = 'FeatureCard'

const IntegrationStep = memo(({ step, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connector lines */}
      {index < INTEGRATION_STEPS.length - 1 && (
        <div className="absolute top-12 left-full w-1/2 h-0.5 bg-gray-200 hidden md:block">
          <div className={`h-full bg-gradient-to-r from-gray-300 to-gray-100 transition-all duration-700 ${
            isHovered ? 'w-full' : 'w-0'
          }`}></div>
        </div>
      )}
      
      <div className="relative z-10">
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`border p-6 bg-white transition-all duration-300 h-full ${
            isHovered ? 'shadow-lg' : 'shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                {step.step}
              </div>
              <motion.div 
                whileHover={{ rotate: 3, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-gray-100 text-gray-700"
              >
                {step.icon}
              </motion.div>
            </div>
            <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium">
              {step.duration}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
          <p className="text-gray-600 mb-6">{step.description}</p>
          
          <div className="space-y-3">
            {step.details.map((detail, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 p-3 bg-gray-50 group/item"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <CheckCircle className="w-5 h-5 text-gray-400 group-hover/item:text-green-500 transition-colors duration-300" />
                </motion.div>
                <span className="text-sm text-gray-700">{detail}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
})

IntegrationStep.displayName = 'IntegrationStep'

// Enhanced Demo Components
const AccessDemo = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="relative border border-gray-200 p-6 bg-white h-full overflow-hidden group"
  >
    {/* Animated background with smoother transition */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50"
    />
    
    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 h-full">
      {/* Phone Mock - smoother animations */}
      <div className="relative">
        <div className="relative w-48 h-96">
          {/* Phone Frame */}
          <div className="absolute inset-0 border-8 border-gray-900/90 shadow-lg z-10 pointer-events-none"></div>
          
          {/* Phone Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 z-20"></div>
          
          {/* Status Bar */}
          <div className="absolute top-6 left-0 right-0 px-4 py-1 z-20">
            <div className="flex justify-between items-center text-xs text-white">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          {/* Screen Content */}
          <div className="absolute inset-4 bg-gradient-to-br from-blue-100/80 to-white p-4 pt-12">
            <div className="h-full flex flex-col items-center justify-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.03, 1],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 border-2 border-gray-300/50 flex items-center justify-center mb-4"
              >
                <QrCode className="w-20 h-20 text-gray-700" />
              </motion.div>
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium">SCAN TO ENTER</p>
                <p className="text-sm text-gray-900 mt-1">Valid for: Main Gate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content - smoother animations */}
      <div className="space-y-6 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">ACTIVE DIGITAL PASS</span>
          </div>
          <div className="space-y-2">
            <motion.p 
              animate={{ 
                opacity: [1, 0.8, 1],
                letterSpacing: ['0em', '0.05em', '0em']
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-2xl font-bold text-gray-900 font-mono"
            >
              ES-2024-8932
            </motion.p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Valid until: Today 11:59 PM</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 p-4 bg-white/80 shadow-sm">
            <p className="text-xs text-gray-600 mb-2">Entry Code</p>
            <motion.p 
              animate={{ 
                opacity: [1, 0.85, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-xl font-mono font-bold text-gray-900"
            >
              7845
            </motion.p>
          </div>
          <div className="border border-gray-200 p-4 bg-white/80 shadow-sm">
            <p className="text-xs text-gray-600 mb-2">Visitor Name</p>
            <p className="text-xl font-semibold text-gray-900">John Carter</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Access Logs</span>
            <span className="text-xs text-green-600 font-medium">+24 today</span>
          </div>
          <div className="h-2 bg-gray-200/50 overflow-hidden">
            <motion.div 
              animate={{ 
                width: ["75%", "85%", "75%"],
                background: [
                  "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                  "linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)",
                  "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)"
                ]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full"
            ></motion.div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
))

AccessDemo.displayName = 'AccessDemo'

const EmergencyDemo = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="relative border border-gray-200 p-6 bg-white h-full overflow-hidden group"
  >
    {/* Animated background with smoother transition */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50"
    />
    
    <div className="relative z-10 h-full flex flex-col justify-center">
      <div className="text-center space-y-8">
        {/* Emergency Button */}
        <div className="relative inline-block group/button">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 bg-red-500/20 blur-lg"
          ></motion.div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative w-64 h-64 bg-gradient-to-br from-red-600 to-orange-600 text-white text-xl font-bold transition-all duration-300 flex flex-col items-center justify-center border-8 border-white"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 border-4 border-red-400/20"
            ></motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <AlertTriangle className="w-20 h-20 mb-4" />
            </motion.div>
            <span className="text-2xl">EMERGENCY SOS</span>
            <div className="text-sm font-normal mt-3 opacity-90">Press & Hold 3 Seconds</div>
          </motion.button>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
          <div className="border border-gray-200 p-6 bg-white/80 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Alerts Sent</span>
            </div>
            <div className="space-y-3">
              {['Security', 'Admin', 'EMS'].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      className="w-2 h-2 bg-green-500"
                    ></motion.div>
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                  <span className="text-green-600 font-medium">✓ Connected</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="border border-gray-200 p-6 bg-white/80 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Location Tracking</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50/50">
                <p className="text-sm text-gray-700 mb-1">GPS coordinates shared</p>
                <p className="text-xs text-gray-500">Accuracy: 3 meters</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200/50 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-full"></div>
                </div>
                <span className="text-xs text-gray-600">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
))

EmergencyDemo.displayName = 'EmergencyDemo'

const PaymentsDemo = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="relative border border-gray-200 p-6 bg-white h-full overflow-hidden group"
  >
    {/* Animated background with smoother transition */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50"
    />
    
    <div className="relative z-10 space-y-6 h-full flex flex-col justify-center">
      {/* Payment Card */}
      <div className="border border-gray-200 p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-300">Monthly Dues</p>
            <p className="text-3xl font-bold mt-1">₹8,500</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Due Date</p>
            <p className="text-lg font-semibold">15th June</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Payment Progress</span>
            <span className="font-medium">85% collected</span>
          </div>
          <div className="w-full h-3 bg-gray-700 overflow-hidden">
            <motion.div 
              animate={{ width: ["80%", "85%", "80%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            ></motion.div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold transition-all duration-300 group/btn overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-emerald-600/0 group-hover/btn:from-green-600/100 group-hover/btn:to-emerald-600/100 transition-all duration-500"></div>
          <span className="relative z-10">Pay Now Securely</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
        >
          View History
        </motion.button>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        {[
          { type: 'Last Payment', date: 'June 15, 2024', amount: '₹8,500', icon: CreditCard, color: 'green' },
          { type: 'Next Payment', date: 'July 15, 2024', amount: '₹8,500', icon: Clock, color: 'blue' }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.3 }}
            whileHover={{ x: 3 }}
            className="flex items-center justify-between p-4 border border-gray-200 bg-white/80 hover:border-gray-300 transition-colors group/item"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <item.icon className={`w-5 h-5 text-gray-600 group-hover/item:text-${item.color}-500 transition-colors duration-300`} />
              </motion.div>
              <div>
                <p className="font-medium text-gray-900">{item.type}</p>
                <p className="text-sm text-gray-600">{item.date}</p>
              </div>
            </div>
            <span className="font-bold text-gray-900">{item.amount}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
))

PaymentsDemo.displayName = 'PaymentsDemo'

const DemoPlaceholder = memo(({ feature }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="relative border border-gray-200 p-6 bg-white h-full overflow-hidden group"
  >
    {/* Animated background with smoother transition */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50"
    />
    
    <div className="relative z-10 h-full flex flex-col items-center justify-center">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4 }}
        className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 mb-6"
      >
        <div className="text-3xl">
          {feature.icon}
        </div>
      </motion.div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {feature.description}
      </p>
      
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        Watch Demo Video
      </motion.button>
    </div>
  </motion.div>
))

DemoPlaceholder.displayName = 'DemoPlaceholder'

const DemoComponent = memo(({ demoType, feature }) => {
  switch(demoType) {
    case 'access':
      return <AccessDemo />
    case 'emergency':
      return <EmergencyDemo />
    case 'payments':
      return <PaymentsDemo />
    default:
      return <DemoPlaceholder feature={feature} />
  }
})

DemoComponent.displayName = 'DemoComponent'

const StatsBar = memo(() => {
  const stats = [
    { value: '2,500+', label: 'Communities Secured', icon: <Building className="w-4 h-4" /> },
    { value: '1M+', label: 'Residents Protected', icon: <Users className="w-4 h-4" /> },
    { value: '99.7%', label: 'Uptime SLA', icon: <Shield className="w-4 h-4" /> },
    { value: '4.9/5', label: 'Customer Rating', icon: <Award className="w-4 h-4" /> },
  ]

  return (
    <div className="py-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className="flex justify-center mb-3">
                <motion.div 
                  whileHover={{ rotate: 3, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 bg-white/10 group-hover:bg-white/20 transition-colors duration-300"
                >
                  {stat.icon}
                </motion.div>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
})

StatsBar.displayName = 'StatsBar'

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const router = useRouter()
  const featuresRef = useRef(null)
  const carouselRef = useRef(null)
  const carouselIntervalRef = useRef(null)
  const heroRef = useRef(null)

  // Mount effect
  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      setMounted(false)
    }
  }, [])

  // Feature carousel auto-rotation with cleanup - updated for smoother transitions
  useEffect(() => {
    if (mounted) {
      carouselIntervalRef.current = setInterval(() => {
        if (!isAnimating) {
          setIsAnimating(true)
          setActiveFeature(prev => (prev + 1) % FEATURES.length)
          setTimeout(() => setIsAnimating(false), 800) // Increased timeout for smoother transition
        }
      }, 8000) // Increased interval from 6000 to 8000ms

      return () => {
        if (carouselIntervalRef.current) {
          clearInterval(carouselIntervalRef.current)
        }
      }
    }
  }, [isAnimating, mounted])

  const navigateFeature = useCallback((direction) => {
    if (!isAnimating) {
      setIsAnimating(true)
      setActiveFeature(prev => {
        if (direction === 'next') {
          return (prev + 1) % FEATURES.length
        } else {
          return (prev - 1 + FEATURES.length) % FEATURES.length
        }
      })
      setTimeout(() => setIsAnimating(false), 600) // Increased timeout
    }
  }, [isAnimating])

  const nextFeature = useCallback(() => navigateFeature('next'), [navigateFeature])
  const prevFeature = useCallback(() => navigateFeature('prev'), [navigateFeature])

  const handleFeatureClick = useCallback((index) => {
    if (!isAnimating) {
      setIsAnimating(true)
      setActiveFeature(index)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }, [isAnimating])

  const scrollToFeatures = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleGetStarted = useCallback(() => {
    router.push('/register')
  }, [router])

  const handleScheduleDemo = useCallback(() => {
    router.push('/demo')
  }, [router])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white text-gray-900 overflow-hidden"
    >
      <Navigation />

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-40">
        <motion.div 
          className="h-full bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative pt-32 pb-20 px-4 min-h-screen flex flex-col justify-center overflow-hidden"
      >
        {/* Animated background elements - subtle gradient animation */}
        <motion.div 
          animate={{ 
            background: [
              'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)',
              'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #ffffff 100%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 border border-gray-300/50 mb-8 shadow-sm backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-gray-700" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700">ESTATE SECURITY PLATFORM</span>
            </motion.div>
            
            <motion.h1 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            >
              <motion.span variants={fadeInUp} className="block text-gray-900">
                Secure Your Community
              </motion.span>
              <motion.span variants={fadeInUp} className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mt-2">
                With Intelligence
              </motion.span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Estate Secure security platform transforming residential communities with 
              <span className="font-semibold text-gray-900"> real-time monitoring</span>, 
              <span className="font-semibold text-gray-900"> smart access control</span>, and 
              <span className="font-semibold text-gray-900"> instant emergency response</span>.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStarted}
                className="group relative px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/100 group-hover:to-cyan-600/100 transition-all duration-500"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Start 30-Day Free Trial
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToFeatures}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Explore Features
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>GDPR Compliant</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Bar */}
      <StatsBar />

      {/* Features Preview Section */}
      <motion.section 
        ref={featuresRef}
        id="features" 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 mb-6">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">COMPLETE SECURITY SUITE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="block text-gray-900">Everything You Need to</span>
              <span className="block text-gray-900">Secure Your Community</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
Generate secure guest invitation codes in seconds directly from your smartphone.            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            {/* Feature Cards Grid */}
            <motion.div 
              variants={staggerContainer}
              className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {FEATURES.map((feature, index) => (
                <div key={index} className="h-full">
                  <FeatureCard
                    feature={feature}
                    isActive={activeFeature === index}
                    onClick={() => handleFeatureClick(index)}
                    index={index}
                  />
                </div>
              ))}
            </motion.div>

            {/* Interactive Demo Carousel */}
            <div className="mb-12">
              {/* Carousel Controls */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevFeature}
                    className="p-3 border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    disabled={isAnimating}
                    aria-label="Previous feature"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                  </motion.button>
                  
                  <div className="flex items-center gap-2">
                    {FEATURES.map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleFeatureClick(index)}
                        className={`w-3 h-3 transition-all duration-300 ${
                          activeFeature === index 
                            ? 'bg-gray-900 w-8' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to feature ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextFeature}
                    className="p-3 border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    disabled={isAnimating}
                    aria-label="Next feature"
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </motion.button>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center md:text-right"
                >
                  <p className="text-sm text-gray-600 mb-1">Interactive Demo</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {FEATURES[activeFeature].title}
                  </h3>
                </motion.div>
              </div>

              {/* Demo Container */}
              <div 
                ref={carouselRef}
                className="relative overflow-hidden shadow-lg"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="h-[500px]"
                  >
                    <DemoComponent demoType={FEATURES[activeFeature].demo} feature={FEATURES[activeFeature]} />
                  </motion.div>
                </AnimatePresence>
                
                {/* Carousel Progress - smoother transition */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-1">
                      {FEATURES.map((_, index) => (
                        <motion.div
                          key={index}
                          animate={{ 
                            scale: activeFeature === index ? 1.2 : 1,
                            backgroundColor: activeFeature === index ? '#111827' : '#d1d5db'
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-1.5 h-1.5 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-2">
                      {activeFeature + 1} of {FEATURES.length}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Feature Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-6 px-6 py-4 bg-white border border-gray-200">
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">
                    {FEATURES[activeFeature].stats.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {FEATURES[activeFeature].stats.label}
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-left">
                  <div className="text-lg font-semibold text-green-600">
                    {FEATURES[activeFeature].stats.change}
                  </div>
                  <div className="text-sm text-gray-600">Improvement</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-24 bg-white overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 mb-6">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">SIMPLE INTEGRATION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="block text-gray-900">Get Started in</span>
              <span className="block text-gray-900">Three Simple Steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our seamless integration process ensures minimal disruption to your community operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {INTEGRATION_STEPS.map((step, index) => (
              <IntegrationStep key={index} step={step} index={index} />
            ))}
          </div>

          {/* Setup Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Average Setup Time</p>
                    <p className="text-2xl font-bold text-gray-900">7 Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Heart className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">99%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Shield className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Support SLA</p>
                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm font-semibold">ENTERPRISE-GRADE SECURITY</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              <span className="block">Ready to Transform</span>
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Community Security?
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands of modern communities using EstateSecure for unparalleled safety, 
              seamless management, and peace of mind.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStarted}
                className="group relative px-10 py-5 bg-white text-gray-900 font-semibold hover:shadow-lg transition-all duration-300 overflow-hidden min-w-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/100 group-hover:to-cyan-500/100 transition-all duration-500"></div>
                <span className="relative z-10 flex items-center gap-3 justify-center">
                  Start 30-Day Free Trial
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleScheduleDemo}
                className="px-10 py-5 border-2 border-white/30 text-white font-semibold hover:border-white hover:bg-white/10 transition-all duration-300 min-w-[200px]"
              >
                <span className="flex items-center gap-3 justify-center">
                  Schedule Live Demo
                  <Play className="w-5 h-5" />
                </span>
              </motion.button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 pt-8 border-t border-white/10"
            >
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Available in 50+ cities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile & Web apps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Bank-level security</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <FAQ />
        </div>
      </motion.section>

      <Footer />
    </motion.div>
  )
}