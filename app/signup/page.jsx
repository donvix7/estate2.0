'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Mock invitation data for demonstration
import { 
  Building2, 
  Shield, 
  User, 
  MapPin, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  Flag
} from 'lucide-react'
import Link from 'next/link'

const CAROUSEL_IMAGES = [
  { 
    url: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=2600&auto=format&fit=crop",
    alt: "Community: Gated Community Street"
  },
  { 
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2600&auto=format&fit=crop",
    alt: "Security: Concierge & Security"
  },
  { 
    url: "https://images.unsplash.com/photo-1581578731117-e08f542e9466?q=80&w=2600&auto=format&fit=crop",
    alt: "Service: Engineering & Maintenance"
  },
  { 
    url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2600&auto=format&fit=crop",
    alt: "Amenities: Premium Fitness Center"
  }
]

const MOCK_INVITATIONS = {
  'invite_1_token': {
    id: 'invite_1',
    name: 'Test Resident',
    email: 'test@example.com',
    unitNumber: 'A-101',
    phone: '+91 9876543210',
    role: 'resident',
    estateId: 'estate_001',
    estateName: 'Sunrise Towers',
    token: 'invite_1_token',
    sentAt: '2024-01-15T10:30:00Z',
    status: 'sent',
    expiresAt: '2024-01-22T10:30:00Z',
    isValid: true
  },
  'invite_2_token': {
    id: 'invite_2',
    name: 'New Resident',
    email: 'new@example.com',
    unitNumber: 'B-202',
    phone: '+91 9876543211',
    role: 'resident',
    estateId: 'estate_001',
    estateName: 'Sunrise Towers',
    token: 'invite_2_token',
    sentAt: '2024-01-16T14:20:00Z',
    status: 'sent',
    expiresAt: '2024-01-23T14:20:00Z',
    isValid: true
  },
  'expired_token': {
    id: 'invite_3',
    name: 'Expired Resident',
    email: 'expired@example.com',
    unitNumber: 'C-303',
    phone: '+91 9876543212',
    role: 'resident',
    estateId: 'estate_001',
    estateName: 'Sunrise Towers',
    token: 'expired_token',
    sentAt: '2024-01-08T09:15:00Z',
    status: 'expired',
    expiresAt: '2024-01-15T09:15:00Z',
    isValid: false
  }
}

// Mock estate data
const MOCK_ESTATES = {
  'estate_001': {
    id: 'estate_001',
    name: 'Sunrise Towers',
    address: '123 Main Street, City',
    adminName: 'John Admin',
    adminEmail: 'admin@sunrisetowers.com',
    securityContact: '+91 9876543200',
    amenities: ['Swimming Pool', 'Gymnasium', '24/7 Security', 'Parking', 'Garden']
  },
  'estate_002': {
    id: 'estate_002',
    name: 'Lakeview Apartments',
    address: '456 Park Avenue, City',
    adminName: 'Sarah Manager',
    adminEmail: 'admin@lakeview.com',
    securityContact: '+91 9876543299',
    amenities: ['Club House', 'Play Area', 'Power Backup', 'Parking', 'Security']
  }
}

// Loading component
function SignupLoading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Loading invitation...</p>
        <p className="text-gray-600 text-sm mt-2">Please wait a moment</p>
      </div>
    </div>
  )
}

