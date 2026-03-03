'use client'

import { useState, useEffect, useRef, memo, useCallback} from'react'
import { useRouter} from'next/navigation'

import Navigation from'@/components/navigation'
import Footer from'@/components/Footer'
import {
  Smartphone,
  Shield,
  Bell,
  Users,
  CreditCard,
  MapPin,
  Camera,
  MessageSquare,
  QrCode,
  Lock,
  Eye,
  Zap,
  Clock,
  Home,
  UserCheck,
  Package,
  AlertTriangle,
  BarChart3,
  Settings,
  Heart,
  Globe,
  Cloud,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause
} from'lucide-react'
import FAQ from'@/components/faq'

// App Capabilities
const APP_CAPABILITIES = [
  {
    category:'Security Management',
    features: [
      {
        title:'Real-time Security Dashboard',
        description:'Monitor security status, active alerts, and surveillance feeds from your mobile device',
        icon: <Shield className="w-6 h-6" />,
        details: [
'Live CCTV feed access',
'Security personnel tracking',
'Incident reports',
'Threat level indicators'
        ]
},
      {
        title:'Emergency Response System',
        description:'Instant access to emergency services and one-tap SOS functionality',
        icon: <AlertTriangle className="w-6 h-6" />,
        details: [
'One-tap emergency call',
'Automatic location sharing',
'Medical information access',
'Emergency contact notification'
        ]
}
    ]
},
  {
    category:'Access Control',
    features: [
      {
        title:'Digital Visitor Management',
        description:'Approve, track, and manage visitors remotely with digital passes',
        icon: <UserCheck className="w-6 h-6" />,
        details: [
'Visitor approval requests',
'Digital visitor passes',
'Visit history logs',
'Blacklist management'
        ]
},
      {
        title:'Smart Entry Systems',
        description:'Control building access with digital keys and QR codes',
        icon: <QrCode className="w-6 h-6" />,
        details: [
'QR code gate entry',
'Temporary access codes',
'Vehicle entry management',
'Staff access permissions'
        ]
}
    ]
},
  {
    category:'Financial Management',
    features: [
      {
        title:'Secure Payment Processing',
        description:'Handle all community payments and dues through secure mobile transactions',
        icon: <CreditCard className="w-6 h-6" />,
        details: [
'Maintenance fee payment',
'Utility bill settlement',
'Payment history tracking',
'Digital receipts'
        ]
},
      {
        title:'Financial Overview',
        description:'Track community finances, dues, and expenses in real-time',
        icon: <BarChart3 className="w-6 h-6" />,
        details: [
'Monthly expense tracking',
'Due payment reminders',
'Financial reports',
'Budget management'
        ]
}
    ]
},
  {
    category:'Community Engagement',
    features: [
      {
        title:'Neighborhood Communication',
        description:'Connect with neighbors and community management through integrated messaging',
        icon: <MessageSquare className="w-6 h-6" />,
        details: [
'Community announcements',
'Direct messaging',
'Group discussions',
'Event coordination'
        ]
},
      {
        title:'Community Services',
        description:'Access and manage community amenities and services',
        icon: <Home className="w-6 h-6" />,
        details: [
'Amenity booking',
'Complaint registration',
'Service requests',
'Facility maintenance'
        ]
}
    ]
}
]

// App Architecture
const APP_ARCHITECTURE = [
  {
    layer:'User Interface',
    components: ['Intuitive Dashboard','Real-time Notifications','Gesture Controls','Dark/Light Mode'],
    icon: <Eye className="w-6 h-6" />
},
  {
    layer:'Core Features',
    components: ['Security Management','Access Control','Payment Processing','Communication Hub'],
    icon: <Zap className="w-6 h-6" />
},
  {
    layer:'Security Layer',
    components: ['End-to-end Encryption','Biometric Authentication','Secure API Gateway','Data Protection'],
    icon: <Lock className="w-6 h-6" />
},
  {
    layer:'Integration Layer',
    components: ['CCTV Systems','Payment Gateways','Smart Devices','Third-party Services'],
    icon: <Cloud className="w-6 h-6" />
}
]

