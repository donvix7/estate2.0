'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { handleEstateCompleteRegistration, handleUserRegistration } from '@/lib/action'
import AuthCarousel from '@/components/AuthCarousel'



export default function EstateRegistrationPage() {

    const token = useSearchParams().get('token');
    console.log(token);
  const [step, setStep] = useState(1)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
        switch (name) {
        case 'address': setAddress(val); break;
        case 'city': setCity(val); break;
        case 'state': setState(val); break;
        case 'email': setEmail(val); break;
        case 'phone': setPhone(val); break;
        case 'password': setPassword(val); break;
        case 'confirmPassword': setConfirmPassword(val); break;
        case 'termsAccepted': setTermsAccepted(val); break;
      }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }



  const validateStep = () => {
    const newErrors = {}

    if (step === 1) {
      if (!email) newErrors.email = 'Email is required'
      if (!phone) newErrors.phone = 'Phone number is required'
      if (!address) newErrors.address = 'Address is required'
      if (!city) newErrors.city = 'City is required'
      if (!state) newErrors.state = 'State is required'
      if (!password) newErrors.password = 'Password is required'
      else if (password.length < 8) newErrors.password = 'Password must be at least 6 characters'
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
      if (!termsAccepted) newErrors.termsAccepted = 'You must accept the terms'
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
      
      const formData = {
        estate_contact_email: email,
        estate_contact_phone: phone,
        address,
        city,
        state,
        password, 
      }

      try {
        const response = await handleEstateCompleteRegistration(formData,token)
        if (!response.success) {
          throw new Error(response.message)
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
            
            

            <div className="text-center lg:text-left mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-700 mb-3 tracking-tight">
                    {step === 1 && 'Complete your setup'}

                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    {step === 1 && 'Fill in your details to complete your registration.'}

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

              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="gap-6">
                          
                     <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                         <h2 className='text-xl font-semibold text-gray-800 mb-4 col-span-2'>Estate Information</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                                    errors.email ? ' border-red-500' : ' border-gray-200'
                                }`}
                                placeholder="your estate email"
                            />
                            {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
                        </div> 
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                            <input
                            type="text"
                            name="phone"
                            value={phone}
                            onChange={handleChange}
                            className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                                errors.phone ? ' border-red-500' : ' border-gray-200'
                            }`}
                            placeholder="phone number"
                            />
                            {errors.phone && <p className="text-red-600 text-xs">{errors.phone}</p>}
                        </div>
                    </div>
                    <h2 className='text-xl font-semibold text-gray-800 mb-2 mt-4'>Address</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="address"
                          value={address}
                          onChange={handleChange}
                          className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                            errors.address ? ' border-red-500' : ' border-gray-200'
                          }`}
                          placeholder="full address"
                        />
                        {errors.address && <p className="text-red-600 text-xs">{errors.address}</p>}
                      </div>
                         
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="city"
                          value={city}
                          onChange={handleChange}
                          className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                            errors.city ? ' border-red-500' : ' border-gray-200'
                          }`}
                          placeholder="city"
                        />
                        {errors.city && <p className="text-red-600 text-xs">{errors.city}</p>}
                      </div>
                         
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">State <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="state"
                          value={state}
                          onChange={handleChange}
                          className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                            errors.state ? ' border-red-500' : ' border-gray-200'
                          }`}
                          placeholder="state"
                        />
                        {errors.state && <p className="text-red-600 text-xs">{errors.state}</p>}
                      </div>
                       </div>
                     <h2 className='text-xl font-semibold text-gray-800 mb-2 mt-4'>Account Security</h2>
                     <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                       <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <input
                          type="password"
                          name="password"
                          value={password}
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
                          value={confirmPassword}
                          onChange={handleChange}
                          className={`w-full p-3.5 bg-white   rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400 text-gray-800 ${
                            errors.confirmPassword ? ' border-red-500' : ' border-gray-200'
                          }`}
                          placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
                      </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="flex items-start gap-3 p-4 bg-white border-gray-200 rounded-xl shadow-sm cursor-pointer hover:border-gray-300 hover:bg-gray-50/50 transition-all">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={termsAccepted}
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

                {step < 1 ? (
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
                Already have an account? <Link href="/auth/login" className="text-blue-600 font-bold hover:underline transition-all">Sign in here</Link>
            </p>
          </div>
      </div>
      {/* Left Side - Image & Branding (Matching Login) */}
      <AuthCarousel>
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
      </AuthCarousel>

    </div>
  )
}