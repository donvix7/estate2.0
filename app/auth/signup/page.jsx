'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Building2, 
  Loader2, 
  CheckCircle2, 
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  Shield,
  Calendar,
  MapPin,
  Home,
  Sparkles,
  Award,
  Clock,
  Crown,
  Gem,
  Star,
  ChevronRight,
  Headset
} from 'lucide-react'
import { handleCreateUser } from '@/lib/action'
import { toast } from 'react-toastify'

export default function EstateOnboardingPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.password) {
        toast.error('Please fill in all required information')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return false
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
      }
     
      const result = await handleCreateUser(payload)
      if (result.ok === true) {
        toast.success('Account created successfully!')
        router.push('/auth/login')
      } else {
        toast.error(result.message || 'Failed to create account')
      }
    } catch (error) {
      console.error('Sign Up error:', error)
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Details', icon: User },
    { number: 2, title: 'Preview', icon: CheckCircle2 }
  ]

  const totalSteps = steps.length

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/80 via-slate-900 to-slate-900" />
      
      {/* Main Onboarding Card */}
      <div className="relative z-20 w-full max-w-[1200px] flex flex-col lg:flex-row bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Live Preview with Background Image */}
       <div className="hidden lg:flex flex-1 flex-col max-h-[90vh] overflow-y-auto relative">
  {/* Preview Background Image */}
  <div className="absolute inset-0 z-0" >
    <Image 
      src="/images/estatelanding.jpg"
      alt="Preview"
      fill
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/80 to-slate-900/90" />
  </div>
  
  {/* Rest of your preview content */}
  <div className="relative z-10 p-10 flex flex-col justify-center items-center h-full">
    {/* ... your content ... */}
    <div className="border border-slate-400/50 bg-white/10 backdrop-blur-md p-10 rounded-xl text-white">
      <h1 className="text-3xl md:text-4xl text-center font-bold text-white">Welcome to <span className='text-slate-900'>EMSS</span></h1>
      <p className="text-center text-white mt-4 text-sm md:text-base">The best platform for estate management and community living</p>
      
    </div>
  </div>
</div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-10 lg:p-12 max-h-[90vh] overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 lg:hidden cursor-pointer group" onClick={() => router.push('/')}>
              <div className="p-2 bg-[#1241a1] rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="size-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">EMSS</h1>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-200">Create Account</span>
            <p className="text-slate-600 dark:text-slate-300 text-sm">Step {currentStep} of {totalSteps}</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center relative">
                  <button
                    type="button"
                    onClick={() => currentStep > step.number && setCurrentStep(step.number)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 ${
                      currentStep >= step.number 
                        ? 'bg-white text-black shadow-lg shadow-blue-900/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                    }`}
                    disabled={currentStep < step.number}
                  >
                    {currentStep > step.number ? <CheckCircle2 className="size-4" /> : <step.icon className="size-4" />}
                  </button>
                  <span className={`text-xs font-bold mt-2 ${
                    currentStep >= step.number ? 'text-white' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full" />
              <div className="absolute top-1/2 left-0 h-1 bg-[#1241a1] -translate-y-1/2 transition-all duration-500 rounded-full"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} />
            </div>
          </div>

          {/* Step 1: Personal Information - Only Input Fields */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address *
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1241a1] size-5 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-14 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1241a1] size-5 transition-colors" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-14 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                    placeholder="e.g., 08000000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password *
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1241a1] size-5 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-14 pr-14 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                      placeholder="Min 6 characters"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1241a1] transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1241a1] size-5 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-14 pr-14 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                      placeholder="Confirm your password"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1241a1] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review & Submit - Preview and Confirmation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Mobile Preview (only visible on small screens) */}
              <div className="lg:hidden">
                <div className="bg-gradient-to-br from-[#1241a1] to-blue-600 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-6">
                  <div className="p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                        {formData.firstName && formData.lastName 
                          ? `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
                          : <User className="size-8" />
                        }
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">
                          {formData.firstName && formData.lastName 
                            ? `${formData.firstName} ${formData.lastName}`
                            : 'Your Name'
                          }
                        </h4>
                        <p className="text-sm text-white/80">Resident</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 space-y-4">
                    <div className="flex items-start gap-3 text-sm">
                      <Mail className="size-4 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">Email</p>
                        <p className="text-slate-600 dark:text-slate-400">{formData.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Phone className="size-4 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">Phone</p>
                        <p className="text-slate-600 dark:text-slate-400">{formData.phoneNumber || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Home className="size-4 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">Status</p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                          <CheckCircle2 className="size-3" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Details */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-6 space-y-4">
                <span className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="size-5" />
                  Review Your Information
                </span>
                <div className="space-y-3 text-sm">
                  <p className="text-slate-600 dark:text-slate-400 flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">First Name:</span>
                    <span>{formData.firstName || 'Not provided'}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Last Name:</span>
                    <span>{formData.lastName || 'Not provided'}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span>
                    <span>{formData.email || 'Not provided'}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Phone:</span>
                    <span>{formData.phoneNumber || 'Not provided'}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 size-4 accent-[#1241a1]"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    I confirm that all information provided is accurate and complete. I authorize the estate management platform to process this information and agree to comply with all platform terms of service.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-300"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
              )}
              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep()) {
                      setCurrentStep(currentStep + 1)
                    }
                  }}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
            
            {currentStep === totalSteps && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.termsAccepted}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-slate-300 transition-colors "
              >
                {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
                {isSubmitting ? 'Creating Account...' : 'Complete Sign Up'}
              </button>
            )}
          </div>

          <div className="mt-6 text-center pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Already have an account? 
              <Link href="/auth/login" className="text-slate-700 dark:text-slate-200 font-semibold ml-1 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}