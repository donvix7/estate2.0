'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Building2, 
  UserCheck, 
  Headset, 
  AlertCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  Shield
} from 'lucide-react'
import { handleAdminLogin, handleSecurityLogin, handleUserLogin } from '@/lib/action'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gateId, setGateId] = useState('')
  const [userType, setUserType] = useState('resident')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
const handleLogin = async (e) => {
  e.preventDefault()
  setError('')
  setIsLoading(true)

  try {
    if (userType === 'admin') {
      const result = await handleAdminLogin(email, password)
      if (result.success) {
        router.push('/dashboard/admin')
        return
      } else {
        setError(result.errors?.[0] || 'Admin login failed')
        setIsLoading(false)
        return
      }
    } 
    
    else if (userType === 'security') {
      if (!gateId.trim()) {
        setError('Gate ID is required')
        setIsLoading(false)
        return
      }
      
      const result = await handleSecurityLogin(email, password, gateId)
      console.log(result)

      if (result.success) {
        router.push('/dashboard/security')
        return
      } else {
        setError(result.errors?.[0] || 'Security login failed')
        setIsLoading(false)
        return
      }
    } 
    
    else { // resident
      const result = await handleUserLogin(email, password)
        console.log(result)

      if (!result.success) {
        setError(result.errors?.[0] || 'Login failed')
        setIsLoading(false)
      } else {
        setIsLoading(false)
        router.push('/auth/proceed')
      }
    }
  } catch (error) {
    setError('An unexpected error occurred')
    setIsLoading(false)
  }
}
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/80 via-slate-900 to-slate-900" />
      
      {/* Main Login Card */}
      <div className="relative z-20 w-full max-w-[960px] flex flex-col md:flex-row bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Visual Context with Full Cover Image */}
        <div className="hidden md:flex flex-1 flex-col justify-between p-10 relative min-h-[500px] overflow-hidden">
          {/* Background Image - Full Cover */}
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
          
          {/* Content - sits on top of image */}
          <div className="relative z-10 flex flex-col justify-center h-full">
            <div className="border border-slate-400/50 bg-white/10 backdrop-blur-md p-10 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-8 cursor-pointer group" onClick={() => router.push('/')}>
                <div className="p-2 bg-white/20 backdrop-blur rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="size-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">EMSS</h1>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-white mb-4 italic">Next-Gen Estate Management</h2>
              <p className="text-white/80 text-lg leading-relaxed">Experience the ultimate all-in-one suite designed for luxury residences and smart communities.</p>
            </div>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-white/80">
                <UserCheck className="size-5 text-blue-300" />
                <span className="text-sm font-medium">Enterprise Grade Security</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Headset className="size-5 text-blue-300" />
                <span className="text-sm font-medium">24/7 Professional Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-2">Welcome Back</span>
            <p className="text-slate-600 dark:text-slate-300">Please select your account type to continue</p>
          </div>

          {/* Role Selector */}
          <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-8 shadow-inner">
            <button 
              type="button"
              onClick={() => {
                setUserType('resident')
                setGateId('') // Clear gate ID when switching
              }}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${userType === 'resident' ? 'bg-slate-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Resident
            </button>
            <button 
              type="button"
              onClick={() => {
                setUserType('security')
                setGateId('') // Clear gate ID when switching
              }}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${userType === 'security' ? 'bg-slate-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Security
            </button>
            <button 
              type="button"
              onClick={() => {
                setUserType('admin')
                setGateId('') // Clear gate ID when switching
              }}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${userType === 'admin' ? 'bg-slate-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Admin / Staff
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 rounded-xl flex items-center  gap-3 text-red-500 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="size-5 mt-0.5 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1241a1] size-5 transition-colors" />
                <input 
                  type={userType === 'security' ? 'text' : 'email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-14 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                  placeholder={userType === 'resident' ? 'resident@demo.com' : 'admin@demo.com'}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1241a1] size-5 transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-14 pr-14 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1241a1] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Gate ID Field - Only visible for Security */}
            {userType === 'security' && (
              <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Gate ID</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1241a1] size-5 transition-colors" />
                  <input 
                    type="text"
                    value={gateId}
                    onChange={(e) => setGateId(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-14 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                    placeholder="Enter your assigned gate ID (e.g., GATE-001)"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-1">
                  Enter the gate ID assigned to your security post
                </p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="size-5" />
              )}
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Don't have account? 
              <Link href="/auth/signup" className="text-slate-700 dark:text-slate-200 font-bold ml-1 hover:underline">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}