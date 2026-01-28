'use client'

import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import { 
  Check,
  X,
  Shield,
  Users,
  Zap,
  Building,
  Star,
  Award,
  Clock,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Headphones,
  Globe,
  Lock,
  CreditCard,
  Calendar,
  Repeat,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Target,
  Cpu,
  FileText
} from 'lucide-react'

// Pricing Plans Data
const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small communities',
    price: {
      monthly: 299,
      annually: 299 * 10, // 2 months free
    },
    features: [
      { text: 'Up to 100 units', included: true },
      { text: 'Basic Access Control', included: true },
      { text: 'Visitor Management', included: true },
      { text: 'Emergency SOS', included: true },
      { text: 'Mobile App for Residents', included: true },
      { text: 'Email Support', included: true },
      { text: 'Basic Reports', included: true },
      { text: '1 Admin Account', included: true },
      { text: 'Advanced CCTV Integration', included: false },
      { text: 'Payment Collection', included: false },
      { text: 'Advanced Analytics', included: false },
      { text: 'API Access', included: false },
      { text: 'Priority Support', included: false },
      { text: 'Custom Branding', included: false },
    ],
    highlighted: false,
    popular: false,
    icon: <Building className="w-6 h-6" />,
    cta: 'Get Started',
    color: 'gray'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing communities',
    price: {
      monthly: 599,
      annually: 599 * 10, // 2 months free
    },
    features: [
      { text: 'Up to 500 units', included: true },
      { text: 'Advanced Access Control', included: true },
      { text: 'Visitor Management', included: true },
      { text: 'Emergency SOS with GPS', included: true },
      { text: 'Mobile App for Residents', included: true },
      { text: 'Chat & Email Support', included: true },
      { text: 'Advanced Reports', included: true },
      { text: '5 Admin Accounts', included: true },
      { text: 'CCTV Integration', included: true },
      { text: 'Payment Collection', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Limited API Access', included: true },
      { text: 'Priority Support', included: false },
      { text: 'Custom Branding', included: false },
    ],
    highlighted: true,
    popular: true,
    icon: <Shield className="w-6 h-6" />,
    cta: 'Start Free Trial',
    color: 'blue'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large communities & townships',
    price: {
      monthly: 999,
      annually: 999 * 10, // 2 months free
    },
    features: [
      { text: 'Unlimited units', included: true },
      { text: 'Premium Access Control', included: true },
      { text: 'Advanced Visitor Management', included: true },
      { text: 'Emergency SOS with AI Response', included: true },
      { text: 'Mobile & Web Apps', included: true },
      { text: '24/7 Phone Support', included: true },
      { text: 'Custom Reports', included: true },
      { text: 'Unlimited Admin Accounts', included: true },
      { text: 'AI CCTV Integration', included: true },
      { text: 'Advanced Payment System', included: true },
      { text: 'AI-Powered Analytics', included: true },
      { text: 'Full API Access', included: true },
      { text: 'Dedicated Support Manager', included: true },
      { text: 'White-label Branding', included: true },
    ],
    highlighted: false,
    popular: false,
    icon: <Award className="w-6 h-6" />,
    cta: 'Contact Sales',
    color: 'purple'
  },
]

// Feature Comparison
const FEATURE_COMPARISON = [
  { name: 'Maximum Units', starter: '100', professional: '500', enterprise: 'Unlimited' },
  { name: 'Admin Accounts', starter: '1', professional: '5', enterprise: 'Unlimited' },
  { name: 'Visitor Passes/Month', starter: '500', professional: '2000', enterprise: 'Unlimited' },
  { name: 'Emergency Alerts', starter: 'Basic', professional: 'Advanced', enterprise: 'AI-Powered' },
  { name: 'CCTV Integration', starter: 'No', professional: 'Up to 20 cameras', enterprise: 'Unlimited + AI' },
  { name: 'Payment Collection', starter: 'No', professional: 'Yes', enterprise: 'Advanced' },
  { name: 'Data Retention', starter: '6 months', professional: '2 years', enterprise: '5 years' },
  { name: 'Support', starter: 'Email', professional: 'Chat & Email', enterprise: '24/7 Phone + Dedicated' },
  { name: 'SLA', starter: 'None', professional: '99%', enterprise: '99.9%' },
  { name: 'API Access', starter: 'No', professional: 'Limited', enterprise: 'Full' },
  { name: 'Custom Branding', starter: 'No', professional: 'No', enterprise: 'White-label' },
  { name: 'Security Audits', starter: 'Annual', professional: 'Quarterly', enterprise: 'Monthly' },
]

