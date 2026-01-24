'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import { 
  Building, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react'

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
            headers: {
                'Content-Type': 'application/json',
            },
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
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Management' },
    { number: 3, label: 'Configuration' },
    { number: 4, label: 'Account' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
              Estate Registration
            </h1>
            <p className="text-gray-600">Complete this form to register your estate for our security management system</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center relative mb-4">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-900 -z-10 transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>

              {progressSteps.map((item) => (
                <div key={item.number} className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-10 h-10 flex items-center justify-center font-medium border-2 transition-all ${
                      step >= item.number
                      ? 'bg-gray-900 border-gray-900 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                    }`}
                  >
                    {step > item.number ? <CheckCircle className="w-5 h-5" /> : item.number}
                  </div>
                  <span className={`text-xs font-medium ${step >= item.number ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8">
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: BASIC INFO */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Building className="text-gray-600 w-5 h-5" /> Estate Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Estate Name *</label>
                      <input
                        type="text"
                        name="estateName"
                        value={formData.estateName}
                        onChange={handleChange}
                        className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                          errors.estateName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        }`}
                        placeholder="e.g. Royal Gardens"
                      />
                      {errors.estateName && <p className="text-red-600 text-xs mt-1">{errors.estateName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Estate Type</label>
                      <select
                        name="estateType"
                        value={formData.estateType}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-gray-900"
                      >
                        {estateTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Address *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all resize-none ${
                          errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        }`}
                        placeholder="Full street address"
                      />
                      {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                          errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        placeholder="State"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: MANAGEMENT */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="text-gray-600 w-5 h-5" /> Management Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Admin Name *</label>
                      <input
                        type="text"
                        name="adminName"
                        value={formData.adminName}
                        onChange={handleChange}
                        className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                          errors.adminName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        }`}
                        placeholder="Full Name"
                      />
                      {errors.adminName && <p className="text-red-600 text-xs mt-1">{errors.adminName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Management Type</label>
                      <select
                        name="managementType"
                        value={formData.managementType}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-gray-900"
                      >
                        {managementTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Admin Email *</label>
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                          errors.adminEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        }`}
                        placeholder="admin@estate.com"
                      />
                      {errors.adminEmail && <p className="text-red-600 text-xs mt-1">{errors.adminEmail}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Admin Phone *</label>
                      <div className="flex">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          className="bg-white border border-gray-300 border-r-0 px-3 focus:outline-none text-gray-900"
                        >
                          <option value="+234">+234</option>
                          <option value="+1">+1</option>
                          <option value="+91">+91</option>
                        </select>
                        <input
                          type="tel"
                          name="adminPhone"
                          value={formData.adminPhone}
                          onChange={handleChange}
                          className={`flex-1 p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                            errors.adminPhone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                          }`}
                          placeholder="Phone Number"
                        />
                      </div>
                      {errors.adminPhone && <p className="text-red-600 text-xs mt-1">{errors.adminPhone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIGURATION */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="text-gray-600 w-5 h-5" /> Estate Configuration
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Total Units *</label>
                      <input
                        type="number"
                        name="totalUnits"
                        value={formData.totalUnits}
                        onChange={handleChange}
                        min="1"
                        className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                          errors.totalUnits ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        }`}
                        placeholder="Number of houses/flats"
                      />
                      {errors.totalUnits && <p className="text-red-600 text-xs mt-1">{errors.totalUnits}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Security Desk Phone *</label>
                      <input
                        type="tel"
                        name="securityContacts"
                        value={formData.securityContacts}
                        onChange={handleChange}
                        className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                          errors.securityContacts ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        }`}
                        placeholder="Emergency contact"
                      />
                      {errors.securityContacts && <p className="text-red-600 text-xs mt-1">{errors.securityContacts}</p>}
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
                          className={`p-3 border text-sm font-medium transition-all ${
                            formData.amenities.includes(amenity)
                            ? 'bg-gray-100 border-gray-900 text-gray-900'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
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
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="text-gray-600 w-5 h-5" /> Account Setup
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                          errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                        }`}
                        placeholder="Choose a unique username"
                      />
                      {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password *</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                            errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                          }`}
                          placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Confirm Password *</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full p-3 bg-white border focus:outline-none focus:ring-1 transition-all ${
                            errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
                          }`}
                          placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          className="mt-1 w-5 h-5 bg-white border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the <a href="#" className="text-gray-900 hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-gray-900 hover:underline font-medium">Privacy Policy</a>. I confirm I am an authorized representative of this estate.
                        </span>
                      </label>
                      {errors.termsAccepted && <p className="text-red-600 text-xs mt-2 ml-1">{errors.termsAccepted}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                    step === 1 
                    ? 'opacity-0 cursor-default' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    {isSubmitting ? 'Processing...' : 'Complete Registration'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}