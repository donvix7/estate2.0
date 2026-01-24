'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Shield, User, Users, KeyRound, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react'

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
        ...(user.type === 'security' && { gateStation: user.gateStation, badgeNumber: user.badgeNumber })
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
    resident: { icon: <Building2 className="w-4 h-4" /> },
    admin: { icon: <Shield className="w-4 h-4" /> },
    security: { icon: <Users className="w-4 h-4" /> },
    staff: { icon: <User className="w-4 h-4" /> }
  }

  const userTypeLabels = {
    resident: 'Resident',
    admin: 'Admin',
    security: 'Security',
    staff: 'Staff'
  }

  return (
    <div 
      className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative "
      style={{
        backgroundImage: `url('/images/estate.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="backdrop-blur-lg shadow-lg border border-gray-200 p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center mb-4 mx-auto">
              <span className="font-bold text-xl">ES</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">EstateSecure</h1>
            <p className="text-gray-400">Secure Estate Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-gray-200 font-medium mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['resident', 'admin', 'security', 'staff'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setUserType(type)
                      const creds = USER_DATABASE.users.find(u => u.type === type)
                      setEmail(creds?.email || '')
                    }}
                    className={`py-3 text-sm font-medium transition-all ${
                      userType === type 
                        ? 'bg-gray-900 text-white border border-gray-900' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className={userType === type ? 'text-white' : 'text-gray-600'}>
                        {userTypeConfig[type].icon}
                      </div>
                      <span>{userTypeLabels[type]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-3 text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-gray-900 placeholder-gray-500 transition-all"
                placeholder={demoCredentials.email}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-gray-900 placeholder-gray-500 transition-all"
                placeholder="123456"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gray-200 text-white font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </div>
              )}
            </button>

            {/* Demo Credentials Section */}
            <div className="mt-6">
              <div className="bg-gray-50 border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-gray-700" />
                  <p className="text-gray-700 font-medium">
                    Demo Credentials for <span className="font-semibold">{userTypeLabels[userType]}</span>
                  </p>
                </div>
                <div className="space-y-2 bg-white p-3 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 flex items-center justify-center">
                      <User className="w-3 h-3 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-gray-900 font-mono text-sm">{demoCredentials.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 flex items-center justify-center">
                      <KeyRound className="w-3 h-3 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Password</div>
                      <div className="text-gray-900 font-mono text-sm">{demoCredentials.password}</div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(demoCredentials.email)
                    setPassword('123456')
                  }}
                  className="mt-3 w-full py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium border border-gray-300 transition-all duration-300 text-sm"
                >
                  Auto-fill Demo Credentials
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-300 text-sm">
                Need help? Contact support at{' '}
                <a href="mailto:support@estatesecure.com" className="text-green-600 hover:underline font-medium">
                  support@estatesecure.com
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}