// FAQ Data
const PRICING_FAQ = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll get prorated credit for your current plan. When downgrading, changes take effect at the end of your billing cycle.',
    icon: <Repeat className="w-5 h-5" />
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No setup fees for any plan. We include initial setup, training, and data migration in your subscription. Enterprise plans include dedicated onboarding support.',
    icon: <Zap className="w-5 h-5" />
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, net banking, UPI, and offer invoice-based payments for annual subscriptions. All payments are encrypted and secure.',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Save 16% when you choose annual billing. You get 2 months free compared to monthly billing. All annual plans include priority support.',
    icon: <Calendar className="w-5 h-5" />
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! All plans include a 30-day free trial with full access to all features. No credit card required to start. Professional and Enterprise trials include onboarding support.',
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    question: 'What happens after the trial?',
    answer: 'After 30 days, your account will automatically switch to the selected paid plan. You can cancel anytime during the trial without any charges.',
    icon: <Clock className="w-5 h-5" />
  },
  {
    question: 'Do you offer custom pricing?',
    answer: 'Yes, we offer custom pricing for very large communities, multiple properties, or special requirements. Contact our sales team for a tailored quote.',
    icon: <Target className="w-5 h-5" />
  },
  {
    question: 'Is there a contract?',
    answer: 'Monthly plans are month-to-month with no long-term contract. Annual plans require a 1-year commitment but offer significant savings and additional features.',
    icon: <FileText className="w-5 h-5" />
  },
]

