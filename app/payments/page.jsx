'use client'

import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import {
  CreditCard,
  Shield,
  CheckCircle,
  Lock,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Building,
  Calendar,
  Download,
  Receipt,
  Repeat,
  Smartphone,
  Wallet,
  Banknote,
  QrCode,
  Globe,
  Zap,
  Bell,
  UserCheck,
  RefreshCw,
  ExternalLink,
  Loader2,
  Copy,
  Check
} from 'lucide-react'

// Payment Methods
const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay, American Express',
    icon: <CreditCard className="w-6 h-6" />,
    processingTime: 'Instant',
    fees: '2% + GST',
    supported: true
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: <Smartphone className="w-6 h-6" />,
    processingTime: 'Instant',
    fees: 'Free',
    supported: true
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major Indian banks',
    icon: <Banknote className="w-6 h-6" />,
    processingTime: '2-3 hours',
    fees: '₹5 + GST',
    supported: true
  },
  {
    id: 'wallet',
    name: 'Wallet',
    description: 'Paytm Wallet, Amazon Pay, MobiKwik',
    icon: <Wallet className="w-6 h-6" />,
    processingTime: 'Instant',
    fees: '3% + GST',
    supported: true
  },
  {
    id: 'qr',
    name: 'QR Code',
    description: 'Scan and pay with any UPI app',
    icon: <QrCode className="w-6 h-6" />,
    processingTime: 'Instant',
    fees: 'Free',
    supported: true
  },
]

// Subscription Plans (mock data)
const SUBSCRIPTION_PLANS = {
  starter: {
    name: 'Starter',
    price: 299,
    units: '100 units',
    features: ['Basic Access Control', 'Visitor Management', 'Mobile App'],
    color: 'gray'
  },
  professional: {
    name: 'Professional',
    price: 599,
    units: '500 units',
    features: ['Advanced Features', 'CCTV Integration', 'Payment Collection'],
    color: 'blue'
  },
  enterprise: {
    name: 'Enterprise',
    price: 999,
    units: 'Unlimited',
    features: ['All Features', 'White-label', '24/7 Support'],
    color: 'purple'
  }
}

