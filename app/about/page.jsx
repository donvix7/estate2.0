'use client'

import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import { 
  Shield,
  Target,
  Users,
  Award,
  Globe,
  TrendingUp,
  Heart,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  Lock,
  Eye,
  Cpu,
  BarChart3,
  MessageSquare,
  ChevronRight,
  MapPin,
  Calendar,
  Users as UsersIcon,
  Trophy,
  Award as AwardIcon,
  Sparkles,
  Lightbulb,
  Handshake,
  Target as TargetIcon
} from 'lucide-react'

// Team Data
const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'CEO & Founder',
    bio: 'Former cybersecurity expert with 15+ years in enterprise security solutions. Founded EstateSecure to bring enterprise-grade security to residential communities.',
    expertise: ['Cybersecurity', 'Leadership', 'Strategy'],
    image: '👨‍💼',
    linkedin: '#'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'CTO',
    bio: 'Ex-Google engineer specializing in AI and IoT. Leads our technical team in developing cutting-edge security solutions.',
    expertise: ['AI/ML', 'IoT', 'Software Architecture'],
    image: '👩‍💻',
    linkedin: '#'
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Head of Security',
    bio: 'Former police commissioner with 20+ years in law enforcement. Oversees all security protocols and emergency response systems.',
    expertise: ['Law Enforcement', 'Emergency Response', 'Risk Assessment'],
    image: '👮‍♂️',
    linkedin: '#'
  },
  {
    id: 4,
    name: 'Neha Gupta',
    role: 'Product Director',
    bio: 'Product management veteran from Silicon Valley. Focuses on user experience and feature development.',
    expertise: ['Product Management', 'UX Design', 'Market Research'],
    image: '👩‍💼',
    linkedin: '#'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    role: 'Head of Operations',
    bio: 'Operations specialist with experience scaling tech startups. Manages deployment and customer success.',
    expertise: ['Operations', 'Scaling', 'Customer Success'],
    image: '👨‍🔧',
    linkedin: '#'
  },
  {
    id: 6,
    name: 'Ananya Reddy',
    role: 'Head of Community',
    bio: 'Community management expert who ensures seamless adoption and engagement across all communities.',
    expertise: ['Community Building', 'Training', 'Support'],
    image: '👩‍🏫',
    linkedin: '#'
  },
]

// Values Data
const COMPANY_VALUES = [
  {
    title: 'Security First',
    description: 'We never compromise on security. Every feature is designed with protection as the primary goal.',
    icon: <Shield className="w-6 h-6" />,
    color: 'gray'
  },
  {
    title: 'Community Centric',
    description: 'We believe technology should bring people together, not isolate them. Our solutions foster community.',
    icon: <Users className="w-6 h-6" />,
    color: 'gray'
  },
  {
    title: 'Innovation Driven',
    description: 'Constant innovation to stay ahead of security threats and provide cutting-edge solutions.',
    icon: <Zap className="w-6 h-6" />,
    color: 'gray'
  },
  {
    title: 'Transparent',
    description: 'Clear communication, honest pricing, and open development process with our community.',
    icon: <Eye className="w-6 h-6" />,
    color: 'gray'
  },
]

// Milestones
const MILESTONES = [
  { year: '2018', event: 'Founded with vision to secure residential communities', },
  { year: '2019', event: 'First 50 communities onboarded', },
  { year: '2020', event: 'Launched AI-powered surveillance features', },
  { year: '2021', event: 'Expanded to 500+ communities across India', },
  { year: '2022', event: 'Received Series A funding $5M', },
  { year: '2023', event: 'Launched mobile app with 100K+ downloads', },
  { year: '2024', event: 'Expanding to Southeast Asia markets', },
]

// Statistics
const STATISTICS = [
  { value: '2,500+', label: 'Communities Secured', icon: <Building className="w-5 h-5" /> },
  { value: '1M+', label: 'Residents Protected', icon: <UsersIcon className="w-5 h-5" /> },
  { value: '99.7%', label: 'Uptime SLA', icon: <Clock className="w-5 h-5" /> },
  { value: '24/7', label: 'Support Coverage', icon: <Heart className="w-5 h-5" /> },
  { value: '50+', label: 'Cities Covered', icon: <MapPin className="w-5 h-5" /> },
  { value: '4.9/5', label: 'Customer Rating', icon: <Star className="w-5 h-5" /> },
]

