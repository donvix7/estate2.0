'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Shield, User, Users, KeyRound, LogIn, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
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
    {
      id: 3,
      email: 'security@demo.com',
      password: '123456',
      name: 'Security Officer',
      type: 'security',
      gateStation: 'Gate 1',
      shift: 'Day Shift',
      badgeNumber: 'SEC-001'
    },
    {
      id: 4,
      email: 'staff@demo.com',
      password: '123456',
      name: 'Staff Member',
      type: 'staff',
      department: 'Maintenance',
      phone: '+91 9876543212'
    }
  ],
  sessions: []
}

// Mock API functions (Unchanged logic)
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
        ...(user.type === 'security' && { gateStation: user.gateStation, badgeNumber: user.badgeNumber })
      },
      session: session.sessionId
    }
  },
  
  getCurrentSession() {
    return USER_DATABASE.sessions[USER_DATABASE.sessions.length - 1] || null
  }
}

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

export default function LoginPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('resident')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
          case 'security':
            router.push('/dashboard/security')
            break
          case 'staff':
            router.push('/dashboard/staff')
            break
          default:
            router.push('/dashboard/resident')
        }
      }
    } catch (err) {
      setError('Invalid credentials. Use demo credentials: email@demo.com / 123456')
      setIsLoading(false)
    }
  }

  const getDemoCredentials = () => {
    const user = USER_DATABASE.users.find(u => u.type === userType)
    return {
      email: user?.email || `${userType}@demo.com`,
      password: '123456',
      name: user?.name || `${userType.charAt(0).toUpperCase() + userType.slice(1)} User`
    }
  }

  const demoCredentials = getDemoCredentials()

  const userTypeConfig = {
    resident: { icon: <Building2 className="w-5 h-5" />, color: 'bg-blue-600' },
    admin: { icon: <Shield className="w-5 h-5" />, color: 'bg-indigo-600' },
    security: { icon: <Users className="w-5 h-5" />, color: 'bg-emerald-600' },
    staff: { icon: <User className="w-5 h-5" />, color: 'bg-orange-600' }
  }

  const userTypeLabels = {
    resident: 'Resident',
    admin: 'Admin',
    security: 'Security',
    staff: 'Staff'
  }

  return (
    <div className="min-h-screen w-full flex bg-gray-50 overflow-hidden">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900"
      >
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
          <div 
            
            
            
            className="max-w-md bg-white/5 backdrop-blur-sm p-8 rounded-lg border-white/10 shadow-2xl"
          >
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative bg-white">
        <div className="absolute top-8 left-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
            </Link> 
        </div>

        <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center lg:text-left">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-700 mb-3 tracking-tight">Welcome Back</h1>
                  <p className="text-gray-500 text-lg">Sign in to access your dashboard</p>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 bg-gradient-to-b from-gray-200 via-white to-white p-6 rounded-lg">
                {/* User Type Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-900 tracking-wide">SELECT YOUR ROLE</label>
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                        {['resident', 'admin', 'security', 'staff'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => {
                                setUserType(type)
                                const creds = USER_DATABASE.users.find(u => u.type === type)
                                setEmail(creds?.email || '')
                            }}
                            className={`
                                relative flex flex-col items-center justify-center p-4 gap-2 rounded-lg transition-all duration-200
                                ${userType === type 
                                    ? 'bg-gray-900 text-white' 
                                    : 'hover:shadow-lg'
                                }
                            `}
                        >
                            {userTypeConfig[type].icon}
                            <span className="text-sm font-medium">{userTypeLabels[type]}</span>
                            {userType === type && (
                              <div
                                
                                className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"
                              />
                            )}
                        </button>
                        ))}
                    </div>
                </div>

                                  {error && (
                      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border-red-100 text-sm flex items-start gap-2 overflow-hidden">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="flex-1">{error}</span>
                      </div>
                  )}
                
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Email Address</label>
                        <div className="relative group">
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 pr-12 bg-gray-50 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-gray-900 placeholder:text-gray-400 focus:bg-white"
                                placeholder={demoCredentials.email}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-900">Password</label>
                            <a href="#" className="text-xs text-blue-600 font-medium hover:underline">Forgot password?</a>
                        </div>
                        <div className="relative group">
                            <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 pr-12 bg-gray-50 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-gray-900 placeholder:text-gray-400 focus:bg-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                      disabled={isLoading}
                      className="w-full py-4 hover:bg-gray-900 hover:text-white text-gray-900 font-bold rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-gray-900/25 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Signing In...</span>
                        </>
                    ) : (
                        <>
                            <LogIn className="w-5 h-5" />
                            <span>Sign In</span>
                        </>
                    )}
                </button>

                <div className="mt-6 pt-6 ">
                  <div className="bg-blue-50/50 p-4 shadow-lg rounded-lg">
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                       </div>
                       <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-blue-900">Demo Credentials Available</p>
                          <p className="text-xs text-blue-700">
                            Use <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900 font-bold">{demoCredentials.email}</span>  
                            {' '}&{' '}<span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900 font-bold">123456</span>
                          </p>
                          
                          <button
                            type="button"
                            onClick={() => {
                                setEmail(demoCredentials.email)
                                setPassword('123456')
                            }}
                            className="text-xs text-blue-600 font-bold hover:text-blue-800 hover:underline mt-2 inline-flex items-center gap-1 transition-colors"
                          >
                            Auto-fill Credentials <ArrowLeft className="w-3 h-3 rotate-180" />
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
            </form>
            
            <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline transition-all">Register your estate</Link>
            </p>
        </div>
      </div>
    </div>
  )
}