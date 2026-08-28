'use client'

import { useState, useEffect } from 'react'
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
  LogIn,
  Shield,
  QrCode,
  X,
  CheckCircle,
  Loader2,
  Home,
  KeyRound
} from 'lucide-react'
import { handleAdminLogin, handleSecurityLogin, handleUserLogin, setRole } from '@/lib/action'
import QRScanner from '@/components/ui/QRScanner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('resident')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [pendingQrLogin, setPendingQrLogin] = useState(null)
  const [qrUsername, setQrUsername] = useState('')
  const [qrPin, setQrPin] = useState('')
  const [qrPinError, setQrPinError] = useState('')
  const router = useRouter()

  // Role-specific content configuration
  const roleConfig = {
    resident: {
      title: 'Welcome Home',
      subtitle: 'Access your estate management dashboard',
      icon: Home,
      features: [
        'View your property details',
        'Submit maintenance requests',
        'Pay association fees',
        'Access community amenities'
      ],
      gradient: 'from-[#1241a1]/60 via-[#0d0f13]/80 to-[#0d0f13]/90',
      buttonColor: 'bg-[#1241a1] hover:bg-[#1a51b1] shadow-[#1241a1]/30'
    },
    security: {
      title: 'Security Command',
      subtitle: 'Scan QR code for instant access',
      icon: Shield,
      features: [
        'QR code authentication',
        'Real-time access monitoring',
        'Visitor management system',
        'Emergency response coordination'
      ],
      gradient: 'from-[#1241a1]/60 via-[#0d0f13]/80 to-[#0d0f13]/90',
      buttonColor: 'bg-[#1241a1] hover:bg-[#1a51b1] shadow-[#1241a1]/30'
    },
    admin: {
      title: 'Admin Control Center',
      subtitle: 'Full estate management suite',
      icon: Building2,
      features: [
        'Resident management',
        'Staff administration',
        'Financial reporting',
        'System configuration'
      ],
      gradient: 'from-[#1241a1]/60 via-[#0d0f13]/80 to-[#0d0f13]/90',
      buttonColor: 'bg-[#1241a1] hover:bg-[#1a51b1] shadow-[#1241a1]/30'
    }
  }

  const currentConfig = roleConfig[userType]

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (userType === 'admin') {
        const result = await handleAdminLogin(email, password)
        if (!result.success) {
          setError(result.errors?.[0] || 'Login failed')
          setIsLoading(false)
        } else {
          setIsLoading(false)
          router.push('/auth/proceed?role=admin')
        }
      } 
      else if (userType === 'resident') {
        const result = await handleUserLogin(email, password)
        console.log(result)

        if (!result.success) {
          setError(result.errors?.[0] || 'Login failed')
          setIsLoading(false)
        } else {
          setIsLoading(false)
          router.push('/auth/proceed?role=resident')
        }
      }
    } catch (error) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  // Handle QR code scan - ONLY for security.
  // The gate QR code now only carries the gateId — the guard types in
  // their username and PIN, and the gateId is loaded from the scan.
  const handleQRScan = async (scannedData) => {
    try {
      let gateId = null

      try {
        const payload = JSON.parse(scannedData)
        gateId = payload.gateId || payload.id || null
      } catch (e) {
        // Not JSON — treat the raw scanned value as the gate id
        gateId = scannedData || null
      }

      if (!gateId) {
        setError('Invalid QR code format')
        setShowQRScanner(false)
        return
      }

      setScanSuccess(true)
      setQrUsername('')
      setQrPin('')
      setQrPinError('')
      setPendingQrLogin({ gateId })
    } catch (error) {
      setError('Failed to process QR code')
    } finally {
      setShowQRScanner(false)
    }
  }

  // Trigger the security login with the typed username/PIN + scanned gateId
  const handleSecurityLoginSubmit = async (e) => {
    e.preventDefault()
    if (!pendingQrLogin) return

    if (!qrUsername.trim()) {
      setQrPinError('Please enter your username')
      return
    }

    if (!qrPin || qrPin.length < 6) {
      setQrPinError('Please enter your 6-digit PIN')
      return
    }

    setQrPinError('')
    setIsLoading(true)

    try {
      const result = await handleSecurityLogin(qrUsername.trim(), qrPin, pendingQrLogin.gateId)

      if (result.success) {
        await setRole('security')
        router.push('/dashboard/security')
      } else {
        setQrPinError(result.errors?.[0] || result.message || 'Security login failed')
        setIsLoading(false)
      }
    } catch (error) {
      setQrPinError('Failed to process login')
      setIsLoading(false)
    }
  }

  const RoleIcon = currentConfig.icon

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-[#0d0f13] font-sans">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-20 transition-all duration-700 pointer-events-none select-none">
        <RoleIcon className="absolute -top-32 -right-32 size-96" strokeWidth={0.5} />
        <RoleIcon className="absolute -bottom-40 -left-40 size-[28rem]" strokeWidth={0.5} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(18,65,161,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(18,65,161,0.15),transparent_50%)]" />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0d0f13]/80 via-[#0d0f13] to-[#0d0f13]" />
      
      {/* Main Login Card */}
      <div className="relative z-20 w-full max-w-[960px] flex flex-col md:flex-row bg-[#1a1d23]/95 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-[#2a2d33]">
        
        {/* Left Side: Dynamic Visual Context */}
        <div className="hidden md:flex flex-1 flex-col justify-between p-10 relative min-h-[500px] overflow-hidden transition-all duration-700">
          {/* Decorative Icon Background */}
          <div className={`absolute inset-0 z-0 bg-gradient-to-br ${currentConfig.gradient} transition-all duration-700`} />
          <div className="absolute -top-10 -right-10 z-0 opacity-10 pointer-events-none select-none">
            <RoleIcon className="size-72" strokeWidth={0.5} />
          </div>
          <div className="absolute -bottom-16 -left-16 z-0 opacity-5 pointer-events-none select-none">
            <RoleIcon className="size-80" strokeWidth={0.5} />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full">
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl text-white transition-all duration-500">
              <div className="flex items-center gap-2 mb-8 cursor-pointer group" onClick={() => router.push('/')}>
                <div className="p-2 bg-white/20 backdrop-blur rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="size-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">EMSS</span>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
               
                <h2 className="text-3xl font-bold leading-tight text-white italic">
                  {currentConfig.title}
                </h2>
              </div>
              
              <p className="text-white/80 text-lg leading-relaxed">
                {currentConfig.subtitle}
              </p>
            </div>
            
            {/* Role-specific features */}
            <div className="space-y-3 mt-8 transition-all duration-500">
              {currentConfig.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 text-white/80 animate-in fade-in slide-in-from-left-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="size-2 rounded-full bg-white/50" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <span className="text-2xl font-bold text-white mb-2">
              {userType === 'resident' ? 'Welcome Home' : 
               userType === 'security' ? 'Security Access' : 
               'Admin Access'}
            </span>
            <p className="text-[#8a8f98]">
              {userType === 'resident' ? 'Sign in to your resident dashboard' : 
               userType === 'security' ? 'Scan QR code for instant access' : 
               'Sign in to admin control panel'}
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0d0f13] border border-[#2a2d33] p-1 mb-8 shadow-inner">
            <button 
              type="button"
              onClick={() => {
                setUserType('resident')
                setError('')
                setEmail('')
                setPassword('')
                setScanSuccess(false)
              }}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${userType === 'resident' ? 'bg-[#1241a1] text-white shadow-lg' : 'text-[#8a8f98] hover:text-white'}`}
            >
              <Home className="size-4 inline-block mr-1" />
              Resident
            </button>
            <button 
              type="button"
              onClick={() => {
                setUserType('security')
                setError('')
                setEmail('')
                setPassword('')
                setScanSuccess(false)
              }}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${userType === 'security' ? 'bg-[#1241a1] text-white shadow-lg' : 'text-[#8a8f98] hover:text-white'}`}
            >
              <Shield className="size-4 inline-block mr-1" />
              Security
            </button>
            <button 
              type="button"
              onClick={() => {
                setUserType('admin')
                setError('')
                setEmail('')
                setPassword('')
                setScanSuccess(false)
              }}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${userType === 'admin' ? 'bg-[#1241a1] text-white shadow-lg' : 'text-[#8a8f98] hover:text-white'}`}
            >
              <Building2 className="size-4 inline-block mr-1" />
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2 border border-red-500/20">
              <AlertCircle className="size-5 mt-0.5 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          {scanSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 rounded-xl flex items-center gap-3 text-green-400 animate-in fade-in slide-in-from-top-2 border border-green-500/20">
              <CheckCircle className="size-5 mt-0.5 shrink-0" />
              <p className="text-xs font-medium">QR code scanned successfully! Authenticating...</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Security - QR Code Only */}
            {userType === 'security' ? (
              <div className="space-y-6">
                {/* QR Scanner Card - Dark Theme */}
                <div className="bg-[#1a1d23] border border-[#2a2d33] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-[#1241a1]/20 rounded-xl">
                      <QrCode className="size-5 text-[#1241a1]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">QR Authentication</h3>
                      <p className="text-[11px] text-[#8a8f98]">Scan your assigned QR code to authenticate</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQRScanner(true)}
                    className="w-full py-5 bg-[#1241a1] hover:bg-[#1a51b1] text-white font-semibold rounded-xl transition-all transform active:scale-95 flex flex-col items-center justify-center gap-2 shadow-lg shadow-[#1241a1]/30 border-none"
                    disabled={isLoading}
                  >
                    <QrCode className="size-10" />
                    <span className="text-sm">Scan QR Code</span>
                    <span className="text-[11px] text-blue-200">Tap to open camera</span>
                  </button>
                </div>

                {/* Info Card */}
                <div className="bg-[#1a1d23] border border-[#2a2d33] rounded-xl p-4 flex items-start gap-3">
                  <div className="p-1.5 bg-amber-500/10 rounded-lg mt-0.5">
                    <AlertCircle className="size-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white mb-1">Admin Approval Required</p>
                    <p className="text-[11px] text-[#8a8f98] leading-relaxed">
                      After scanning, an administrator must approve your login from the Guard Management panel before you gain access.
                    </p>
                  </div>
                </div>

                {/* Manual Login Disabled */}
                <div className="bg-[#1a1d23]/50 border border-[#2a2d33]/50 rounded-xl py-3 px-4 flex items-center justify-center gap-2">
                  <Lock className="size-4 text-[#8a8f98]" />
                  <span className="text-xs font-medium text-[#8a8f98]">Manual login disabled for security</span>
                </div>
              </div>
            ) : (
              /* Resident & Admin - Manual Login */
              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#8a8f98] ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8f98] group-focus-within:text-cyan-500 size-5 transition-colors" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0d0f13] text-white border border-[#2a2d33] pl-14 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-cyan-800 focus:border-cyan-800 outline-none transition-all placeholder:text-[#8a8f98]"
                      placeholder={userType === 'resident' ? 'resident@demo.com' : 'admin@demo.com'}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#8a8f98] ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8f98] group-focus-within:text-cyan-500 size-5 transition-colors" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#0d0f13] text-white border border-[#2a2d33] pl-14 pr-14 py-3.5 rounded-xl focus:ring-2 focus:ring-cyan-800 focus:border-cyan-800 outline-none transition-all placeholder:text-[#8a8f98]"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8f98] hover:text-cyan-500 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg ${currentConfig.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <LogIn className="size-5" />
                  )}
                  {isLoading ? 'Authenticating...' : `Sign in as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 text-center pt-8 border-t border-[#2a2d33]">
            <p className="text-[#8a8f98] text-sm">
              {userType === 'security' ? (
                'Contact your administrator for QR code assignment'
              ) : (
                <>
                  Don't have account? 
                  <Link href="/auth/signup" className="text-white font-bold ml-1 hover:underline">Sign up here</Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner 
          onScan={handleQRScan}
          onClose={() => {
            setShowQRScanner(false)
            setScanSuccess(false)
          }}
        />
      )}

      {/* PIN Entry Modal — shown after scanning the gate QR */}
      {pendingQrLogin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-[#1a1d23] rounded-2xl overflow-hidden shadow-2xl border border-[#2a2d33]">
            <div className="flex items-center justify-between p-4 border-b border-[#2a2d33]">
              <div className="flex items-center gap-2 text-white">
                <KeyRound className="size-5 text-[#1241a1]" />
                <h3 className="font-semibold">Gate Login</h3>
              </div>
              <button
                onClick={() => {
                  setPendingQrLogin(null)
                  setQrPinError('')
                  setScanSuccess(false)
                }}
                className="text-[#8a8f98] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#2a2d33]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSecurityLoginSubmit} className="p-6 space-y-5">
              <div className="bg-[#0d0f13] rounded-xl p-4 border border-[#2a2d33] flex items-center justify-between gap-3 text-sm">
                <span className="text-[#8a8f98] flex items-center gap-2">
                  <Building2 className="size-4 text-[#1241a1]" />
                  Gate
                </span>
                <span className="text-white font-bold font-mono truncate">{pendingQrLogin.gateId}</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8a8f98] ml-1 mb-1.5 block">
                  Username
                </label>
                <input
                  type="text"
                  value={qrUsername}
                  onChange={(e) => setQrUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="w-full bg-[#0d0f13] text-white font-mono border border-[#2a2d33] px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] focus:border-[#1241a1] outline-none transition-all placeholder:text-[#8a8f98]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8a8f98] ml-1 mb-1.5 block">
                  PIN (6 digits)
                </label>
                <input
                  type="password"
                  value={qrPin}
                  onChange={(e) => setQrPin(e.target.value)}
                  placeholder="••••••"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  inputMode="numeric"
                  autoFocus
                  className="w-full bg-[#0d0f13] text-white text-center tracking-[0.5em] font-mono text-xl border border-[#2a2d33] py-3.5 rounded-xl focus:ring-2 focus:ring-[#1241a1] focus:border-[#1241a1] outline-none transition-all placeholder:text-[#8a8f98]"
                />
                {qrPinError && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {qrPinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#1241a1] hover:bg-[#1a51b1] text-white font-bold rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#1241a1]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Shield className="size-5" />
                )}
                {isLoading ? 'Verifying PIN...' : 'Sign In & Enter Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}