// Awards & Recognition
const AWARDS = [
  { title: 'Best Security Startup 2023', issuer: 'SecurityTech Awards', },
  { title: 'Innovation in IoT', issuer: 'Tech Innovation Forum', },
  { title: 'Community Impact Award', issuer: 'Digital India Summit', },
  { title: 'Top 10 PropTech Startups', issuer: 'Real Estate Times', },
]

// Animation variants
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

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 }
}

const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 }
}

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

// Memoized Components
const TeamMemberCard = memo(({ member }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5 }
        },
        hover: hoverScale
      }}
      className="border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div 
          className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl mb-4"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {member.image}
        </motion.div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-600">{member.role}</span>
          <AnimatePresence>
            {isHovered && (
              <motion.a
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                href={member.linkedin}
                className="text-blue-600 hover:text-blue-800 overflow-hidden"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
            )}
          </AnimatePresence>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {member.expertise.map((skill, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
})

TeamMemberCard.displayName = 'TeamMemberCard'

const ValueCard = memo(({ value, index }) => {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { delay: index * 0.1, duration: 0.5 }
        },
        hover: { y: -5, transition: { duration: 0.2 } }
      }}
      className="relative"
    >
      <motion.div 
        className="absolute -left-2 top-1/2 transform -translate-y-1/2"
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
      >
        <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
          {index + 1}
        </div>
      </motion.div>
      
      <div className={`ml-4 p-6 border bg-gray-50 text-gray-700 border-gray-200 h-full`}>
        <div className="mb-4">
          <motion.div 
            className="p-3 bg-white border w-fit mb-3"
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {value.icon}
          </motion.div>
          <h3 className="text-xl font-bold mb-2">{value.title}</h3>
        </div>
        <p className="text-sm">{value.description}</p>
      </div>
    </motion.div>
  )
})

ValueCard.displayName = 'ValueCard'

const MilestoneItem = memo(({ milestone, isLast }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6 }}
    className="relative flex items-start"
  >
    {/* Timeline line */}
    {!isLast && (
      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
    )}
    
    {/* Year marker */}
    <motion.div 
      className="relative z-10 flex-shrink-0 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mr-6"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <span className="text-white font-bold text-sm">{milestone.year}</span>
    </motion.div>
    
    {/* Content */}
    <motion.div 
      className="pb-8 pt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <p className="text-gray-700">{milestone.event}</p>
    </motion.div>
  </motion.div>
))

MilestoneItem.displayName = 'MilestoneItem'

const StatCard = memo(({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover="hover"
    variants={{
      hover: { 
        scale: 1.05,
        transition: { duration: 0.2 }
      }
    }}
    className="border border-gray-200 p-6 text-center hover:border-gray-300 transition-colors bg-white"
  >
    <div className="flex justify-center mb-4">
      <motion.div
        animate={pulseAnimation}
      >
        {stat.icon}
      </motion.div>
    </div>
    <motion.div 
      className="text-3xl font-bold text-gray-900 mb-2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
    >
      {stat.value}
    </motion.div>
    <div className="text-gray-600">{stat.label}</div>
  </motion.div>
))

StatCard.displayName = 'StatCard'

const AwardCard = memo(({ award, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
    }}
    className="border border-gray-200 p-6 hover:shadow-sm transition-shadow bg-white"
  >
    <h4 className="font-semibold text-gray-900 mb-1">{award.title}</h4>
    <p className="text-sm text-gray-600">{award.issuer}</p>
  </motion.div>
))

AwardCard.displayName = 'AwardCard'

