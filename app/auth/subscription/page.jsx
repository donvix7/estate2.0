'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Crown, 
  Shield, 
  Home, 
  Clock, 
  Star,
  ArrowRight,
  CreditCard,
  Building2,
  MessageSquare,
  AlertCircle,
  Heart,
  ShieldCheck,
  Lock,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  Check,
  Sparkles,
  Wallet
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import StatsCard from '@/components/StatsCard'
import { getSubscriptions } from '@/lib/service'

export default function SubscriptionPlansPage() {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState([])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getSubscriptions()
      if(data?.data){
        setPlans(data.data)
      }
    } catch (error) {
      console.error(error);
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
/*
  const plans = [
    {
      id: 'essential',
      name: 'Essential',
      price: 0,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Essential features for individual residents',
      icon: Home,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-white dark:bg-gray-800/50',
      borderColor: 'border-gray-200 dark:border-gray-700',
      popular: false,
      features: [
        { name: 'Access to resident portal', included: true },
        { name: 'Pay service charges', included: true },
        { name: 'View announcements', included: true },
        { name: 'Submit maintenance requests', included: true },
        { name: '24/7 emergency support', included: true },
        { name: 'Visitor management', included: false },
        { name: 'Premium support', included: false },
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 4.99,
      monthlyPrice: 4.99,
      yearlyPrice: 3.99,
      description: 'Enhanced features for active community members',
      icon: Star,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-[#1241a1] dark:bg-[#1241a1]',
      borderColor: 'border-[#1241a1]',
      popular: true,
      badge: 'Most Popular',
      features: [
        { name: 'Access to resident portal', included: true },
        { name: 'Pay service charges', included: true },
        { name: 'View announcements', included: true },
        { name: 'Submit maintenance requests', included: true },
        { name: '24/7 emergency support', included: true },
        { name: 'Visitor management', included: true },
        { name: 'Premium support', included: true },
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 9.99,
      monthlyPrice: 9.99,
      yearlyPrice: 7.99,
      description: 'Complete solution for property owners and investors',
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-white dark:bg-gray-800/50',
      borderColor: 'border-gray-200 dark:border-gray-700',
      popular: false,
      features: [
        { name: 'Access to resident portal', included: true },
        { name: 'Pay service charges', included: true },
        { name: 'View announcements', included: true },
        { name: 'Submit maintenance requests', included: true },
        { name: '24/7 emergency support', included: true },
        { name: 'Visitor management', included: true },
        { name: 'Premium support', included: true },
      ]
    }
  ]
*/
  const getDisplayPrice = (plan) => {
    if (billingCycle === 'monthly') {
      return plan.monthlyPrice
    }
    return plan.yearlyPrice
  }

  const getPriceLabel = () => {
    return billingCycle === 'monthly' ? '/month' : '/year'
  }

  const getSavings = () => {
    return billingCycle === 'yearly' ? 'Save 20%' : 'Cancel anytime'
  }

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId)
    // Navigate to checkout or open modal
    console.log(`Selected plan: ${planId}`)
  }

  // Calculate stats
  const totalSubscribers = 1247
  const avgRating = 4.9
  const satisfactionRate = 98

  return (
    <div className="p-6 mmx-auto animate-fade-in bg-white dark:bg-black">
      {/* Header */}
      <PageHeader 
        title="Subscription Plans" 
        description="Choose the perfect plan for your estate living experience."
        icon={Crown}
        iconColor="amber"
      >
        <a 
          href="/dashboard"
          className="flex items-center gap-2 bg-amber-700 hover:brightness-110 text-white px-5 py-2.5 rounded-md font-semibold transition-all active:scale-95 border-none"
         
        >
          <Sparkles className="w-5 h-5" />
          Compare Plans
        </a>
      </PageHeader>
{/* Trust Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShieldCheck, label: 'Secure Payments', sub: '256-bit encryption' },
          { icon: Clock, label: '24/7 Support', sub: 'Always here to help' },
          { icon: RefreshCw, label: 'Flexible Plans', sub: 'Change anytime' },
          { icon: Heart, label: '100% Satisfaction', sub: 'Love it or get refund' }
        ].map((item, idx) => (
          <div key={idx} className="rounded-md p-4 text-center bg-slate-600/20">
            <item.icon className="w-6 h-6 text-amber-700 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.label}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{item.sub}</p>
          </div>
        ))}
      </div>
     

      {/* Billing Toggle */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="p-1 rounded-md inline-flex items-center borderborder-amber-700 gap-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all border-none ${
              billingCycle === 'monthly'
                ? 'bg-amber-700 text-white '
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all border-none flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-amber-700 text-white'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Yearly
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {getSavings()}
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {plans.length > 0 ? ( plans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          const displayPrice = getDisplayPrice(plan)
          const isFree = displayPrice === 0

          return (
            <div
              key={plan.id}
              className={`relative rounded-md transition-all duration-300 ${
                plan.popular
                  ? 'bg-slate-900 dark:bg-white/20 text-white  shadow-lg shadow-slate-900/20'
                  : 'bg-slate-800/30 dark:bg-slate-500/20 border '
              } ${plan.popular ? 'lg:scale-105' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-700 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/30">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col h-full">
                {/* Plan Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-md ${
                      plan.popular 
                        ? 'bg-white/20' 
                        : 'bg-[#1241a1]/10 dark:bg-slate-900'
                    }`}>
                      <plan.icon className={`w-5 h-5 ${
                        plan.popular ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                      }`} />
                    </div>
                    <span className={`text-lg font-bold ${
                      plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {plan.name}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    plan.popular ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${
                    plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {isFree ? 'Free' : `$${displayPrice}`}
                  </span>
                  {!isFree && (
                    <span className={`text-sm ${
                      plan.popular ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {getPriceLabel()}
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-white' : 'text-amber-700'
                        }`} />
                      ) : (
                        <div className={`w-4 h-4 border-2 rounded-full flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'border-white/40' : 'border-gray-300 dark:border-gray-600'
                        }`} />
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? plan.popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                          : plan.popular ? 'text-white/50' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-md font-semibold text-sm transition-all active:scale-95 border-none ${
                    isSelected
                      ? 'bg-amber-700 text-white hover:bg-amber-700'
                      : plan.popular
                      ? 'bg-amber-700 hover:bg-amber-800'
                      : 'bg-slate-900 text-white hover:bg-amber-700 hover:text-white'
                  }`}
                >
                  {isSelected ? '✓ Current Plan' : isFree ? 'Get Started' : 'Select Plan'}
                </button>

                {/* Guarantee */}
                <p className={`text-[10px] text-center mt-3 ${
                  plan.popular ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  <Lock className="w-3 h-3 inline mr-1" />
                  Secure. Cancel anytime.
                </p>
              </div>
            </div>
          )
        }))
        :(<div className="flex items-center col-span-3 bg-slate-600/20 dark:bg-slate-600/10 justify-center h-64">
          <p className="text-white">No plans found</p>
        </div>)}
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-gray-600/10 rounded-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Compare Plans</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Find the perfect fit for your needs
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-700" />
          </div>
        </div>
        
        <div className="overflow-x-auto p-6">
          <table className="w-full dark:bg-slate-800">
            <thead>
              <tr className="">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Features
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center py-3 px-4 text-sm font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <plan.icon className={`w-4 h-4 ${
                        plan.popular ? 'text-slate-900' : 'text-gray-500'
                      }`} />
                      <span className={plan.popular ? 'text-slate-900' : 'text-gray-700 dark:text-gray-300'}>
                        {plan.name}
                      </span>
                    </div>
                    {plan.popular && (
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold block mt-1">
                        ★ Popular
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                'Access to resident portal',
                'Pay service charges',
                'View announcements',
                'Submit maintenance requests',
                '24/7 emergency support',
                'Visitor management',
                'Premium support',
              ].map((feature, idx) => (
                <tr key={idx} className="border-b dark:border-gray-400 ">
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {feature}
                  </td>
                  {plans.map((plan) => {
                    const included = plan.features.find(f => f.name === feature)?.included
                    return (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {included ? (
                          <Check className="w-5 h-5 text-amber-700 mx-auto" />
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#1241a1]/10 dark:bg-[#1241a1]/20 rounded-md">
            <MessageSquare className="w-5 h-5 text-amber-700" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">Frequently Asked Questions</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              q: 'Can I change my plan later?',
              a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
            },
            {
              q: 'What payment methods are accepted?',
              a: 'We accept all major credit cards, debit cards, and bank transfers. All payments are securely processed.'
            },
            {
              q: 'Is there a setup fee?',
              a: 'No, all plans are free to set up. You only pay the subscription fee for the services you choose.'
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes, you can cancel your subscription at any time. No cancellation fees or penalties apply.'
            }
          ].map((faq, idx) => (
            <div 
              key={idx}
              className="bg-slate-200/70 dark:bg-slate-600/20 rounded-md p-5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{faq.q}</span>
                  <p className="text-sm text-slate-900 dark:text-slate-400">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
       {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Active Subscribers" 
          value={totalSubscribers.toLocaleString()} 
          icon={Users} 
          color="blue" 
        />
        <StatsCard 
          title="Average Rating" 
          value={`${avgRating}/5`} 
          icon={Star} 
          color="amber" 
        />
        <StatsCard 
          title="Satisfaction Rate" 
          value={`${satisfactionRate}%`} 
          icon={Heart} 
          color="green" 
        />
      </div>

      


      {/* CTA Section */}
      <div className="bg-slate-600/20 rounded-md p-8 text-slate-900 dark:text-slate-400 text-center">
        <span className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Ready to upgrade your experience?</span>
        <p className="text-slate-900 dark:text-slate-400 mb-6 ">
          Join thousands of satisfied residents enjoying premium estate management services.
        </p>
        <button className="bg-slate-600/20 dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-3 rounded-md font-semibold hover:bg-amber-700 transition-all active:scale-95">
          Get Started Today
          <ArrowRight className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  )
}