// Add-on Services
const ADDON_SERVICES = [
  {
    name: 'Hardware Integration',
    description: 'Professional setup of CCTV, biometric scanners, and access control hardware',
    price: 'Custom',
    features: ['Site Survey', 'Hardware Installation', 'System Integration', 'Staff Training'],
    icon: <Cpu className="w-5 h-5" />
  },
  {
    name: '24/7 Monitoring',
    description: 'Round-the-clock security monitoring by certified professionals',
    price: '₹15,000/month',
    features: ['Dedicated Monitoring Team', 'Instant Alert Response', 'Monthly Security Reports', 'Emergency Coordination'],
    icon: <Headphones className="w-5 h-5" />
  },
  {
    name: 'Advanced Analytics',
    description: 'Deep insights and predictive analytics for security optimization',
    price: '₹8,000/month',
    features: ['Predictive Threat Analysis', 'Behavioral Analytics', 'Custom Dashboards', 'Quarterly Reviews'],
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    name: 'Compliance Package',
    description: 'Ensure regulatory compliance and audit readiness',
    price: '₹12,000/month',
    features: ['GDPR Compliance', 'Security Audits', 'Compliance Reports', 'Legal Consultation'],
    icon: <BadgeCheck className="w-5 h-5" />
  },
]

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
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
const PricingCard = memo(({ plan, billingPeriod, isAnnual, index }) => {
  const router = useRouter()
  const price = isAnnual ? plan.price.annually : plan.price.monthly
  const monthlyEquivalent = isAnnual ? Math.round(plan.price.annually / 12) : plan.price.monthly
  
  const handleCtaClick = useCallback(() => {
    if (plan.id === 'enterprise') {
      router.push('/contact-sales')
    } else {
      router.push(`/register?plan=${plan.id}&billing=${billingPeriod}`)
    }
  }, [plan.id, billingPeriod, router])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={hoverScale}
      className={`relative border transition-all duration-300 ${
        plan.highlighted
          ? 'border-blue-600 shadow-xl scale-[1.02]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
      } bg-white`}
    >
      {plan.popular && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
            MOST POPULAR
          </div>
        </motion.div>
      )}
      
      <div className="p-8">
        {/* Plan Header */}
        <div className="mb-6">
          <motion.div 
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`p-3 w-fit mb-4 ${
              plan.color === 'blue' ? 'bg-blue-50' : 
              plan.color === 'purple' ? 'bg-purple-50' : 'bg-gray-50'
            }`}
          >
            {plan.icon}
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline mb-2">
            <motion.span 
              key={`${price}-${isAnnual}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-4xl font-bold text-gray-900"
            >
              ₹{price}
            </motion.span>
            <span className="text-gray-600 ml-2">
              /{isAnnual ? 'year' : 'month'}
            </span>
          </div>
          {isAnnual && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-gray-600">
                ₹{monthlyEquivalent}/month equivalent
              </span>
              <motion.span
                animate={pulseAnimation}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold"
              >
                Save 16%
              </motion.span>
            </motion.div>
          )}
          {!isAnnual && plan.id !== 'starter' && (
            <div className="text-sm text-gray-500">
              Billed monthly
            </div>
          )}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCtaClick}
          className={`w-full py-3 font-semibold mb-6 transition-all duration-300 ${
            plan.highlighted
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {plan.cta}
        </motion.button>

        {/* Features List */}
        <div className="space-y-3">
          {plan.features.map((feature, featureIndex) => (
            <motion.div 
              key={featureIndex} 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: featureIndex * 0.05 }}
            >
              <div className={`p-1 mt-0.5 ${
                feature.included 
                  ? plan.color === 'blue' ? 'text-blue-600' : 
                    plan.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                  : 'text-gray-300'
              }`}>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {feature.included ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </motion.div>
              </div>
              <span className={`text-sm ${
                feature.included ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
})

PricingCard.displayName = 'PricingCard'

const FeatureComparisonRow = memo(({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: index * 0.05 }}
    className={`grid grid-cols-4 gap-4 p-4 ${
      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
    }`}
  >
    <div className="font-medium text-gray-900">{feature.name}</div>
    <div className="text-center">
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className={`px-3 py-1 text-sm font-medium ${
          feature.starter === 'No' 
            ? 'bg-red-100 text-red-800' 
            : feature.starter === 'Basic' || feature.starter === 'Limited'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {feature.starter}
      </motion.span>
    </div>
    <div className="text-center">
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className={`px-3 py-1 text-sm font-medium ${
          feature.professional === 'No' 
            ? 'bg-red-100 text-red-800' 
            : feature.professional === 'Advanced' || feature.professional === 'Limited'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {feature.professional}
      </motion.span>
    </div>
    <div className="text-center">
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className={`px-3 py-1 text-sm font-medium ${
          feature.enterprise === 'Unlimited' || feature.enterprise === 'Full' || feature.enterprise === 'AI-Powered'
            ? 'bg-purple-100 text-purple-800'
            : feature.enterprise === 'Advanced'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {feature.enterprise}
      </motion.span>
    </div>
  </motion.div>
))

FeatureComparisonRow.displayName = 'FeatureComparisonRow'

const FAQItem = memo(({ item, isOpen, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: index * 0.1 }}
    className="border border-gray-200"
  >
    <motion.button
      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
      onClick={onClick}
      className="w-full p-6 text-left flex justify-between items-center transition-colors"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ rotate: 5 }}
          className="p-2 bg-gray-100 text-gray-700"
        >
          {item.icon}
        </motion.div>
        <h3 className="font-semibold text-gray-900">{item.question}</h3>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </motion.div>
    </motion.button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-6 pt-0">
            <p className="text-gray-600">{item.answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
))

FAQItem.displayName = 'FAQItem'

const AddonCard = memo(({ service, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.1 }}
          className="p-2 bg-gray-100 text-gray-700 w-fit mb-3"
        >
          {service.icon}
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {service.name}
        </h3>
        <p className="text-gray-600 text-sm">{service.description}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-900">{service.price}</div>
        <div className="text-sm text-gray-500">Add-on</div>
      </div>
    </div>
    
    <div className="space-y-2 mb-6">
      {service.features.map((feature, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-center gap-2"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Check className="w-4 h-4 text-gray-500" />
          </motion.div>
          <span className="text-sm text-gray-700">{feature}</span>
        </motion.div>
      ))}
    </div>
    
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full py-2 border border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300"
    >
      Add to Plan
    </motion.button>
  </motion.div>
))

AddonCard.displayName = 'AddonCard'

export default function PricingPage() {
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState('annual') // 'monthly' or 'annual'
  const [openFAQ, setOpenFAQ] = useState(null)
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  
  const isAnnual = billingPeriod === 'annual'

  const toggleFAQ = useCallback((index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }, [openFAQ])

  const handleGetStarted = useCallback(() => {
    router.push('/register')
  }, [router])

  const handleContactSales = useCallback(() => {
    router.push('/contact-sales')
  }, [router])

  // Stats for social proof
  const stats = [
    { value: '2,500+', label: 'Communities Secured' },
    { value: '99.7%', label: 'Uptime SLA' },
    { value: '4.9/5', label: 'Customer Rating' },
    { value: '24/7', label: 'Support Available' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white text-gray-900"
    >
      <Navigation />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-28 pb-16 px-4 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto text-center">
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
            <span className="text-sm font-medium text-gray-700">TRANSPARENT PRICING</span>
          </motion.div>
          
          <motion.h1 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <motion.span variants={fadeInUp} className="block text-gray-900">
              Simple, Predictable
            </motion.span>
            <motion.span variants={fadeInUp} className="block text-gray-900">
              Pricing
            </motion.span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Choose the perfect plan for your community. All plans include a 30-day free trial.
            No hidden fees, no surprises.
          </motion.p>

          {/* Stats */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={fadeInScale}
                className="text-center"
              >
                <motion.div
                  animate={pulseAnimation}
                  className="text-2xl md:text-3xl font-bold text-gray-900"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing Toggle */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-8 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-gray-200 p-1 rounded-lg inline-flex">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 font-semibold transition-all relative ${
                  billingPeriod === 'monthly'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly Billing
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-3 font-semibold transition-all relative ${
                  billingPeriod === 'annual'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual Billing
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute -top-2 -right-2 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded"
                >
                  Save 16%
                </motion.span>
              </motion.button>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center text-gray-600 text-sm mt-3"
            >
              Annual billing includes 2 months free and priority support
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Pricing Plans */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="py-16 px-4"
      >
        <div className="container mx-auto">
          <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billingPeriod={billingPeriod}
                isAnnual={isAnnual}
                index={index}
              />
            ))}
          </motion.div>

          {/* Annual Savings Note */}
          <AnimatePresence>
            {isAnnual && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto mt-12"
              >
                <div className="border border-green-200 bg-green-50 p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">
                        🎉 Annual Plan Benefits
                      </h3>
                      <p className="text-green-700 text-sm">
                        Save 16% with annual billing + get priority support and dedicated onboarding
                      </p>
                    </div>
                    <div className="text-right">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl font-bold text-green-900"
                      >
                        2 Months Free
                      </motion.div>
                      <div className="text-sm text-green-700">Compared to monthly billing</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Feature Comparison */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 bg-gray-50"
      >
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Plan Comparison</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Detailed breakdown of features across all plans
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-4 gap-4 bg-gray-900 text-white p-4"
              >
                <div className="font-semibold">Features</div>
                <div className="text-center font-semibold">Starter</div>
                <div className="text-center font-semibold">Professional</div>
                <div className="text-center font-semibold">Enterprise</div>
              </motion.div>

              {/* Rows */}
              {FEATURE_COMPARISON.slice(0, showAllFeatures ? FEATURE_COMPARISON.length : 8).map((feature, index) => (
                <FeatureComparisonRow key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>

          <AnimatePresence>
            {!showAllFeatures && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAllFeatures(true)}
                  className="px-6 py-3 border border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  Show All Features
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Add-on Services */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="py-16 px-4"
      >
        <div className="container mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Add-on Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enhance your security setup with our additional services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {ADDON_SERVICES.map((service, index) => (
              <AddonCard key={index} service={service} index={index} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="py-16 px-4 bg-gray-50"
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Everything you need to know about pricing and billing
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="space-y-4">
            {PRICING_FAQ.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                isOpen={openFAQ === index}
                onClick={() => toggleFAQ(index)}
                index={index}
              />
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-6">
              Still have questions? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/contact')}
                className="px-6 py-3 border border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                Contact Support
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/demo')}
                className="px-6 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Schedule Demo
              </motion.button>
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
              <Star className="w-4 h-4 text-gray-300" />
            </motion.div>
            <span className="text-sm font-medium text-gray-300">READY TO GET STARTED?</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            <span className="block">Secure Your Community</span>
            <span className="block">Today</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-300 mb-8"
          >
            Join thousands of communities that trust EstateSecure for their security needs.
            Start your 30-day free trial today.
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
              onClick={handleContactSales}
              className="px-8 py-3 border border-gray-600 text-gray-300 font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              Talk to Sales
              <HelpCircle className="w-4 h-4" />
            </motion.button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-sm mt-6"
          >
            No credit card required • 30-day free trial • Cancel anytime
          </motion.p>
        </div>
      </motion.section>

      <Footer />
    </motion.div>
  )
}