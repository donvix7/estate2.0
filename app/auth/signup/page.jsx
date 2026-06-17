'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Loader2, 
  CheckCircle2, 
  User,
  
} from 'lucide-react'
import { handleCreateUser} from '@/lib/action'
import { toast } from 'react-toastify'

export default function EstateOnboardingPage() {
  const [formData, setFormData] = useState({
    // Estate Basic Information
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
  const router = useRouter()


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

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
        toast.success('Sign Up completed successfully!')
        router.push('/auth/login')
      } else {
        toast.error(result.message || 'Failed to complete Sign Up')
      }
    } catch (error) {
      console.error('Sign Up error:', error)
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }


  const steps = [
    { number: 1, title: 'Basic Info', icon: Building2 },
    { number: 2, title: 'Review', icon: CheckCircle2 }
  ]

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white dark:text-white mb-4">
            Create your account
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join our growing community and experience seamless estate management and security services.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center relative">
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all z-10 ${
                    currentStep >= step.number 
                      ? 'bg-[#1241a1] text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {currentStep > step.number ? <CheckCircle2 className="size-6" /> : <step.icon className="size-6" />}
                </button>
                <span className={`text-xs font-bold mt-3 ${
                  currentStep >= step.number ? 'text-[#1241a1]' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-6 max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full" />
            <div className="absolute top-1/2 left-0 h-1 bg-[#1241a1] -translate-y-1/2 transition-all duration-500 rounded-full"
              style={{ width: `${((currentStep) / 2) * 100}%` }} />
          </div>
        </div>

        {/* Form Sections */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 mx-auto overflow-hidden">
          {/* Step 1: personal Information */}
          {currentStep === 1 && (
            <div className="p-5 py-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">User Basic Information</h2>
                <p className="text-slate-600 dark:text-slate-400">Tell us about yourself</p>
              </div>

              <form className="flex flex-col space-y-8">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1241a1] focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                     email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="e.g., 08000000000"
                    />
                  </div>
                  
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                     Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                </div>
              </form>
            </div>

          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 2 && (
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Review & Submit</h2>
                <p className="text-slate-600 dark:text-slate-400">Verify all information before submitting</p>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
                {/* Estate Summary */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <User className="size-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <p><strong>First Name:</strong> {formData.firstName || 'Not provided'}</p>
                    <p><strong>Last Name:</strong> {formData.lastName}</p>
                  </div>
                </div>

                
              
                {/* Manager Contact */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <User className="size-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                  </div>
                </div>

                {/* Terms Acceptance */}
                <div className="border-t pt-6">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                      className="mt-1 size-4"
                    />
                    <span className="text-sm">
                      I confirm that all information provided is accurate and complete. I authorize the estate management platform to process this information and agree to comply with all platform terms of service.
                    </span>
                  </label>
                </div>
              </div>

              
            </div>
          )}
        </div>
        <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className='flex gap-4 '>
                  <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Next
                </button>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.termsAccepted}
                  className="px-10 py-3 bg-[#1241a1] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-blue-800 transition-colors"
                >
                  {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
                  {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
                </button>
              </div>
      </div>
    </div>
  )
}