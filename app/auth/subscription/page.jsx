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
  Wallet,
  MoreHorizontal,
  Circle,
  CheckCircle2
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import StatsCard from '@/components/StatsCard'
import { getSubscriptions } from '@/lib/service'

// Trading-style stat card component
const StatCard = ({ label, value, icon, change }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">{label}</span>
        <span className="text-[#8a8f98]">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-xl font-bold text-white">{value}</span>
        {change !== undefined && change !== null && (
          <span className={`text-xs font-semibold ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-[#8a8f98]'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );
};

// Trust indicator component
const TrustIndicator = ({ icon: Icon, label, sub }) => (
  <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-4 text-center">
    <Icon className="w-5 h-5 text-[#1241a1] mx-auto mb-2" />
    <p className="text-xs font-semibold text-white">{label}</p>
    <p className="text-[10px] text-[#8a8f98]">{sub}</p>
  </div>
);

// Plan card component
const PlanCard = ({ plan, isSelected, billingCycle, onSelect }) => {
  const displayPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  const isFree = displayPrice === 0
  const isPopular = plan.popular

  return (
    <div className={`relative rounded-xl border transition-all duration-300 ${
      isPopular
        ? 'bg-[#1a1d23] border-[#1241a1] shadow-lg shadow-[#1241a1]/10'
        : 'bg-[#1a1d23] border-[#2a2d33] hover:border-[#3a3d43]'
    } ${isPopular ? 'lg:scale-105' : ''}`}>
      
      {/* Popular Badge */}
      {isPopular && plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#1241a1] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-[#1241a1]/30">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        {/* Plan Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${
              isPopular 
                ? 'bg-[#1241a1]/20' 
                : 'bg-[#2a2d33]'
            }`}>
              <plan.icon className={`w-5 h-5 ${
                isPopular ? 'text-[#1241a1]' : 'text-[#8a8f98]'
              }`} />
            </div>
            <span className={`text-lg font-bold text-white`}>
              {plan.name}
            </span>
          </div>
          <p className={`text-sm text-[#8a8f98]`}>
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6 flex items-baseline gap-1">
          <span className={`text-3xl font-bold text-white`}>
            {isFree ? 'Free' : `$${displayPrice}`}
          </span>
          {!isFree && (
            <span className={`text-sm text-[#8a8f98]`}>
              {billingCycle === 'monthly' ? '/month' : '/year'}
            </span>
          )}
          {billingCycle === 'yearly' && !isFree && (
            <span className="ml-2 text-[10px] font-bold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2.5 flex-1 mb-6">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              {feature.included ? (
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#1241a1]" />
              ) : (
                <div className="w-4 h-4 border-2 border-[#2a2d33] rounded-full flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${
                feature.included ? 'text-white' : 'text-[#8a8f98]'
              }`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>

        {/* Select Button */}
        <button
          onClick={() => onSelect(plan.id)}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border-none ${
            isSelected
              ? 'bg-[#1241a1] text-white'
              : isPopular
              ? 'bg-[#1241a1] hover:bg-[#1a51b1] text-white'
              : 'bg-[#2a2d33] hover:bg-[#3a3d43] text-white'
          }`}
        >
          {isSelected ? '✓ Current Plan' : isFree ? 'Get Started' : 'Select Plan'}
        </button>

        {/* Guarantee */}
        <p className={`text-[10px] text-center mt-3 text-[#8a8f98]`}>
          <Lock className="w-3 h-3 inline mr-1" />
          Secure. Cancel anytime.
        </p>
      </div>
    </div>
  )
};

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

  const getSavings = () => {
    return billingCycle === 'yearly' ? 'Save 20% with annual billing' : 'Cancel anytime, no fees'
  }

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId)
    console.log(`Selected plan: ${planId}`)
  }

  // Stats
  const totalSubscribers = 1247
  const avgRating = 4.9
  const satisfactionRate = 98

  return (
    <div className="min-h-screen bg-[#0d0f13] p-6 animate-in fade-in duration-700 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscription Plans</h1>
          <p className="text-[#8a8f98] text-sm font-medium">Choose the perfect plan for your estate living experience.</p>
        </div>
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 bg-[#1241a1] hover:bg-[#1a51b1] text-white px-5 py-2.5 rounded-xl font-semibold transition-all border-none"
        >
          <Sparkles className="w-5 h-5" />
          Compare Plans
        </Link>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <TrustIndicator icon={ShieldCheck} label="Secure Payments" sub="256-bit encryption" />
        <TrustIndicator icon={Clock} label="24/7 Support" sub="Always here to help" />
        <TrustIndicator icon={RefreshCw} label="Flexible Plans" sub="Change anytime" />
        <TrustIndicator icon={Heart} label="100% Satisfaction" sub="Love it or get refund" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard 
          label="Active Subscribers" 
          value={totalSubscribers.toLocaleString()} 
          icon={<Users className="size-4" />}
          change={12.5}
        />
        <StatCard 
          label="Average Rating" 
          value={`${avgRating}/5`} 
          icon={<Star className="size-4" />}
          change={4.8}
        />
        <StatCard 
          label="Satisfaction Rate" 
          value={`${satisfactionRate}%`} 
          icon={<Heart className="size-4" />}
          change={2.3}
        />
      </div>

      {/* Billing Toggle */}
      <div className="flex flex-col items-center gap-3">
        <div className="bg-[#1a1d23] border border-[#2a2d33] rounded-xl p-1 inline-flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all border-none ${
              billingCycle === 'monthly'
                ? 'bg-[#1241a1] text-white'
                : 'text-[#8a8f98] hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all border-none flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-[#1241a1] text-white'
                : 'text-[#8a8f98] hover:text-white'
            }`}
          >
            Yearly
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
        <p className="text-xs text-[#8a8f98]">{getSavings()}</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              billingCycle={billingCycle}
              onSelect={handleSelectPlan}
            />
          ))
        ) : (
          <div className="col-span-3 bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <Crown className="size-12 text-[#8a8f98] opacity-30" />
              <p className="font-bold text-white">No plans found</p>
              <p className="text-sm text-[#8a8f98]">Subscription plans will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
        <div className="p-4 border-b border-[#2a2d33]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <TrendingUp className="size-5 text-[#1241a1]" />
                Compare Plans
              </h3>
              <p className="text-sm text-[#8a8f98] mt-0.5">Find the perfect fit for your needs</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2a2d33]">
              <tr>
                <th className="text-left py-3 px-4 text-[10px] font-bold text-[#8a8f98] uppercase tracking-wider">
                  Features
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center py-3 px-4 text-[10px] font-bold text-[#8a8f98] uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <plan.icon className="w-4 h-4 text-[#1241a1]" />
                      <span className="text-white">{plan.name}</span>
                    </div>
                    {plan.popular && (
                      <span className="text-[10px] bg-[#1241a1]/20 text-[#1241a1] px-2 py-0.5 rounded-full font-bold block mt-1">
                        ★ Popular
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2d33]">
              {[
                'Access to resident portal',
                'Pay service charges',
                'View announcements',
                'Submit maintenance requests',
                '24/7 emergency support',
                'Visitor management',
                'Premium support',
              ].map((feature, idx) => (
                <tr key={idx} className="hover:bg-[#2a2d33]/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-[#8a8f98] font-medium">
                    {feature}
                  </td>
                  {plans.map((plan) => {
                    const included = plan.features.find(f => f.name === feature)?.included
                    return (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {included ? (
                          <Check className="w-5 h-5 text-[#1241a1] mx-auto" />
                        ) : (
                          <span className="text-[#2a2d33]">—</span>
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
      <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
        <div className="p-4 border-b border-[#2a2d33]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1241a1]/10 rounded-xl">
              <MessageSquare className="w-5 h-5 text-[#1241a1]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Frequently Asked Questions</h3>
              <p className="text-sm text-[#8a8f98]">Quick answers to common questions</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
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
              className="bg-[#2a2d33] rounded-xl p-4 hover:bg-[#3a3d43] transition-colors"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-[#1241a1] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-white mb-1">{faq.q}</p>
                  <p className="text-sm text-[#8a8f98] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-[#1241a1]/10 rounded-full">
            <Crown className="w-8 h-8 text-[#1241a1]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Ready to upgrade your experience?</h2>
            <p className="text-[#8a8f98] mt-1">Join thousands of satisfied residents enjoying premium estate management services.</p>
          </div>
          <button className="bg-[#1241a1] hover:bg-[#1a51b1] text-white px-8 py-3 rounded-xl font-bold transition-all border-none flex items-center gap-2">
            Get Started Today
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}