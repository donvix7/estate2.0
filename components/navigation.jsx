'use client'

import { useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { 
  Home, 
  FileText, 
  Menu, 
  X, 
  ChevronDown,
  ArrowRight,
  Shield,
  Smartphone,
  CreditCard,
  Users,
  Info,
  MessageSquare,
  Zap,
  BarChart3,
  Lock,
  Building2,
  LogIn,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'
import { getResidentData, getUserById } from '@/lib/service'
import { Logout } from '@/lib/action'
import Link from 'next/link'

const Navigation = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [activeLink, setActiveLink] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [role, setRole] = useState('')

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const result = await getResidentData();
                // Check if result exists and has user data (not null)
                setIsLoggedIn(!!result && result !== null);
                setRole(result?.role);
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await Logout();
            setIsLoggedIn(false);
            // Navigate to login and refresh to ensure UI updates
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setActiveLink(pathname)
    }, [pathname])

    const handleNavClick = (path) => {
        if (path.startsWith('/#')) {
            const element = document.querySelector(path.substring(1))
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            } else {
                router.push('/')
                setTimeout(() => {
                    const el = document.querySelector(path.substring(1))
                    el?.scrollIntoView({ behavior: 'smooth' })
                }, 100)
            }
        } else {
            router.push(path)
        }
        setIsMenuOpen(false)
        setActiveDropdown(null)
    }

    // Don't render anything while checking login status to prevent flashing
    if (isLoading) {
        return (
            <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#111621]/90 backdrop-blur-xl shadow-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-[#1241a1] rounded-lg flex items-center justify-center text-white">
                            <Building2 className="size-6" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">EstatePro</h2>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <>
            <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/90 dark:bg-[#111621]/90 backdrop-blur-xl shadow-md' 
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div 
                        onClick={() => router.push('/')}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="size-10 bg-[#1241a1] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#1241a1]/20 group-hover:scale-105 transition-transform">
                            <Building2 className="size-6" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">EstatePro</h2>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10">
                        <button 
                            onClick={() => handleNavClick('/#features')} 
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1241a1] transition-colors cursor-pointer"
                        >
                            Features
                        </button>
                        <button 
                            onClick={() => handleNavClick('/pricing')} 
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1241a1] transition-colors cursor-pointer"
                        >
                            Pricing
                        </button>
                        <button 
                            onClick={() => handleNavClick('/#testimonials')} 
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1241a1] transition-colors cursor-pointer"
                        >
                            Testimonials
                        </button>
                        <button 
                            onClick={() => handleNavClick('/support')} 
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1241a1] transition-colors cursor-pointer"
                        >
                            Support
                        </button>
                        {isLoggedIn && role === "user" && (
                        <button onClick={() => handleNavClick('/join-request')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1241a1] transition-colors cursor-pointer">
                            Request Join
                        </button>
                        )}
                       
                    </nav>

                    {/* Desktop Actions - FIXED CONDITION */}
                    {!isLoggedIn ? (
                        <div className="hidden md:flex items-center gap-4">
                            <button 
                                onClick={() => router.push('/login')}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1241a1] transition-colors flex gap-2 items-center"
                            >
                                <LogIn size={18}/>
                                Login
                            </button>
                            <button 
                                onClick={() => router.push('/register')}
                                className="px-6 py-2.5 bg-[#1241a1] hover:bg-[#1241a1]/90 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#1241a1]/20 hover:-translate-y-0.5 active:scale-95 flex gap-2 items-center"
                            >
                                <User size={18}/>
                                Get Started
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            {role === 'admin' ? (
                                <Link href="/dashboard/admin" onClick={() => setIsMenuOpen(false)}>
                                    <button className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1241a1] transition-colors flex gap-2 items-center">
                                        Admin Dashboard</button>
                                </Link>
                            ) : (
                                <Link href="/dashboard/resident" onClick={() => setIsMenuOpen(false)}>
                                    <button className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1241a1] transition-colors flex gap-2 items-center">
                                        <LayoutDashboard/> Dashboard</button>
                                </Link>
                            )}
                            
                            <button 
                                onClick={handleLogout}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1241a1] transition-colors flex gap-2 items-center"
                            >
                                <LogOut size={18}/>
                                Logout
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[200] lg:hidden overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-white/80 dark:bg-[#111621]/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-[#111621] shadow-2xl animate-fade-in slide-in-from-right duration-300 p-6 flex flex-col z-[210]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-[#1241a1] rounded-lg flex items-center justify-center text-white shadow-md">
                                    <Building2 className="size-5" />
                                </div>
                                <span className="font-bold text-xl text-slate-900 dark:text-white">EstatePro</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            <button
                                onClick={() => handleNavClick('/#features')}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => handleNavClick('/pricing')}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
                            >
                                Pricing
                            </button>
                            <button
                                onClick={() => handleNavClick('/#testimonials')}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
                            >
                                Testimonials
                            </button>
                            <button
                                onClick={() => handleNavClick('/support')}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
                            >
                                Support
                            </button>
                            <button onClick={() => handleNavClick('/join-request')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors">
                                Request Join
                            </button>
                        </div>

                        <div className="pt-6 mt-auto space-y-4">
                            {!isLoggedIn ? (
                                <>
                                    <button 
                                        onClick={() => router.push('/register')}
                                        className="w-full py-4 text-center font-bold text-sm bg-[#1241a1] text-white rounded-xl shadow-lg shadow-[#1241a1]/30 hover:bg-[#1241a1]/90 transition-colors"
                                    >
                                        Get Started
                                    </button>
                                    <button 
                                        onClick={() => router.push('/login')} 
                                        className="w-full py-4 text-center font-bold text-sm bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Login
                                    </button>
                                </>
                            ) : (
                                <div className='flex gap-4 w-full'>
                                    {role === 'admin' ? (
                                        <Link href="/dashboard/admin">
                                            <button 
                                                className="w-full py-4 text-center font-bold text-sm bg-[#1241a1] hover:bg-[#1241a1]/90 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ArrowRight size={18}/>
                                                {role === 'admin' ? 'Admin' : 'Resident'} Dashboard
                                            </button>
                                        </Link>
                                    ) : (
                                        <Link href="/dashboard/resident">
                                            <button 
                                                className="w-full py-4 text-center font-bold text-sm bg-[#1241a1] hover:bg-[#1241a1]/90 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ArrowRight size={18}/>
                                               {role === 'admin' ? 'Admin' : 'Resident'} Dashboard
                                            </button>
                                        </Link>
                                    )}
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full py-4 text-center font-bold text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut size={18}/>
                                    Logout
                                </button>
                            </div>)}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navigation