// User Personas
const USER_PERSONAS = [
  {
    role:'Resident',
    needs: ['Easy visitor approval','Quick payments','Emergency access','Community updates'],
    icon: <Users className="w-6 h-6" />,
    color:'gray'
},
  {
    role:'Security Staff',
    needs: ['Real-time monitoring','Visitor verification','Incident reporting','Emergency response'],
    icon: <Shield className="w-6 h-6" />,
    color:'gray'
},
  {
    role:'Community Admin',
    needs: ['Financial management','User management','Announcements','Reports & Analytics'],
    icon: <Settings className="w-6 h-6" />,
    color:'gray'
},
  {
    role:'Visitor',
    needs: ['Easy check-in','Digital passes','Navigation help','Emergency contacts'],
    icon: <UserCheck className="w-6 h-6" />,
    color:'gray'
}
]

// Technology Stack
const TECH_STACK = [
  {
    category:'Frontend',
    technologies: ['React Native','TypeScript','Redux','Native Modules'],
    icon: <Smartphone className="w-5 h-5" />
},
  {
    category:'Backend',
    technologies: ['Node.js','Express','PostgreSQL','Redis'],
    icon: <Cloud className="w-5 h-5" />
},
  {
    category:'Security',
    technologies: ['JWT Authentication','SSL Encryption','OWASP Standards','Penetration Testing'],
    icon: <Lock className="w-5 h-5" />
},
  {
    category:'APIs & Integration',
    technologies: ['REST APIs','WebSocket','Push Notifications','Payment Gateway APIs'],
    icon: <Globe className="w-5 h-5" />
}
]

// App Screenshots Carousel
const APP_SCREENSHOTS = [
  {
    id: 1,
    title:'Dashboard View',
    description:'Personalized security dashboard with real-time updates',
    bgColor:'bg-blue-600'
},
  {
    id: 2,
    title:'Visitor Management',
    description:'Easy visitor approval and digital pass generation',
    bgColor:'bg-green-600'
},
  {
    id: 3,
    title:'Payment Portal',
    description:'Secure payment processing with digital receipts',
    bgColor:'bg-purple-600'
},
  {
    id: 4,
    title:'Emergency SOS',
    description:'One-tap emergency access with location sharing',
    bgColor:'bg-red-600'
},
  {
    id: 5,
    title:'Community Chat',
    description:'Integrated messaging for neighborhood communication',
    bgColor:'bg-indigo-600'
}
]

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30},
  animate: { opacity: 1, y: 0},
  transition: { duration: 0.6}
}

const fadeInScale = {
  initial: { opacity: 0, scale: 0.9},
  animate: { opacity: 1, scale: 1},
  transition: { duration: 0.5}
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
}
}
}

const hoverLift = {
  y: -5,
  transition: { duration: 0.2}
}

const slideInFromLeft = {
  initial: { opacity: 0, x: -50},
  animate: { opacity: 1, x: 0},
  transition: { duration: 0.6}
}

const slideInFromRight = {
  initial: { opacity: 0, x: 50},
  animate: { opacity: 1, x: 0},
  transition: { duration: 0.6}
}

