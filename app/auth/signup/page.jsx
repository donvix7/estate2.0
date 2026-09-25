'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
  Loader2,
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
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validateStep = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || !formData.password) {
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
      const result = await handleCreateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
      })

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

  const steps = ['Your details', 'Review']
  const inputClass = 'w-full rounded-xl border border-[#30343d] bg-[#0d0f13] px-4 py-3 text-sm text-white placeholder:text-[#777d88] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  const labelClass = 'mb-2 block text-sm font-medium text-[#d5d7dc]'

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0f13] px-4 py-8 text-white sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#2a2d33] bg-[#15171c] shadow-2xl md:min-h-[620px] md:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1241a1] via-[#102b5f] to-[#111318] p-9 md:flex lg:p-11">
          <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-8 -top-8 size-56 rounded-full border border-white/10" />
          <Link href="/" className="relative inline-flex w-fit items-center gap-2.5 text-white">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15"><Building2 className="size-5" /></span>
            <span className="text-lg font-semibold tracking-tight">EMSS</span>
          </Link>

          <div className="relative max-full py-10">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <UserPlus className="size-6" />
            </div>
            <p className="text-3xl font-semibold leading-tight tracking-tight">A better way to manage estate living.</p>
            <p className="mt-4 text-sm leading-6 text-white/70">Create your account to connect with your community and manage your home in one place.</p>
          </div>

          <p className="relative text-xs text-white/55">Estate Management System</p>
        </aside>

        <section className="flex flex-col justify-center px-5 py-7 sm:px-9 sm:py-10 lg:px-12">
          <div className="mb-7 flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#a4a7af] transition hover:text-white md:hidden">
              <Building2 className="size-4 text-blue-300" /> EMSS
            </Link>
            <Link href="/" className="hidden items-center gap-1.5 text-sm text-[#8a8f98] transition hover:text-white md:inline-flex">
              <ArrowLeft className="size-4" /> Home
            </Link>
            <span className="text-sm text-[#8a8f98]">Already a member? <Link href="/auth/login" className="font-medium text-white hover:text-blue-300">Sign in</Link></span>
          </div>

          <div className="mb-7">
            <p className="text-3xl flex items-center justify-center font-semibold uppercase tracking-[0.16em] text-blue-300">Create account</p>
            <p className="mt-2 text-2xl flex items-center justify-center font-semibold tracking-tight sm:text-3xl">{currentStep === 1 ? 'Your account details' : 'Review your details'}</p>
            <p className="mt-2 text-sm flex items-center justify-center leading-6 text-[#a4a7af]">
              {currentStep === 1 ? 'Enter your information to get started.' : 'Check your information and confirm to create your account.'}
            </p>
          </div>

          <div className="mb-7" aria-label={`Step ${currentStep} of ${steps.length}`}>
            <div className="mb-2 flex items-center justify-between text-xs">
              {steps.map((step, index) => {
                const number = index + 1
                const active = currentStep === number
                const complete = currentStep > number
                return (
                  <div key={step} className={`flex items-center gap-2 ${active || complete ? 'text-white' : 'text-[#777d88]'}`}>
                    <span className={`flex size-6 items-center justify-center rounded-full text-xs ${complete ? 'bg-emerald-500/15 text-emerald-300' : active ? 'bg-[#1241a1] text-white' : 'border border-[#343944]'}`}>
                      {complete ? <Check className="size-3.5" /> : number}
                    </span>
                    <span className="font-medium">{step}</span>
                  </div>
                )
              })}
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#292d35]">
              <div className={`h-full rounded-full bg-blue-500 transition-all duration-300 ${currentStep === 2 ? 'w-full' : 'w-1/2'}`} />
            </div>
          </div>

          {currentStep === 1 ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="firstName">First name</label>
                  <input id="firstName" autoComplete="given-name" required name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputClass} placeholder="First name" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="lastName">Last name</label>
                  <input id="lastName" autoComplete="family-name" required name="lastName" value={formData.lastName} onChange={handleInputChange} className={inputClass} placeholder="Last name" />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="email">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#777d88]" />
                  <input id="email" autoComplete="email" required type="email" name="email" value={formData.email} onChange={handleInputChange} className={`${inputClass} pl-10`} placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="phoneNumber">Phone number</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#777d88]" />
                  <input id="phoneNumber" autoComplete="tel" required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className={`${inputClass} pl-10`} placeholder="Phone number" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="password">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#777d88]" />
                    <input id="password" autoComplete="new-password" required minLength={6} type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className={`${inputClass} pl-10 pr-10`} placeholder="At least 6 characters" />
                    <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a8f98] hover:text-white">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="confirmPassword">Confirm password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#777d88]" />
                    <input id="confirmPassword" autoComplete="new-password" required type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`${inputClass} pl-10 pr-10`} placeholder="Re-enter password" />
                    <button type="button" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a8f98] hover:text-white">
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" onClick={() => { if (validateStep()) setCurrentStep(2) }} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1241a1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#15171c]">
                Continue <ArrowRight className="size-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="overflow-hidden rounded-xl border border-[#30343d] bg-[#0d0f13]">
                <div className="flex items-center gap-3 border-b border-[#292d35] px-4 py-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#1241a1]/20 text-blue-300"><User className="size-5" /></div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{formData.firstName} {formData.lastName}</p>
                    <p className="text-xs text-[#8a8f98]">Resident account</p>
                  </div>
                </div>
                <dl className="divide-y divide-[#292d35] px-4">
                  <div className="flex items-center justify-between gap-4 py-3 text-sm"><dt className="text-[#8a8f98]">Email</dt><dd className="max-w-[70%] truncate text-right text-[#e4e5e8]">{formData.email}</dd></div>
                  <div className="flex items-center justify-between gap-4 py-3 text-sm"><dt className="text-[#8a8f98]">Phone</dt><dd className="text-right text-[#e4e5e8]">{formData.phoneNumber}</dd></div>
                </dl>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#30343d] p-4 transition hover:bg-white/[0.02]">
                <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleInputChange} className="mt-0.5 size-4 shrink-0 accent-blue-600" />
                <span className="text-sm leading-5 text-[#a4a7af]">I confirm my information is accurate and agree to the platform terms.</span>
              </label>

              <div className="flex gap-3">
                <button type="button" onClick={() => setCurrentStep(1)} disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#343944] px-4 py-3 text-sm font-medium text-[#d5d7dc] transition hover:bg-[#242730] disabled:opacity-50">
                  <ArrowLeft className="size-4" /> Back
                </button>
                <button type="button" onClick={handleSubmit} disabled={isSubmitting || !formData.termsAccepted} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1241a1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  {isSubmitting ? 'Creating account…' : 'Create account'}
                </button>
              </div>
            </div>
          )}

          <p className="mt-7 text-center text-xs text-[#777d88]">Your information is used to set up and secure your account.</p>
        </section>
      </div>
    </main>
  )
}
