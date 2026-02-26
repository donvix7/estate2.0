'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building, 
  User, 
  MapPin, 
  Shield, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Building2,
  Lock,
  Flag
} from 'lucide-react'

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

export default function EstateRegistrationPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    estateName: '',
    estateType: 'apartment',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    countryCode: '+234',
    managementType: 'owner',
    
    totalUnits: '',
    securityContacts: '',
    amenities: [],
    
    username: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()
  
  const estateTypes = [
    { value: 'apartment', label: 'Apartment Complex' },
    { value: 'gated', label: 'Gated Community' },
    { value: 'townhouse', label: 'Townhouse Society' },
    { value: 'villa', label: 'Villa Complex' },
    { value: 'cooperative', label: 'Cooperative Housing' }
  ]

  const managementTypes = [
    { value: 'owner', label: 'Self-Managed by Owner' },
    { value: 'association', label: 'Residents Association' },
    { value: 'professional', label: 'Professional Management' }
  ]

  const amenitiesList = [
    'Swimming Pool', 'Gymnasium', 'Club House', 'Children Play Area',
    'Security 24/7', 'Power Backup', 'Garden/Park', 'Sports Complex', 'Visitor Parking'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const validateStep = () => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.estateName.trim()) newErrors.estateName = 'Estate name is required'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
    }

    if (step === 2) {
      if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required'
      if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) newErrors.adminEmail = 'Invalid email format'
      if (!formData.adminPhone.trim()) newErrors.adminPhone = 'Phone number is required'
    }

    if (step === 3) {
      if (!formData.totalUnits || formData.totalUnits < 1) newErrors.totalUnits = 'Number of units is required'
      if (!formData.securityContacts.trim()) newErrors.securityContacts = 'Security contact is required'
    }

    if (step === 4) {
      if (!formData.username.trim()) newErrors.username = 'Username is required'
      if (!formData.password) newErrors.password = 'Password is required'
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    
    if (validateStep()) {
      setIsSubmitting(true)
      try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed')
        }
        
        router.push('/login?registered=true')
      } catch (error) {
        console.error('Registration failed:', error)
        setSubmitError(error.message || 'Registration failed. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const progressSteps = [
    { number: 1, label: 'Estate Details', icon: <Building2 className="w-4 h-4" /> },
    { number: 2, label: 'Management', icon: <User className="w-4 h-4" /> },
    { number: 3, label: 'Configuration', icon: <Shield className="w-4 h-4" /> },
    { number: 4, label: 'Account', icon: <Lock className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen w-full flex bg-gray-50 overflow-hidden">
      
      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative bg-white overflow-y-auto">
        <div className="absolute top-8 left-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
            </Link> 
        </div>

        <div className="max-w-xl w-full mx-auto mt-10 space-y-8">
            
            {/* Progress Bar (Compact for Right Side) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                {progressSteps.map((item) => (
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
                       {item.number < 4 && (
                           <div className={`absolute top-4 left-1/2 w-full h-[2px] z-0 ${step > item.number ? 'bg-gray-900' : 'bg-gray-100'}`} />
                       )}
                   </div>
                ))}
              </div>
            </div>

            <div className="text-center lg:text-left mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-700 mb-3 tracking-tight">
                    {step === 1 && 'Tell us about your estate'}
                    {step === 2 && 'Who will manage this account?'}
                    {step === 3 && 'Configure your security'}
                    {step === 4 && 'Create your admin account'}
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    {step === 1 && 'We need some basic details to get you set up.'}
                    {step === 2 && 'Provide contact details for the primary administrator.'}
                    {step === 3 && 'Help us tailor the experience to your needs.'}
                    {step === 4 && 'Secure your account with a strong password.'}
                </p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border-red-200 text-red-700 flex items-start gap-3 rounded-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-sm">{submitError}</span>
              </div>
            )}

            <form 
              onSubmit={handleSubmit} 
              className="space-y-6 bg-gray-100 p-6 rounded-lg"
            >
              
              {/* STEP 1: BASIC INFO */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Estate Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="estateName"
                        value={formData.estateName}
                        onChange={handleChange}
                        className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                          errors.estateName ? ' border-red-500' : ' border-gray-200'
                        }`}
                        placeholder="e.g. Royal Gardens"
                      />
                      {errors.estateName && <p className="text-red-600 text-xs">{errors.estateName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Estate Type</label>
                      <select
                        name="estateType"
                        value={formData.estateType}
                        onChange={handleChange}
                        className="w-full p-3.5 bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-800"
                      >
                        {estateTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all resize-none placeholder:text-gray-400 text-gray-800 ${
                          errors.address ? ' border-red-500' : ' border-gray-200'
                        }`}
                        placeholder="Full street address"
                      />
                      {errors.address && <p className="text-red-600 text-xs">{errors.address}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                                errors.city ? ' border-red-500' : ' border-gray-200'
                                }`}
                                placeholder="City"
                            />
                        </div>
                        {errors.city && <p className="text-red-600 text-xs">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">State/Province</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full p-3.5 bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-800"
                        placeholder="State"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: MANAGEMENT */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Administrator Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="adminName"
                        value={formData.adminName}
                        onChange={handleChange}
                        className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                          errors.adminName ? ' border-red-500' : ' border-gray-200'
                        }`}
                        placeholder="Full Name"
                      />
                      {errors.adminName && <p className="text-red-600 text-xs">{errors.adminName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Management Type</label>
                      <select
                        name="managementType"
                        value={formData.managementType}
                        onChange={handleChange}
                        className="w-full p-3.5 bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all text-gray-800"
                      >
                        {managementTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Official Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                          errors.adminEmail ? ' border-red-500' : ' border-gray-200'
                        }`}
                        placeholder="admin@estate.com"
                      />
                      {errors.adminEmail && <p className="text-red-600 text-xs">{errors.adminEmail}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                      <div className="flex">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          className="bg-white border-gray-200 border-r-0 rounded-l-xl px-3 focus:outline-none text-gray-800 text-sm font-medium shadow-sm focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all"
                        >
                          <option value="+234">NG (+234)</option>
                          <option value="+1">US (+1)</option>
                          <option value="+91">IN (+91)</option>
                        </select>
                        <input
                          type="tel"
                          name="adminPhone"
                          value={formData.adminPhone}
                          onChange={handleChange}
                          className={`flex-1 p-3.5 bg-white   rounded-r-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                            errors.adminPhone ? ' border-red-500' : ' border-gray-200'
                          }`}
                          placeholder="801 234 5678"
                        />
                      </div>
                      {errors.adminPhone && <p className="text-red-600 text-xs">{errors.adminPhone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIGURATION */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Total Units/Homes <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        name="totalUnits"
                        value={formData.totalUnits}
                        onChange={handleChange}
                        min="1"
                        className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                          errors.totalUnits ? ' border-red-500' : ' border-gray-200'
                        }`}
                        placeholder="e.g. 120"
                      />
                      {errors.totalUnits && <p className="text-red-600 text-xs">{errors.totalUnits}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Security Desk Phone <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        name="securityContacts"
                        value={formData.securityContacts}
                        onChange={handleChange}
                        className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                          errors.securityContacts ? ' border-red-500' : ' border-gray-200'
                        }`}
                        placeholder="Emergency contact"
                      />
                      {errors.securityContacts && <p className="text-red-600 text-xs">{errors.securityContacts}</p>}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <label className="text-sm font-medium text-gray-700">Amenities & Facilities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map(amenity => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityChange(amenity)}
                          className={`p-3 text-sm font-medium transition-all rounded-xl   shadow-sm ${
                            formData.amenities.includes(amenity)
                            ? 'bg-gray-900 border-gray-900 text-white'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: ACCOUNT */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Username <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                          errors.username ? ' border-red-500' : ' border-gray-200'
                        }`}
                        placeholder="Choose a unique username"
                      />
                      {errors.username && <p className="text-red-600 text-xs">{errors.username}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                            errors.password ? ' border-red-500' : ' border-gray-200'
                          }`}
                          placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                            errors.confirmPassword ? ' border-red-500' : ' border-gray-200'
                          }`}
                          placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="flex items-start gap-3 p-4 bg-white border-gray-200 rounded-xl shadow-sm cursor-pointer hover:border-gray-300 hover:bg-gray-50/50 transition-all">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          className="mt-1 w-5 h-5 bg-white border-gray-300 text-gray-900 focus:ring-gray-900 rounded-md shadow-sm transition-all"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>. I confirm I am an authorized representative of this estate.
                        </span>
                      </label>
                      {errors.termsAccepted && <p className="text-red-600 text-xs mt-2 ml-1">{errors.termsAccepted}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-all rounded-lg ${
                    step === 1 
                    ? 'opacity-0 cursor-default' 
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {step < 4 ? (
                  <button
                    
                    
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 text-gray-600 font-medium hover:text-gray-900 transition-all rounded-lg"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    
                    
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all rounded-lg disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-gray-900/25"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {isSubmitting ? 'Processing...' : 'Complete Registration'}
                  </button>
                )}
              </div>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
                Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline transition-all">Sign in here</Link>
            </p>
          </div>
      </div>
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
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md flex items-center justify-center rounded-sm border-white/20 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">EstateSecure</span>
          </div>

          <div className="space-y-8">
            <div className="max-w-md bg-white/5 backdrop-blur-sm p-8 rounded-lg border-white/10 shadow-2xl">
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Secure Living,<br />
                Simplified Management.
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8 font-light">
                Experience the next generation of community living. 
                Advanced security, seamless payments, and instant communication 
                all in one professional dashboard.
              </p>
              
              <div className="flex items-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-emerald-500/20 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-emerald-500/20 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>24/7 Monitoring</span>
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

    </div>
  )
}