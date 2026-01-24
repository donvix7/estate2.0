'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
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
  ChevronRight
} from 'lucide-react'
import FAQ from '@/components/faq'

// Constants
const FEATURES = [
  {
    title: 'Intelligent Access Control',
    icon: <Lock className="w-6 h-6" />,
    description: 'Advanced visitor management with biometric verification and smart entry systems',
    items: ['Dynamic QR Code Passes', 'Facial Recognition', 'Automated Entry/Exit Logs', 'Real-time Blacklist Alerts', 'Biometric Verification'],
    demo: 'access'
  },
  {
    title: 'Emergency Response System',
    icon: <AlertTriangle className="w-6 h-6" />,
    description: 'Instant panic response with multi-channel emergency notification',
    items: ['One-tap SOS Button', 'GPS Location Sharing', 'Multi-admin Alert System', 'Emergency Broadcast', 'Incident Documentation'],
    demo: 'emergency'
  },
  {
    title: 'Secure Digital Payments',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Seamless financial transactions with automated compliance tracking',
    items: ['Automated Dues Collection', 'Encrypted Transactions', 'Digital Receipts', 'Arrears Management', 'Expense Analytics'],
    demo: 'payments'
  },
  {
    title: 'Centralized Admin Dashboard',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Comprehensive management platform with real-time monitoring',
    items: ['Resident Analytics', 'Visitor Approvals', 'Emergency Monitoring', 'Financial Overview', 'Compliance Reports'],
    demo: 'admin'
  },
  {
    title: 'Smart Communication Hub',
    icon: <MessageSquare className="w-6 h-6" />,
    description: 'Integrated messaging system for announcements and alerts',
    items: ['Targeted Announcements', 'Emergency Broadcasts', 'Real-time Notifications', 'Group Messaging', 'Chat History'],
    demo: 'communication'
  },
  {
    title: 'Advanced Surveillance',
    icon: <Camera className="w-6 h-6" />,
    description: 'Integrated security monitoring with AI-powered threat detection',
    items: ['CCTV Integration', 'Motion Detection', 'License Plate Recognition', 'Suspicious Activity Alerts', 'Cloud Storage'],
    demo: 'surveillance'
  }
]

const INTEGRATION_STEPS = [
  {
    step: '01',
    title: 'Setup & Integration',
    description: 'Quick installation with existing security infrastructure',
    icon: <Database className="w-6 h-6" />,
    details: ['24-hour Setup', 'API Integration', 'System Compatibility', 'Data Migration']
  },
  {
    step: '02',
    title: 'Onboard Community',
    description: 'Easy resident registration and system training',
    icon: <Users className="w-6 h-6" />,
    details: ['Bulk Registration', 'Training Sessions', 'Mobile App Setup', 'Support Portal']
  },
  {
    step: '03',
    title: 'Go Live & Monitor',
    description: '24/7 monitoring dashboard and support',
    icon: <Eye className="w-6 h-6" />,
    details: ['Real-time Dashboard', '24/7 Support', 'Performance Analytics', 'Regular Updates']
  }
]