export default function AboutPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('mission')
  const [visibleStats, setVisibleStats] = useState(Array(STATISTICS.length).fill(false))
  const statsRef = useRef(null)

  // Animate stats on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate stats one by one
            visibleStats.forEach((_, index) => {
              setTimeout(() => {
                setVisibleStats(prev => {
                  const newState = [...prev]
                  newState[index] = true
                  return newState
                })
              }, index * 100)
            })
          }
        })
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  const handleGetStarted = useCallback(() => {
    router.push('/register')
  }, [router])

  const handleContact = useCallback(() => {
    router.push('/contact')
  }, [router])

  return (
    <motion.div 
      className="min-h-screen bg-white text-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navigation />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-28 pb-20 px-4 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-gray-700" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700">OUR STORY</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.span 
                variants={fadeInUp}
                className="block text-gray-900"
              >
                Securing Communities,
              </motion.span>
              <motion.span 
                variants={fadeInUp}
                className="block text-gray-900"
              >
                Building Trust
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              EstateSecure was born from a simple observation: while commercial spaces enjoyed 
              enterprise-grade security, residential communities relied on outdated, fragmented systems. 
              We're on a mission to change that.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-6 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
              >
                Start Free Trial
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContact}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Contact Us
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-16 px-4 bg-white"
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div variants={fadeInScale} className="border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <TargetIcon className="w-6 h-6 text-gray-900" />
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 mb-6">
                To make enterprise-grade security accessible and affordable for every residential 
                community, ensuring safe, connected, and worry-free living environments for millions.
              </p>
              <ul className="space-y-3">
                {[
                  'Democratize advanced security technology',
                  'Foster connected, safe communities',
                  'Innovate continuously to stay ahead of threats',
                  'Maintain unwavering commitment to privacy'
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInScale} className="border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-gray-900" />
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 mb-6">
                To become the world's most trusted community security platform, protecting 
                millions of homes and transforming how people experience safety in their communities.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'By 2025', text: 'Secure 10,000+ communities across Asia' },
                  { label: 'By 2027', text: 'Expand to 15+ countries globally' },
                  { label: 'By 2030', text: 'Protect 10 million+ homes worldwide' }
                ].map((goal, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="px-3 py-1 bg-gray-900 text-white text-sm font-medium">
                      {goal.label}
                    </div>
                    <span className="text-gray-700">{goal.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The scale of our mission and the trust communities place in us
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {STATISTICS.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From a simple idea to securing thousands of communities
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {MILESTONES.map((milestone, index) => (
              <MilestoneItem
                key={index}
                milestone={milestone}
                isLast={index === MILESTONES.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-16 px-4 bg-gray-50"
      >
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {COMPANY_VALUES.map((value, index) => (
              <ValueCard key={index} value={value} index={index} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="py-16 px-4 bg-white"
      >
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white mb-6">
              <Users className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">MEET THE TEAM</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experts from security, technology, and community management working together
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 bg-gray-50">
              <span className="text-gray-700">And 50+ dedicated engineers, security experts, and support staff</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Awards & Recognition */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-16 px-4 bg-gray-50"
      >
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recognition from industry leaders for our innovation and impact
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12"
          >
            {AWARDS.map((award, index) => (
              <AwardCard key={index} award={award} index={index} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="max-w-4xl mx-auto"
          >
            <div className="border border-gray-200 bg-white p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.div 
                  className="flex-shrink-0"
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8" />
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Certified & Compliant
                  </h3>
                  <p className="text-gray-600 mb-4">
                    EstateSecure is ISO 27001 certified and complies with GDPR, 
                    Indian Data Protection Act, and other global security standards.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['ISO 27001', 'GDPR Compliant', 'SOC 2 Type II', 'Cyber Essentials'].map((cert, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium"
                      >
                        {cert}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Community Impact */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-16 px-4 bg-white"
      >
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Beyond Security</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              How we're building stronger, more connected communities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Handshake className="w-8 h-8 text-gray-600" />,
                title: "Community Initiatives",
                description: "We sponsor neighborhood watch programs, safety workshops, and community events that bring residents together."
              },
              {
                icon: <Globe className="w-8 h-8 text-gray-600" />,
                title: "Sustainability",
                description: "Our solutions reduce paper waste, optimize energy usage in common areas, and promote eco-friendly community practices."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-gray-600" />,
                title: "Local Partnerships",
                description: "We partner with local security agencies, emergency services, and businesses to create integrated safety ecosystems."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInScale}
                className="text-center"
              >
                <motion.div 
                  className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 bg-gray-900 text-white"
      >
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-700 bg-gray-800 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Handshake className="w-4 h-4 text-gray-300" />
            </motion.div>
            <span className="text-sm font-medium text-gray-300">JOIN OUR MISSION</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            <span className="block">Ready to Secure</span>
            <span className="block">Your Community?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-300 mb-8"
          >
            Join thousands of communities that have transformed their security 
            with EstateSecure. Let's build safer neighborhoods together.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-8 py-3 bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
            >
              Start Free Trial
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContact}
              className="px-8 py-3 border border-gray-600 text-gray-300 font-semibold hover:bg-gray-800 transition-all duration-300"
            >
              Schedule a Demo
            </motion.button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-sm mt-6"
          >
            Enterprise-grade security • 30-day free trial • Dedicated support
          </motion.p>
        </div>
      </motion.section>

      <Footer />
    </motion.div>
  )
}