// Carousel Component
const ScreenshotCarousel = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % APP_SCREENSHOTS.length)
}, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? APP_SCREENSHOTS.length - 1 : prevIndex - 1
    )
}, [])

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index)
}, [])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(nextSlide, 4000)
} else {
      clearInterval(intervalRef.current)
}
    return () => clearInterval(intervalRef.current)
}, [isPlaying, nextSlide])

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying)
}, [isPlaying])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Carousel */}
      <div className="relative h-96 md:h-[400px] overflow-hidden">
        <div className="relative w-full h-full">
          <div
            key={currentIndex}
            className={`absolute inset-0 ${APP_SCREENSHOTS[currentIndex].bgColor}`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="text-6xl md:text-8xl mb-6">📱</div>
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {APP_SCREENSHOTS[currentIndex].title}
                </h3>
                <p className="text-white/90 text-lg">
                  {APP_SCREENSHOTS[currentIndex].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
 className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
 className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
 className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-4 mt-8">
        {APP_SCREENSHOTS.map((screenshot, index) => (
          <button
            key={screenshot.id}
            onClick={() => goToSlide(index)}
 className={`relative w-16 h-16 overflow-hidden ${
              currentIndex === index ?'ring-2 ring-gray-900' :''
}`}
          >
            <div className={`w-full h-full ${screenshot.bgColor}`} />
            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">
              {index + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
})

ScreenshotCarousel.displayName ='ScreenshotCarousel'

// Memoized Components
const FeatureDetailCard = memo(({ feature, index}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className=" border-gray-200 hover:border-gray-300 transition-colors"
    >
      <div 
 className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div 
              className="p-3 bg-gray-100 text-gray-700 shrink-0"
            >
              {feature.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          </div>
          <div
            >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-full">
        {isExpanded && (
          <div
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className=" border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Key Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {feature.details.map((detail, detailIndex) => (
                    <div 
                      key={detailIndex}
                      className="flex items-center gap-2 p-2 bg-gray-50"
                    >
                      <div
                        >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

FeatureDetailCard.displayName ='FeatureDetailCard'

const ArchitectureLayer = memo(({ layer, index}) => {
  return (
    <div
      className="relative"
    >
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
        <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-bold">
          {index + 1}
        </div>
      </div>
      
      <div 
        className="ml-4 border-gray-200 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-2 bg-gray-100 text-gray-700"
          >
            {layer.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{layer.layer}</h3>
        </div>
        
        <div className="space-y-2">
          {layer.components.map((component, i) => (
            <div 
              key={i} 
 className="flex items-center gap-2"
              >
              <div className="w-1.5 h-1.5 bg-gray-400"></div>
              <span className="text-sm text-gray-700">{component}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

ArchitectureLayer.displayName ='ArchitectureLayer'

const PersonaCard = memo(({ persona, index}) => {
  const colorClasses = {
    blue:'bg-blue-50 border-blue-100',
    green:'bg-green-50 border-green-100',
    purple:'bg-purple-50 border-purple-100',
    orange:'bg-orange-50 border-orange-100'
}

  return (
    <div
      className={` ${colorClasses[persona.color]} p-6 h-full`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-2 bg-white"
        >
          {persona.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{persona.role}</h3>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Primary Needs:</h4>
        {persona.needs.map((need, needIndex) => (
          <div 
            key={needIndex}
            className="flex items-start gap-2"
          >
            <div
              >
              <CheckCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            </div>
            <span className="text-sm text-gray-700">{need}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

PersonaCard.displayName ='PersonaCard'

const TechStackItem = memo(({ tech, index}) => {
  return (
    <div
      className="-gray-200 p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="p-2 bg-gray-100 text-gray-700"
        >
          {tech.icon}
        </div>
        <h4 className="font-semibold text-gray-900">{tech.category}</h4>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tech.technologies.map((technology, techIndex) => (
          <span
            key={techIndex}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium"
          >
            {technology}
          </span>
        ))}
      </div>
    </div>
  )
})

TechStackItem.displayName ='TechStackItem'

const AppWorkflow = memo(() => {
  const steps = [
    {
      step: 1,
      title:'Authentication',
      description:'Secure login with biometric verification',
      icon: <Lock className="w-5 h-5" />
},
    {
      step: 2,
      title:'Dashboard',
      description:'Personalized view based on user role',
      icon: <Eye className="w-5 h-5" />
},
    {
      step: 3,
      title:'Real-time Updates',
      description:'Live notifications and status updates',
      icon: <Bell className="w-5 h-5" />
},
    {
      step: 4,
      title:'Action',
      description:'Perform security, payment, or communication tasks',
      icon: <Zap className="w-5 h-5" />
},
    {
      step: 5,
      title:'Confirmation',
      description:'Instant feedback and transaction records',
      icon: <CheckCircle className="w-5 h-5" />
}
  ]

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 md:left-1/2 md:transform md:-translate-x-1/2">
        <div
          className="origin-top h-full"
        />
      </div>
      
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`relative flex items-center ${index % 2 === 0 ?'md:flex-row' :'md:flex-row-reverse'}`}
          >
            {/* Step circle */}
            <div 
 className="relative z-10 shrink-0 w-16 h-16 bg-gray-900 flex items-center justify-center"
              >
              <div 
                className="text-white font-bold"
              >
                {step.step}
              </div>
            </div>
            
            {/* Content */}
            <div className={`flex-1 ${index % 2 === 0 ?'md:pl-8' :'md:pr-8 md:text-right'} pl-8`}>
              <div 
                className="-gray-200 p-6 bg-white"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    >
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

AppWorkflow.displayName ='AppWorkflow'

export default function MobileAppFeaturesPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('Security Management')

  const handleGetStarted = useCallback(() => {
    router.push('/register')
}, [router])

  return (
    <div 
      className="min-h-screen bg-white text-gray-900"
    >
      <Navigation />

      {/* Hero Section */}
      <section 
        className="pt-28 pb-20 px-4 bg-linear-to-b from-white to-gray-50"
      >
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 border-gray-300 bg-white mb-6"
            >
              <div
                >
                <Smartphone className="w-4 h-4 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-700">MOBILE APPLICATION</span>
            </div>
            
            <h1 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
 className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span variants={fadeInUp} className="block text-gray-900">
                EstateSecure Mobile App
              </span>
              <span variants={fadeInUp} className="block text-gray-900">
                Complete Community Management
              </span>
            </h1>
            
            <p 
              variants={fadeInUp}
 className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              A comprehensive mobile application that transforms how residents, security staff, 
              and community administrators interact with their community&apos;s security infrastructure. 
              Built with cutting-edge technology and designed for maximum usability.
            </p>

            <div 
              variants={fadeInUp}
 className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={handleGetStarted}
 className="px-6 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
              >
                Get Started
                <span
                  >
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
              <button
                onClick={() => router.push('/demo')}
 className="px-6 py-3 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Carousel Section */}
      <section className="py-16 px-4 bg-white border-t border-b border-gray-200">
        <div className="container mx-auto">
          <div 
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">App Interface Preview</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the beautiful and intuitive interface of our mobile application
            </p>
          </div>
          
          <ScreenshotCarousel />
        </div>
      </section>

      {/* App Overview */}
      <section 
        initial="initial"
        whileInView="animate"
        variants={staggerContainer}
 className="py-16 px-4 bg-white"
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div variants={slideInFromLeft}>
              <h2 className="text-3xl font-bold mb-6">App Overview</h2>
              <div className="space-y-4 text-gray-600">
                <p variants={fadeInUp}>
                  The EstateSecure mobile application is a comprehensive platform designed 
                  to bring all community security and management functions to your smartphone. 
                  It serves as the central hub for residents, security personnel, and administrators.
                </p>
                <p variants={fadeInUp}>
                  Built with React Native for optimal performance across iOS and Android devices, 
                  the app provides a seamless user experience with real-time updates, push notifications, 
                  and offline capabilities.
                </p>
                <p variants={fadeInUp}>
                  The architecture follows modern security protocols with end-to-end encryption, 
                  biometric authentication, and secure data transmission to ensure complete privacy 
                  and protection.
                </p>
              </div>
            </div>
            
            <div 
              variants={slideInFromRight}
              className="-gray-200 p-8 bg-gray-50"
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Key Specifications</h3>
              <div className="space-y-4">
                {[
                  { label:'Platforms', value:'iOS, Android, Web'},
                  { label:'Minimum OS', value:'iOS 13 / Android 8'},
                  { label:'App Size', value:'~25 MB'},
                  { label:'Languages', value:'English, Hindi, Regional'},
                  { label:'Update Frequency', value:'Bi-weekly'}
                ].map((spec, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-200"
                  >
                    <span className="text-gray-700">{spec.label}</span>
                    <span className="font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Personas */}
      <section 
        initial="initial"
        whileInView="animate"
        variants={staggerContainer}
 className="py-16 px-4 bg-gray-50 border-t border-b border-gray-200"
      >
        <div className="container mx-auto">
          <div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Designed for Everyone</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The app caters to all community stakeholders with role-specific features
            </p>
          </div>

          <div 
            variants={staggerContainer}
 className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {USER_PERSONAS.map((persona, index) => (
              <PersonaCard key={index} persona={persona} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities by Category */}
      <section 
        initial="initial"
        whileInView="animate"
        variants={staggerContainer}
 className="py-16 px-4 bg-white"
      >
        <div className="container mx-auto max-w-6xl">
          <div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Capabilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the extensive features organized by functional categories
            </p>
          </div>

          {/* Category Tabs */}
          <div 
            variants={staggerContainer}
 className="flex flex-wrap gap-2 mb-8"
          >
            {APP_CAPABILITIES.map((category, index) => (
              <button
                key={category.category}
                variants={fadeInScale}
                onClick={() => setActiveCategory(category.category)}
 className={`px-6 py-3 font-medium transition-colors ${
                  activeCategory === category.category
                    ?'bg-gray-900 text-white'
                    :'bg-gray-100 text-gray-700 hover:bg-gray-200'
}`}
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* Features for Active Category */}
          <div className="relative w-full h-full">
            <div
              key={activeCategory}
              className="space-y-6"
            >
              {APP_CAPABILITIES
                .find(cat => cat.category === activeCategory)
                ?.features.map((feature, index) => (
                  <FeatureDetailCard key={index} feature={feature} index={index} />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* App Architecture */}
      <section 
        className="py-16 px-4 bg-gray-50 border-t border-b border-gray-200"
      >
        <div className="container mx-auto max-w-4xl">
          <div 
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Technical Architecture</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built on a robust, scalable, and secure technical foundation
            </p>
          </div>

          <div className="space-y-6">
            {APP_ARCHITECTURE.map((layer, index) => (
              <ArchitectureLayer key={index} layer={layer} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* User Workflow */}
      <section 
        className="py-16 px-4 bg-white"
      >
        <div className="container mx-auto max-w-6xl">
          <div 
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">User Workflow</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Seamless user journey from authentication to action completion
            </p>
          </div>

          <AppWorkflow />
        </div>
      </section>

      {/* Technology Stack */}
      <section 
        initial="initial"
        whileInView="animate"
        variants={staggerContainer}
 className="py-16 px-4 bg-gray-50 border-t border-b border-gray-200"
      >
        <div className="container mx-auto max-w-6xl">
          <div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern technologies powering the EstateSecure mobile experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TECH_STACK.map((tech, index) => (
              <TechStackItem key={index} tech={tech} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Integration Capabilities */}
      <section 
        initial="initial"
        whileInView="animate"
        variants={staggerContainer}
 className="py-16 px-4 bg-white"
      >
        <div className="container mx-auto max-w-6xl">
          <div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Integration Ecosystem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Seamlessly integrates with existing community infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Camera className="w-6 h-6 text-gray-700" />,
                title:'Security Systems',
                items: ['CCTV Cameras','Biometric Scanners','Access Control','Alarm Systems','Intercoms']
},
              {
                icon: <CreditCard className="w-6 h-6 text-gray-700" />,
                title:'Payment Gateways',
                items: ['Razorpay','Stripe','PayPal','Paytm','UPI']
},
              {
                icon: <Cloud className="w-6 h-6 text-gray-700" />,
                title:'Smart Devices',
                items: ['Smart Locks','IoT Sensors','Smart Lighting','Voice Assistants','Wearables']
}
            ].map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                variants={fadeInScale}
                className="-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="p-2 bg-gray-100 text-gray-700"
                  >
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
                
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className="flex items-center gap-2"
                    >
                      <div
                        >
                        <CheckCircle className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section 
        className="py-16 px-4 bg-gray-900 text-white border-t border-b border-gray-800"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              variants={slideInFromLeft}
              initial="initial"
              whileInView="animate"
              >
              <h2 className="text-3xl font-bold mb-6">Security & Compliance</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  The EstateSecure mobile app is built with security as the foundational principle. 
                  Every feature undergoes rigorous security testing and compliance verification.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: <Lock className="w-5 h-5" />, text:'End-to-end encryption for all data transmission'},
                    { icon: <Shield className="w-5 h-5" />, text:'Biometric authentication for user access'},
                    { icon: <Eye className="w-5 h-5" />, text:'Regular security audits and penetration testing'},
                    { icon: <CheckCircle className="w-5 h-5" />, text:'Compliance with GDPR and Indian data protection laws'}
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              variants={slideInFromRight}
              initial="initial"
              whileInView="animate"
              className="-gray-700 p-8"
            >
              <h3 className="text-xl font-semibold mb-6">Compliance Certifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {['ISO 27001','GDPR','SOC 2','PCI DSS','Indian DPDP','Cyber Essentials'].map((cert, i) => (
                  <div 
                    key={i}
                    className="p-3 bg-gray-800 text-center"
                  >
                    <span className="font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 px-4 bg-gray-50 border-t border-b border-gray-200"
      >
        <div className="container mx-auto text-center max-w-3xl">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            <span className="block">Ready to Transform</span>
            <span className="block">Community Management?</span>
          </h2>
          
          <p 
            className="text-lg text-gray-600 mb-8"
          >
            Experience the power of EstateSecure mobile app in your community. 
            Schedule a demo or start your free trial today.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleGetStarted}
 className="px-8 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              Start Free Trial
              <span
                >
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
            
            <button
              onClick={() => router.push('/contact')}
 className="px-8 py-3 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Request Technical Specifications
            </button>
          </div>
          
          <p 
            className="text-gray-500 text-sm mt-6"
          >
            Available for iOS, Android, and Web • Enterprise-grade security • 24/7 support
          </p>
        </div>
      </section>
      <FAQ/>

      <Footer />
    </div>
  )
}