// Memoized Components
const PaymentMethodCard = memo(({ method, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'border-blue-600 bg-blue-50 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-2 ${
            isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {method.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{method.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{method.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {method.processingTime}
              </span>
              <span className="text-xs text-gray-500">
                Fees: {method.fees}
              </span>
            </div>
          </div>
        </div>
        
        {isSelected && (
          <div className="text-blue-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
})

PaymentMethodCard.displayName = 'PaymentMethodCard'

const PaymentCardForm = memo(() => {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [saveCard, setSaveCard] = useState(false)

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength="5"
            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              maxLength="4"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name on Card
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
        />
        <span className="text-sm text-gray-700">
          Save card for future payments (Securely encrypted)
        </span>
      </label>
    </div>
  )
})

PaymentCardForm.displayName = 'PaymentCardForm'

const UPIPayment = memo(() => {
  const [selectedApp, setSelectedApp] = useState('gpay')
  const [upiId, setUpiId] = useState('')
  const [generatedQR, setGeneratedQR] = useState('UPI-CODE-123456')
  const [copied, setCopied] = useState(false)

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: 'GPay' },
    { id: 'phonepe', name: 'PhonePe', icon: 'PhonePe' },
    { id: 'paytm', name: 'Paytm', icon: 'Paytm' },
    { id: 'bhim', name: 'BHIM UPI', icon: 'BHIM' },
  ]

  const handleCopyQR = async () => {
    try {
      await navigator.clipboard.writeText(generatedQR)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Select UPI App</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {upiApps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => setSelectedApp(app.id)}
              className={`p-4 border text-center transition-all ${
                selectedApp === app.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">{app.icon}</div>
              <div className="text-xs text-gray-600">{app.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your UPI ID (Optional)
        </label>
        <input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="username@upi"
          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div className="border border-gray-200 p-6 bg-gray-50">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-48 h-48 bg-white border border-gray-300 mx-auto flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-24 h-24 text-gray-700 mx-auto mb-2" />
                <p className="text-xs text-gray-600 font-mono">{generatedQR}</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Scan this QR code with any UPI app to pay
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={handleCopyQR}
              className="px-4 py-2 border border-gray-900 text-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy UPI ID'}
            </button>
            <button 
              type="button"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Send Payment Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

UPIPayment.displayName = 'UPIPayment'

const NetBanking = memo(() => {
  const [selectedBank, setSelectedBank] = useState('')

  const banks = [
    { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
    { id: 'icici', name: 'ICICI Bank', code: 'ICIC' },
    { id: 'sbi', name: 'State Bank of India', code: 'SBIN' },
    { id: 'axis', name: 'Axis Bank', code: 'UTIB' },
    { id: 'kotak', name: 'Kotak Mahindra', code: 'KKBK' },
    { id: 'yes', name: 'YES Bank', code: 'YESB' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Select Your Bank</h3>
        <div className="space-y-2">
          {banks.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => setSelectedBank(bank.id)}
              className={`w-full p-4 border text-left transition-all flex items-center justify-between ${
                selectedBank === bank.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div>
                <div className="font-medium text-gray-900">{bank.name}</div>
                <div className="text-sm text-gray-600">Code: {bank.code}</div>
              </div>
              {selectedBank === bank.id && (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border border-yellow-200 bg-yellow-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-800">
              You will be redirected to your bank's secure payment page to complete the transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

NetBanking.displayName = 'NetBanking'

const OrderSummary = memo(({ plan, billingPeriod, addons = [] }) => {
  const isAnnual = billingPeriod === 'annual'
  const planPrice = isAnnual ? plan.price * 10 : plan.price
  const monthlyEquivalent = isAnnual ? Math.round(planPrice / 12) : plan.price
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0)
  const subtotal = planPrice + addonsTotal
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + tax

  return (
    <div className="border border-gray-200 bg-white">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Plan Details */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{plan.name} Plan</h4>
              <p className="text-sm text-gray-600">{plan.units}</p>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">₹{planPrice}</div>
              <div className="text-xs text-gray-500">
                {isAnnual ? 'per year' : 'per month'}
              </div>
            </div>
          </div>
          
          {isAnnual && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">
                  Monthly equivalent
                </span>
                <span className="font-medium text-green-800">
                  ₹{monthlyEquivalent}/month
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Add-ons */}
        {addons.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Add-ons</h4>
            {addons.map((addon, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">{addon.name}</span>
                <span className="text-sm font-medium text-gray-900">₹{addon.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST (18%)</span>
            <span className="font-medium text-gray-900">₹{tax}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">₹{total}</div>
              <div className="text-sm text-gray-500">
                {isAnnual ? 'billed annually' : 'billed monthly'}
              </div>
            </div>
          </div>
        </div>

        {/* Savings */}
        {isAnnual && (
          <div className="p-3 bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                💰 You save ₹{plan.price * 2} with annual billing
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

OrderSummary.displayName = 'OrderSummary'

const PaymentStatusModal = memo(({ status, onClose }) => {
  if (!status) return null

  const statusConfig = {
    processing: {
      icon: <RefreshCw className="w-12 h-12 animate-spin text-blue-600" />,
      title: 'Processing Payment',
      message: 'Please wait while we process your payment. Do not refresh or close this page.',
      color: 'blue'
    },
    success: {
      icon: <CheckCircle className="w-12 h-12 text-green-600" />,
      title: 'Payment Successful!',
      message: 'Your payment has been processed successfully. Your account is now active.',
      color: 'green'
    },
    failed: {
      icon: <AlertCircle className="w-12 h-12 text-red-600" />,
      title: 'Payment Failed',
      message: 'We were unable to process your payment. Please try again or use a different payment method.',
      color: 'red'
    }
  }

  const config = statusConfig[status]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            {config.icon}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {config.title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {config.message}
          </p>

          <div className="flex gap-3">
            {status === 'processing' && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            
            {status === 'success' && (
              <>
                <button
                  type="button"
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex-1 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800"
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Receipt
                </button>
              </>
            )}
            
            {status === 'failed' && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = '/support'}
                  className="flex-1 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800"
                >
                  Contact Support
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

PaymentStatusModal.displayName = 'PaymentStatusModal'

// Paystack Integration Component
const PaystackIntegration = memo(({ amount, email, onSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false)

  // This would integrate with actual Paystack SDK
  const handlePaystackPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Mock Paystack integration
      // In reality, you would:
      // 1. Initialize Paystack with your public key
      // 2. Create a transaction reference
      // 3. Open Paystack modal
      
      console.log('Initiating Paystack payment...')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful response
      const mockResponse = {
        reference: 'PS_' + Date.now(),
        status: 'success',
        transaction: 'TRX_' + Math.random().toString(36).substr(2, 9),
        amount: amount * 100, // Paystack uses kobo/pesewas
        currency: 'NGN',
        message: 'Payment successful'
      }
      
      onSuccess(mockResponse)
    } catch (error) {
      console.error('Paystack payment error:', error)
      onClose()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 border border-blue-200 bg-blue-50">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Secure Payment via Paystack</h4>
            <p className="text-sm text-blue-800">
              You'll be redirected to Paystack's secure payment gateway to complete your transaction.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Amount to pay</p>
            <p className="text-2xl font-bold text-gray-900">₹{amount}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Payment Processor</div>
            <div className="font-medium text-gray-900">Paystack</div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePaystackPayment}
          disabled={isProcessing}
          className="w-full py-4 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ExternalLink className="w-5 h-5" />
              Proceed to Paystack
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to Paystack's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
})

PaystackIntegration.displayName = 'PaystackIntegration'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [usePaystack, setUsePaystack] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Get plan from URL or use default
  const planId = searchParams?.get?.('plan') || 'professional'
  const billingPeriod = searchParams?.get?.('billing') || 'annual'
  const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.professional

  // Mock addons (in real app, these would come from user selection)
  const addons = [
    { name: '24/7 Monitoring', price: 1500 },
    { name: 'Advanced Analytics', price: 800 },
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setPaymentStatus('processing')

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock success (80% success rate)
      const isSuccess = Math.random() > 0.2
      
      if (isSuccess) {
        setPaymentStatus('success')
        // In real app: Send receipt email, update user subscription, etc.
      } else {
        setPaymentStatus('failed')
      }
    } catch (error) {
      setPaymentStatus('failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaystackSuccess = (response) => {
    console.log('Paystack payment successful:', response)
    setPaymentStatus('success')
    setUsePaystack(false)
  }

  const closeModal = () => {
    setPaymentStatus(null)
    setUsePaystack(false)
  }

  const renderPaymentMethod = () => {
    if (usePaystack) {
      return (
        <PaystackIntegration
          amount={999} // Total amount
          email="user@example.com" // User's email
          onSuccess={handlePaystackSuccess}
          onClose={() => setUsePaystack(false)}
        />
      )
    }

    switch(selectedMethod) {
      case 'card':
        return <PaymentCardForm />
      case 'upi':
        return <UPIPayment />
      case 'netbanking':
        return <NetBanking />
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Select a payment method to continue</p>
          </div>
        )
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />

      <PaymentStatusModal 
        status={paymentStatus} 
        onClose={closeModal}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                type="button"
                onClick={() => router.push('/pricing')}
                className="hover:text-gray-900"
              >
                Pricing
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">Payment</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Complete Your Payment
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Secure payment powered by multiple payment gateways
                  </p>
                </div>

                {/* Payment Methods Selection */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Payment Method
                  </h2>
                  
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <PaymentMethodCard
                        key={method.id}
                        method={method}
                        isSelected={selectedMethod === method.id}
                        onClick={() => setSelectedMethod(method.id)}
                      />
                    ))}
                  </div>

                  {/* Paystack Option */}
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">
                      International Payment
                    </h3>
                    <button
                      type="button"
                      onClick={() => setUsePaystack(true)}
                      className={`w-full p-4 border transition-all text-left ${
                        usePaystack
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${
                            usePaystack ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            <Globe className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Paystack</h4>
                            <p className="text-sm text-gray-600">
                              International cards & bank transfers (Nigeria, Ghana, South Africa)
                            </p>
                          </div>
                        </div>
                        {usePaystack && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="p-6">
                  {renderPaymentMethod()}

                  {/* Security Notice */}
                  <div className="mt-8 p-4 border border-gray-200 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-gray-700 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Secure Payment
                        </h4>
                        <p className="text-sm text-gray-600">
                          Your payment information is encrypted and secure. We don't store your card details.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-gray-600">256-bit SSL</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-gray-600">PCI DSS Compliant</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  {!usePaystack && (
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full mt-6 py-4 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pay Securely
                        </>
                      )}
                    </button>
                  )}
                </form>
              </div>

              {/* Payment Processors */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Supported Payment Processors
                </h3>
                <div className="flex flex-wrap gap-4">
                  {['Razorpay', 'Stripe', 'PayPal', 'Instamojo', 'Cashfree'].map((processor) => (
                    <div
                      key={processor}
                      className="px-4 py-2 border border-gray-200 bg-white text-sm text-gray-700"
                    >
                      {processor}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <OrderSummary 
                plan={plan}
                billingPeriod={billingPeriod}
                addons={addons}
              />

              {/* Support */}
              <div className="border border-gray-200 p-6 bg-white">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:support@estatesecure.com"
                    className="flex items-center gap-3 p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Email Support</div>
                      <div className="text-sm text-gray-600">support@estatesecure.com</div>
                    </div>
                  </a>
                  <a
                    href="tel:+911234567890"
                    className="flex items-center gap-3 p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <UserCheck className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Call Us</div>
                      <div className="text-sm text-gray-600">+91 123 456 7890</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Guarantee */}
              <div className="border border-blue-200 bg-blue-50 p-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      30-Day Money-Back Guarantee
                    </h3>
                    <p className="text-sm text-blue-800">
                      Not satisfied? Get a full refund within 30 days. No questions asked.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}