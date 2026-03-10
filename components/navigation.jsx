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
} from 'lucide-react'

const Navigation = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [activeLink, setActiveLink] = useState('')

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

    const mainNavItems = [
        { 
            name: 'Home', 
            path: '/', 
            icon: <Home size={18} /> 
        },
        { 
            name: 'Product', 
            path: '/#features',
            type: 'dropdown',
            icon: <Shield size={18} />,
            items: [
                { name: 'Features Overview', path: '/#features', icon: <Zap size={16} /> },
                { name: 'Mobile App', path: '/mobile', icon: <Smartphone size={16} /> },
                { name: 'Security Suite', path: '/security', icon: <Lock size={16} /> },
                { name: 'Community Platform', path: '/community', icon: <Users size={16} /> },
                { name: 'Admin Dashboard', path: '/dashboard/admin', icon: <BarChart3 size={16} /> },
            ]
        },
        { 
            name: 'Pricing', 
            path: '/pricing', 
            icon: <CreditCard size={18} /> 
        },
        { 
            name: 'About', 
            path: '/about', 
            icon: <Info size={18} /> 
        },
        { 
            name: 'Resources', 
            path: '/resources',
            type: 'dropdown',
            icon: <FileText size={18} />,
            items: [
                { 
                    name: 'Documentation', 
                    path: '/#setup',
                    icon: <FileText size={16} />,
                    subItems: [
                        { name: 'API Documentation', path: '/documentation' },
                        { name: 'Setup Guide', path: '/#setup' },
                        { name: 'Integration Guide', path: '/documentation' },
                        { name: 'Security Features', path: '/documentation/security' },
                        { name: 'Mobile App Guide', path: '/documentation/mobile' },
                    ]
                },
                { 
                    name: 'Community', 
                    path: '/forum',
                    icon: <MessageSquare size={16} />,
                    subItems: [
                        { name: 'Community Forum', path: '/forum' },
                        { name: 'Success Stories', path: '/success-stories' },
                        { name: 'Blog', path: '/blog' },
                        { name: 'Events', path: '/events' },
                    ]
                },
                { 
                    name: 'Support', 
                    path: '/#faq',
                    icon: <Users size={16} />,
                    subItems: [
                        { name: 'Help Center', path: '/help' },
                        { name: 'Contact Support', path: '/contact' },
                        { name: 'Service Status', path: '/status' },
                        { name: 'FAQ', path: '/#faq' },
                    ]
                }
            ]
        },
    ]

    const handleNavClick = (item) => {
        if (item.path.startsWith('/#')) {
            const element = document.querySelector(item.path.substring(1))

            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            } else {
                router.push('/')
                setTimeout(() => {
                    const el = document.querySelector(item.path.substring(1))
                    el?.scrollIntoView({ behavior: 'smooth' })
                }, 100)
            }
        } else {
            router.push(item.path)
        }
        setIsMenuOpen(false)
        setActiveDropdown(null)
    }

    const handleDropdownToggle = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name)
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
                        <span className="material-symbols-outlined text-2xl">domain</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">EstatePro</h2>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    <a onClick={() => handleNavClick({path: '/#features'})} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1241a1] transition-colors cursor-pointer">Features</a>
                    <a onClick={() => handleNavClick({path: '/pricing'})} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1241a1] transition-colors cursor-pointer">Pricing</a>
                    <a onClick={() => handleNavClick({path: '/#testimonials'})} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1241a1] transition-colors cursor-pointer">Testimonials</a>
                    <a onClick={() => handleNavClick({path: '/support'})} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1241a1] transition-colors cursor-pointer">Support</a>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/login')}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1241a1] transition-colors"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => router.push('/register')}
                        className="px-6 py-2.5 bg-[#1241a1] hover:bg-[#1241a1]/90 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#1241a1]/20 hover:-translate-y-0.5 active:scale-95"
                    >
                        Get Started
                    </button>
                </div>

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
                 <div className="fixed inset-0 z-200 lg:hidden overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-white/80 dark:bg-[#111621]/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-[#111621] shadow-2xl animate-fade-in slide-in-from-right duration-300 p-6 flex flex-col z-210">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-[#1241a1] rounded-lg flex items-center justify-center text-white shadow-md">
                                    <span className="material-symbols-outlined text-xl">domain</span>
                                </div>
                                <span className="font-bold text-xl text-slate-900 dark:text-white">EstatePro</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                             <button
                                onClick={() => handleNavClick({path: '/#features'})}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => handleNavClick({path: '/pricing'})}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
                            >
                                Pricing
                            </button>
                            <button
                                onClick={() => handleNavClick({path: '/#testimonials'})}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
                            >
                                Testimonials
                            </button>
                            <button
                                onClick={() => handleNavClick({path: '/support'})}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
                            >
                                Support
                            </button>
                        </div>

                        <div className="pt-6 mt-auto space-y-4">
                            <button 
                                onClick={() => router.push('/register')}
                                className="w-full py-4 text-center font-bold text-sm bg-[#1241a1] text-white rounded-xl shadow-lg shadow-[#1241a1]/30 hover:bg-[#1241a1]/90 transition-colors"
                            >
                                Get Started
                            </button>
                            <button onClick={() => router.push('/login')} className="w-full py-4 text-center font-bold text-sm bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navigation