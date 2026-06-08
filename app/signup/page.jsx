'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { 
  Shield, 
  CheckCircle2,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import AuthCarousel from '@/components/AuthCarousel'
import { handleCreateUser } from '@/lib/action'



export default function SignupPage() {
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Signup form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    emergencyContact: '',
    emergencyContactName: '',
    occupation: '',
    agreeToTerms: false,
    receiveNotifications: true
  })

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
  const handlePrevStep = async () => {
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
      const response = await handleCreateUser(formData)
      
      if (!response?.success) {
        throw new Error(response?.message || 'Registration failed. Please try again.')
      }
      
      // Registration successful
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?message=registration_success')
      }, 3000)
      
    } catch (err) {
      console.error('Registration error:', err)
      alert(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
              Welcome to <span className="font-semibold text-blue-700">EstateSecure</span>
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
      
      {/* Left Side - Image & Branding */}
      <AuthCarousel>
        <h2 className="text-4xl font-bold mb-6 leading-tight">
          Create Your<br />
          Account
        </h2>
        <p className="text-lg text-white/80 leading-relaxed mb-8 font-light">
          Sign up to join our secure community portal. Complete your registration to access amenities, pay dues, and stay connected with your neighborhood.
        </p>
      </AuthCarousel>

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
                    {step === 1 && 'Please provide your personal details.'}
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
                          />
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
                              . I confirm that all information provided is accurate and I am authorized to register.
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
                        className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-all border"
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