// Main component that uses useSearchParams
function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [step, setStep] = useState(1)
  const [invitation, setInvitation] = useState(null)
  const [estate, setEstate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  import('react').then(({ useEffect }) => {
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
      }, 5000)
      return () => clearInterval(timer)
    }, [])
  })

  // Signup form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    unitNumber: '',
    password: '',
    confirmPassword: '',
    emergencyContact: '',
    emergencyContactName: '',
    occupation: '',
    agreeToTerms: false,
    receiveNotifications: true
  })

  // Load invitation data based on token
  useEffect(() => {
    const loadInvitation = async () => {
      setIsLoading(true)
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (!token) {
          setError('No invitation token provided')
          setIsTokenValid(false)
          return
        }
        
        // Check if token exists in mock data
        const inviteData = MOCK_INVITATIONS[token]
        
        if (!inviteData) {
          setError('Invalid invitation link. Please contact your estate admin.')
          setIsTokenValid(false)
          return
        }
        
        // Check if invitation is expired
        const expiresAt = new Date(inviteData.expiresAt)
        const now = new Date()
        
        if (expiresAt < now) {
          setError('This invitation link has expired. Please request a new invitation.')
          setIsTokenValid(false)
          return
        }
        
        // Get estate information
        const estateData = MOCK_ESTATES[inviteData.estateId]
        
        if (!estateData) {
          setError('Estate information not found')
          setIsTokenValid(false)
          return
        }
        
        // Set data
        setInvitation(inviteData)
        setEstate(estateData)
        
        // Pre-fill form with invitation data
        setFormData(prev => ({
          ...prev,
          name: inviteData.name,
          email: inviteData.email,
          phone: inviteData.phone || '',
          unitNumber: inviteData.unitNumber || ''
        }))
        
        setIsTokenValid(true)
      } catch (err) {
        console.error('Error loading invitation:', err)
        setError('Failed to load invitation. Please try again.')
        setIsTokenValid(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadInvitation()
  }, [token])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Validate current step
  const validateStep = () => {
    const errors = {}
    
    if (step === 1) {
      if (!formData.name.trim()) errors.name = 'Name is required'
      if (!formData.email.trim()) errors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid'
      if (!formData.phone.trim()) errors.phone = 'Phone number is required'
      if (!formData.unitNumber.trim()) errors.unitNumber = 'Unit number is required'
    }
    
    if (step === 2) {
      if (!formData.password) errors.password = 'Password is required'
      else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters'
      if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm password'
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match'
    }
    
    if (step === 3) {
      if (!formData.emergencyContact.trim()) errors.emergencyContact = 'Emergency contact is required'
      if (!formData.emergencyContactName.trim()) errors.emergencyContactName = 'Emergency contact name is required'
      if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions'
    }
    
    return errors
  }

  // Handle next step
  const handleNextStep = () => {
    const errors = validateStep()
    
    if (Object.keys(errors).length === 0) {
      setStep(prev => Math.min(prev + 1, 3))
    } else {
      // Show first error
      const firstError = Object.values(errors)[0]
      alert(`Please fix the following error:\n\n${firstError}`)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateStep()
    if (Object.keys(errors).length > 0) {
      alert('Please fix all errors before submitting')
      return
    }
    
    if (!formData.agreeToTerms) {
      alert('You must agree to the terms and conditions')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would be an API call to register the user
      console.log('Registration data:', {
        ...formData,
        token: token,
        estateId: invitation.estateId,
        role: invitation.role
      })
      
      // Simulate successful registration
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?message=registration_success')
      }, 3000)
      
    } catch (err) {
      console.error('Registration error:', err)
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Loading state
  if (isLoading) {
    return <SignupLoading />
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-red-600">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Invalid Invitation</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            
            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Return to Home
              </button>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">Need help?</p>
                <p>Contact your estate admin for a new invitation link.</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
                Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline transition-all">Sign in here</Link>
            </p>
        </div>
      </div>
    </div>
  )
}

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-green-600">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Registration Successful!</h1>
            <p className="text-gray-700 mb-4">
              Welcome to <span className="font-semibold text-blue-700">{estate.name}</span>
            </p>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You will be redirected to login shortly.
            </p>
            
            <div className="animate-pulse">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Redirecting in 3 seconds...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex bg-gray-50 overflow-hidden">
      
      {/* Left Side - Image & Branding (Matching Login) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        <div
          key={currentImageIndex}
          className="absolute inset-0 z-0"
        >
          <img 
              src={CAROUSEL_IMAGES[currentImageIndex].url}
              alt={CAROUSEL_IMAGES[currentImageIndex].alt}
              className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-gray-900/90 z-10" />
      
        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md flex items-center justify-center rounded-sm shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">EstateSecure</span>
          </div>

          <div className="space-y-8">
            <div className="max-w-md bg-white/5 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Welcome to<br />
                {estate?.name || 'Your Community'}
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8 font-light">
                You've been invited to join your community's private portal. Complete your registration to access amenities, pay dues, and stay connected.
              </p>
              
              <div className="flex items-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-emerald-500/20 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>Verified Invitation</span>
                </div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-2">
              {CAROUSEL_IMAGES.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1 cursor-pointer transition-all duration-500 rounded-full ${
                    idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-sm text-white/40 font-medium">
            © {new Date().getFullYear()} EstateSecure Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative bg-white overflow-y-auto">
        <div className="absolute top-8 left-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
            </Link> 
        </div>

        <div className="max-w-xl w-full mx-auto space-y-8">
            
            {/* Progress Bar (Compact for Right Side) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                {[
                  { number: 1, label: 'Profile' },
                  { number: 2, label: 'Security' },
                  { number: 3, label: 'Finish' }
                ].map((item) => (
                   <div key={item.number} className="flex flex-col items-center gap-1 flex-1 relative">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                            step > item.number ? 'bg-gray-900 text-white' : 
                            step === item.number ? 'bg-gray-900 text-white ring-4 ring-gray-100' : 
                            'bg-gray-100 text-gray-400'
                       }`}>
                           {step > item.number ? <CheckCircle2 className="w-4 h-4" /> : item.number}
                       </div>
                       <div className={`text-[10px] font-semibold tracking-wider uppercase hidden sm:block ${step >= item.number ? 'text-gray-900' : 'text-gray-400'}`}>
                           {item.label}
                       </div>
                       {item.number < 3 && (
                           <div className={`absolute top-4 left-1/2 w-full h-[2px] z-0 ${step > item.number ? 'bg-gray-900' : 'bg-gray-100'}`} />
                       )}
                   </div>
                ))}
              </div>
            </div>

            <div className="text-center lg:text-left mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-700 mb-3 tracking-tight">
                    {step === 1 && 'Personal Information'}
                    {step === 2 && 'Account Setup'}
                    {step === 3 && 'Final Steps'}
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    {step === 1 && 'Please verify and update your personal details.'}
                    {step === 2 && 'Create secure credentials for your account.'}
                    {step === 3 && 'Complete your registration with these important details.'}
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                            required
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                            required
                            placeholder="+91 9876543210"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">
                            Unit Number *
                          </label>
                          <input
                            type="text"
                            name="unitNumber"
                            value={formData.unitNumber}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">
                            Occupation
                          </label>
                          <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                            placeholder="e.g., Software Engineer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Account Setup */}
                  {step === 2 && (
                    <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">
                            Create Password *
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                            required
                            placeholder="At least 8 characters"
                          />
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-600">Password must contain:</p>
                            <ul className="text-xs text-gray-600 list-disc list-inside">
                              <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                                At least 8 characters
                              </li>
                              <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                                One uppercase letter
                              </li>
                              <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                                One number
                              </li>
                              <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                                One special character
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">
                            Confirm Password *
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                            required
                          />
                          {formData.password && formData.confirmPassword && (
                            <p className={`text-xs mt-2 ${
                              formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formData.password === formData.confirmPassword 
                                ? '✓ Passwords match' 
                                : '✗ Passwords do not match'
                              }
                            </p>
                          )}
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Password Requirements</h4>
                          <p className="text-sm text-blue-800">
                            Your password will be used to access the EstateSecure portal, mobile app, 
                            and all community services. Choose a strong password that you don't use elsewhere.
                          </p>
                        </div>
                    </div>
                  )}

                  {/* Step 3: Final Steps */}
                  {step === 3 && (
                    <div className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-800">
                              Emergency Contact Name *
                            </label>
                            <input
                              type="text"
                              name="emergencyContactName"
                              value={formData.emergencyContactName}
                              onChange={handleInputChange}
                              className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                              required
                              placeholder="Full name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-800">
                              Emergency Contact Number *
                            </label>
                            <input
                              type="tel"
                              name="emergencyContact"
                              value={formData.emergencyContact}
                              onChange={handleInputChange}
                              className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                              required
                              placeholder="+91 9876543210"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg">
                          <h4 className="font-semibold text-red-900 mb-2">⚠️ Important Notice</h4>
                          <p className="text-sm text-red-800">
                            Emergency contact information is critical for your safety. 
                            This information will be used by security personnel in case of emergencies.
                            Please ensure it's accurate and up-to-date.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              id="receiveNotifications"
                              name="receiveNotifications"
                              checked={formData.receiveNotifications}
                              onChange={handleInputChange}
                              className="mt-1 mr-3"
                            />
                            <label htmlFor="receiveNotifications" className="text-gray-700">
                              I want to receive important notifications, security alerts, and community updates via email and SMS.
                            </label>
                          </div>

                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              id="agreeToTerms"
                              name="agreeToTerms"
                              checked={formData.agreeToTerms}
                              onChange={handleInputChange}
                              className="mt-1 mr-3"
                              required
                            />
                            <label htmlFor="agreeToTerms" className="text-gray-700">
                              I agree to the{' '}
                              <a href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                                Terms of Service
                              </a>
                              {' '}and{' '}
                              <a href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                                Privacy Policy
                              </a>
                              . I confirm that all information provided is accurate and I am authorized to reside at {estate?.name}.
                            </label>
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">🎉 Almost There!</h4>
                          <p className="text-sm text-green-800">
                            After completing registration, you'll gain access to:
                          </p>
                          <ul className="text-sm text-green-800 mt-2 space-y-1">
                            <li>• Visitor management system</li>
                            <li>• Community announcements</li>
                            <li>• Digital payments for dues</li>
                            <li>• Emergency alert system</li>
                            <li>• Staff management portal</li>
                          </ul>
                        </div>
                      </div>
                  )}
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-8">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-700 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                       >
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md transition-all"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.agreeToTerms}
                        className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Account...
                          </span>
                        ) : (
                          'Complete Registration'
                        )}
                      </button>
                    )}
                  </div>
                </form>

                {/* Step Indicator */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Step {step} of 3 • {Math.round((step / 3) * 100)}% complete
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                  Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline transition-all">Sign in here</Link>
                </p>
            </div>
        </div>
      </div>
  )
}

// Main export with Suspense wrapper
export default function ResidentSignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupContent />
    </Suspense>
  )
}