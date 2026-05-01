'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building2, 
  UserCheck, 
  Headset, 
  AlertCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn 
} from 'lucide-react'
import { handleAdminLogin, handleUserLogin } from '@/lib/action'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      let result;
      
      if (userType === 'admin') {
        result = await handleAdminLogin(email, password)
      } else {
        result = await handleUserLogin(email, password)
      }

      if (result?.success) {
        // Redirection logic based on role
        if (userType === 'admin' || result.user?.type === 'admin') {
          router.push('/dashboard/admin')
        } else {
          router.push('/dashboard/resident')
        }
      } else {
        setError(result?.message || 'Login failed. Please check your credentials.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'An unexpected error occurred.')
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
        
        {/* Left Side: Visual Context */}
        <div className="hidden md:flex flex-1 flex-col justify-between p-10 bg-[#1241a1]/10">
          <div>
            <div className="flex items-center gap-2 mb-8 cursor-pointer group" onClick={() => router.push('/')}>
              <div className="p-2 bg-[#1241a1] rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="size-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">EstatePro</h1>
            </div>
            <h2 className="text-3xl font-bold leading-tight text-[#1241a1] dark:text-white mb-4 italic">Next-Gen Estate Management</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">Experience the ultimate all-in-one suite designed for luxury residences and smart communities.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <UserCheck className="size-5 text-[#1241a1]" />
              <span className="text-sm font-medium">Enterprise Grade Security</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Headset className="size-5 text-[#1241a1]" />
              <span className="text-sm font-medium">24/7 Professional Support</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h3>
            <p className="text-slate-600 dark:text-slate-300">Please select your account type to continue</p>
          </div>

          {/* Role Selector */}
          <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-8 shadow-inner">
            <button 
              type="button"
              onClick={() => setUserType('resident')}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${userType === 'resident' ? 'bg-[#1241a1] text-white shadow-lg' : 'text-slate-500 hover:text-[#1241a1]'}`}
            >
              Resident
            </button>
            <button 
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${userType === 'admin' ? 'bg-[#1241a1] text-white shadow-lg' : 'text-slate-500 hover:text-[#1241a1]'}`}
            >
              Admin / Staff
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 rounded-xl flex items-start gap-3 text-red-500 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-14 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500"
                  placeholder={userType === 'resident' ? 'resident@demo.com' : 'admin@demo.com'}
                  required
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

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1241a1] hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="size-5" />
              )}
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-8 text-center pt-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              New to the estate? 
              <Link href="/register" className="text-[#1241a1] font-bold ml-1 hover:underline">Request Access</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}