// Memoized Components
const FeatureCard = memo(({ feature, isActive, onClick }) => (
  <div
    className={`p-4 border transition-all duration-300 cursor-pointer ${
      isActive
        ? 'border-blue-600 bg-gray-50 shadow-md'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    <div className="flex items-start gap-3">
      <div className={`p-2 ${
        isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
      }`}>
        {feature.icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1 text-gray-900">{feature.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
        <div className="flex flex-wrap gap-1">
          {feature.items.slice(0, 2).map((item, i) => (
            <span
              key={i}
              className={`px-2 py-1 text-xs font-medium ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
))

FeatureCard.displayName = 'FeatureCard'

const IntegrationStep = memo(({ step }) => (
  <div className="relative border border-gray-200 p-6 bg-white h-full">
    <div className="mb-4">
      <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center mb-3">
        <span className="text-lg font-bold">{step.step}</span>
      </div>
      <div className="p-2 bg-gray-100 w-fit">
        {step.icon}
      </div>
    </div>
    
    <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
    <p className="text-gray-600 mb-4">{step.description}</p>
    
    <div className="space-y-2">
      {step.details.map((detail, i) => (
        <div key={i} className="flex items-center gap-2 p-2">
          <CheckCircle className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">{detail}</span>
        </div>
      ))}
    </div>
  </div>
))

IntegrationStep.displayName = 'IntegrationStep'

// Demo Components
const AccessDemo = memo(() => (
  <div className="border border-gray-200 p-6 bg-white h-full">
    <div className="flex flex-col lg:flex-row items-center gap-6 h-full">
      <div className="relative">
        <div className="w-40 h-40 border-2 border-gray-300 flex items-center justify-center">
          <QrCode className="w-24 h-24 text-gray-700" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-medium">ACTIVE PASS</span>
          </div>
          <p className="text-2xl font-bold tracking-wider text-gray-900">
            ES-2024-8932
          </p>
          <p className="text-gray-600">Valid until: Today 11:59 PM</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-200 p-3 bg-gray-50">
            <p className="text-sm text-gray-600">Entry Code</p>
            <p className="text-lg font-mono font-bold text-gray-900">7845</p>
          </div>
          <div className="border border-gray-200 p-3 bg-gray-50">
            <p className="text-sm text-gray-600">Visitor Name</p>
            <p className="text-lg font-semibold text-gray-900">John Carter</p>
          </div>
        </div>
      </div>
    </div>
  </div>
))

AccessDemo.displayName = 'AccessDemo'

const EmergencyDemo = memo(() => (
  <div className="border border-gray-200 p-6 bg-white h-full">
    <div className="text-center space-y-6 h-full flex flex-col justify-center">
      <div className="relative inline-block">
        <button className="w-56 h-56 bg-gray-900 text-white text-xl font-bold hover:bg-gray-800 transition-all flex flex-col items-center justify-center border border-gray-300">
          <AlertTriangle className="w-16 h-16 mb-4" />
          <span>EMERGENCY SOS</span>
          <div className="text-sm font-normal mt-2 opacity-90">Press & Hold 3 Seconds</div>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-medium">Alerts Sent</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Security</span>
              <span className="text-green-600 font-medium">✓ Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Admin</span>
              <span className="text-green-600 font-medium">✓ Connected</span>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-medium">Location</span>
          </div>
          <p className="text-sm text-gray-700">GPS coordinates shared</p>
          <p className="text-xs text-gray-500 mt-1">Accuracy: 3 meters</p>
        </div>
      </div>
    </div>
  </div>
))

EmergencyDemo.displayName = 'EmergencyDemo'

const PaymentsDemo = memo(() => (
  <div className="border border-gray-200 p-6 bg-white h-full">
    <div className="space-y-6 h-full flex flex-col justify-center">
      <div className="border border-gray-200 p-5 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-600">Monthly Dues</p>
            <p className="text-2xl font-bold text-gray-900">₹8,500</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Due Date</p>
            <p className="text-lg font-semibold text-gray-700">15th June</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1 mb-2">
          <div className="bg-gray-900 h-1" style={{ width: '85%' }}></div>
        </div>
        <p className="text-sm text-gray-600">Payment Progress: 85% collected</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-gray-900 text-white font-semibold py-3 hover:bg-gray-800 transition-all duration-300 border border-gray-900">
          Pay Now Securely
        </button>
        <button className="bg-white border border-gray-300 text-gray-700 font-semibold py-3 hover:bg-gray-50 transition-all">
          View History
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Last Payment</span>
          </div>
          <span className="font-semibold text-gray-900">₹8,500</span>
        </div>
        <div className="flex items-center justify-between p-3 border border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Next Payment</span>
          </div>
          <span className="font-semibold text-gray-900">July 15</span>
        </div>
      </div>
    </div>
  </div>
))

PaymentsDemo.displayName = 'PaymentsDemo'

const DemoPlaceholder = memo(({ feature }) => (
  <div className="border border-gray-200 p-6 bg-white h-full flex items-center justify-center">
    <div className="text-center">
      <div className="p-3 bg-gray-100 mb-3 inline-block">
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-gray-600">Interactive demo coming soon</p>
    </div>
  </div>
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

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const router = useRouter()
  const featuresRef = useRef(null)
  const carouselRef = useRef(null)
  const carouselIntervalRef = useRef(null)

  // Mount effect
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Feature carousel auto-rotation with cleanup
  useEffect(() => {
    if (mounted) {
      carouselIntervalRef.current = setInterval(() => {
        if (!isAnimating) {
          setIsAnimating(true)
          setActiveFeature(prev => (prev + 1) % FEATURES.length)
          setTimeout(() => setIsAnimating(false), 500)
        }
      }, 5000)

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
      setTimeout(() => setIsAnimating(false), 300)
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

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 min-h-screen flex flex-col justify-center">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gray-900 block">EstateSecure</span>
            <span className="mt-2 text-3xl md:text-4xl text-gray-600">
              Next-Generation Community
              <span className="block text-gray-900">Security Platform</span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your residential community with our comprehensive security management platform.
            <span className="block mt-2 text-base text-gray-600">
              AI-powered surveillance, smart access control, and real-time emergency response.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-300 border border-gray-900"
            >
              <span className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Explore Features
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section 
        ref={featuresRef}
        id="features" 
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white mb-4">
              <Zap className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">POWERFUL FEATURES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900">Complete Security</span>
              <span className="block text-gray-900">Management Suite</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to secure and manage modern residential communities.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((feature, index) => (
                <div key={index}>
                  <FeatureCard
                    feature={feature}
                    isActive={activeFeature === index}
                    onClick={() => handleFeatureClick(index)}
                  />
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={prevFeature}
                  className="p-2 border border-gray-300 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isAnimating}
                  aria-label="Previous feature"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <div className="flex items-center gap-3">
                  {FEATURES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleFeatureClick(index)}
                      className={`w-2 h-2 transition-all duration-300 ${
                        activeFeature === index 
                          ? 'bg-gray-900 w-4' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to feature ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextFeature}
                  className="p-2 border border-gray-300 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isAnimating}
                  aria-label="Next feature"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div 
                ref={carouselRef}
                className="relative overflow-hidden h-[400px]"
              >
                <div 
                  className="flex transition-transform duration-300 ease-out h-full"
                  style={{ transform: `translateX(-${activeFeature * 100}%)` }}
                >
                  {FEATURES.map((feature, index) => (
                    <div 
                      key={index}
                      className="w-full flex-shrink-0 p-2 h-full"
                    >
                      <div className="h-full">
                        <DemoComponent demoType={feature.demo} feature={feature} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {FEATURES[activeFeature].title}
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {FEATURES[activeFeature].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gray-900">Simple Integration,</span>
              <span className="block text-gray-900">Powerful Results</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get started in just 3 easy steps. Our seamless integration process ensures minimal disruption to your community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {INTEGRATION_STEPS.map((step, index) => (
              <IntegrationStep key={index} step={step} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 border border-gray-300 bg-gray-50">
              <Clock className="w-4 h-4 text-gray-700" />
              <span className="text-gray-700">Average Setup Time: <span className="font-semibold">7 Days</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 border border-gray-700 bg-gray-800 mb-6">
              <Shield className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-300">ENTERPRISE-GRADE SECURITY</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="block">Ready to Transform</span>
              <span className="block">Community Security?</span>
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Join thousands of modern communities using EstateSecure for unparalleled safety and seamless management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-3 bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-300 border border-white"
              >
                <span className="flex items-center gap-2">
                  Start 30-Day Free Trial
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
              
              <button
                onClick={() => router.push('/demo')}
                className="px-8 py-3 border border-gray-600 text-gray-300 font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Schedule Live Demo
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mt-6">
              No credit card required • 24/7 Support • GDPR Compliant
            </p>
          </div>
        </div>
      </section>
      <FAQ/>

      <Footer />
    </div>
  )
}