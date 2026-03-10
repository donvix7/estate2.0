'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Hardcoded user database simulation
const USER_DATABASE = {
  users: [
    {
      id: 1,
      email: 'resident@demo.com',
      password: '123456',
      name: 'John Resident',
      type: 'resident',
      unitNumber: 'A-101',
      building: 'Tower A',
      phone: '+91 9876543210'
    },
    {
      id: 2,
      email: 'admin@demo.com',
      password: '123456',
      name: 'Admin User',
      type: 'admin',
      role: 'Super Admin',
      accessLevel: 'full',
      phone: '+91 9876543211'
    },
  ],
  sessions: []
}

// Mock API functions
const mockAPI = {
  async authenticateUser(email, password, userType) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const user = USER_DATABASE.users.find(u => 
      u.email === email && u.password === password && u.type === userType
    )
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const session = {
      userId: user.id,
      userType: user.type,
      userName: user.name,
      userEmail: user.email,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
    
    USER_DATABASE.sessions.push(session)
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        ...(user.type === 'resident' && { unitNumber: user.unitNumber, building: user.building }),
        ...(user.type === 'admin' && { role: user.role, accessLevel: user.accessLevel }),
      },
      session: session.sessionId
    }
  },
  
  getCurrentSession() {
    return USER_DATABASE.sessions[USER_DATABASE.sessions.length - 1] || null
  }
}

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
      const result = await mockAPI.authenticateUser(email, password, userType)
      
      if (result.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('currentUser', JSON.stringify(result.user))
          sessionStorage.setItem('sessionId', result.session)
        }
        
        switch(userType) {
          case 'resident':
            router.push('/dashboard/resident')
            break
          case 'admin':
            router.push('/dashboard/admin')
            break
        }
      }
    } catch (err) {
      setError('Invalid credentials. Use demo credentials.')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-background-light dark:bg-background-dark font-sans selection:bg-[#1241a1]/10 selection:text-[#1241a1]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-20 transition-opacity duration-1000"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop")' }}
      >
      </div>
      <div className="absolute inset-0 z-10 bg-linear-to-b from-[#111621]/80 via-[#111621] to-[#111621]"></div>
      
      {/* Main Login Card */}
      <div className="relative z-20 w-full max-w-[960px] flex flex-col md:flex-row bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Visual/Context (Hidden on small screens) */}
        <div className="hidden md:flex flex-1 flex-col justify-between p-10 bg-[#1241a1]/10">
          <div>
            <div className="flex items-center gap-2 mb-8 cursor-pointer group" onClick={() => router.push('/')}>
              <div className="p-2 bg-[#1241a1] rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">domain</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-100">EstatePro</h1>
            </div>
            <h2 className="text-3xl font-bold leading-tight text-white mb-4 italic">Next-Gen Estate Management</h2>
            <p className="text-slate-400 text-lg leading-relaxed">Experience the ultimate all-in-one suite designed for luxury residences and smart communities.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <span className="material-symbols-outlined text-[#1241a1]">verified_user</span>
              <span className="text-sm font-medium">Enterprise Grade Security</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <span className="material-symbols-outlined text-[#1241a1]">support_agent</span>
              <span className="text-sm font-medium">24/7 Professional Support</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h3>
            <p className="text-slate-500 dark:text-slate-400">Please select your account type to continue</p>
          </div>

          {/* Role Selector */}
          <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-8 shadow-inner">
            <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${userType === 'resident' ? 'bg-[#1241a1] text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-[#1241a1]'}`}>
              <span className="truncate">Resident</span>
              <input 
                type="radio" 
                name="userType" 
                value="resident"
                className="sr-only"
                checked={userType === 'resident'}
                onChange={() => setUserType('resident')}
              />
            </label>
            <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${userType === 'admin' ? 'bg-[#1241a1] text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
              <span className="truncate">Admin / Staff</span>
              <input 
                type="radio" 
                name="userType" 
                value="admin"
                className="sr-only"
                checked={userType === 'admin'}
                onChange={() => setUserType('admin')}
              />
            </label>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 rounded-xl flex items-start gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-sm mt-0.5">error_outline</span>
              <p className="text-xs font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1241a1] transition-colors">mail</span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500 shadow-sm"
                  placeholder={userType === 'resident' ? 'resident@demo.com' : 'admin@demo.com'}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1241a1] transition-colors">lock</span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white pl-12 pr-12 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] outline-none transition-all placeholder:text-slate-500 shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded bg-slate-800 text-[#1241a1] focus:ring-[#1241a1]/30 transition-all pointer-events-none" />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-[#1241a1] hover:text-blue-400 transition-colors">Forgot Password?</a>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1241a1] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-[#1241a1]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined">login</span>
              )}
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Auto-fill Hint */}
          <div className="mt-8 p-4 bg-slate-800/30 rounded-xl text-center">
            <p className="text-xs text-slate-500 mb-2 font-medium">Quick Access</p>
            <button 
              type="button"
              onClick={() => {
                setEmail(userType === 'resident' ? 'resident@demo.com' : 'admin@demo.com')
                setPassword('123456')
              }}
              className="text-xs font-bold text-[#1241a1] hover:text-blue-400 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">auto_fix</span>
              Auto-fill Demo Details
            </button>
          </div>

          <div className="mt-8 text-center pt-8">
            <p className="text-slate-400 text-sm">
              New to the estate? 
              <Link href="/register" className="text-[#1241a1] font-bold ml-1 hover:underline">Request Access</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Optional Bottom Navigation/Links */}
      <div className="mt-8 flex gap-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
        <a className="hover:text-[#1241a1] transition-colors" href="#">Privacy Policy</a>
        <a className="hover:text-[#1241a1] transition-colors" href="#">Terms of Service</a>
        <a className="hover:text-[#1241a1] transition-colors" href="#">Help Center</a>
      </div>
    </div>
  )
}