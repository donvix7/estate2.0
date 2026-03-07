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
            <nav className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm dark:shadow-slate-800/50 py-2' 
                    : 'bg-transparent py-4'
            }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div 
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-3 cursor-pointer group min-w-0 shrink-0"
                        >
                            <div className="shrink-0">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-600 text-white font-bold flex items-center justify-center rounded-xl shadow-md group-hover:scale-105 transition-transform">
                                    <Shield size={22} />
                                </div>
                            </div>
                            <div className="min-w-0 hidden sm:block">
                                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                                    EstateSecure
                                </h1>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest truncate">
                                    Enterprise Security
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
                            {mainNavItems.map((item) => (
                                <div key={item.name} className="relative">
                                    {item.type === 'dropdown' ? (
                                        <div className="relative group">
                                            <button
                                                onMouseEnter={() => setActiveDropdown(item.name)}
                                                onMouseLeave={() => setActiveDropdown(null)}
                                                className={`relative px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2 rounded-md ${
                                                    activeLink === item.path || activeDropdown === item.name
                                                        ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                                                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                                                }`}
                                            >
                                                {/* {item.icon} */}
                                                <span className="text-sm">{item.name}</span>
                                                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                                                    activeDropdown === item.name ? 'rotate-180' : ''
                                                }`} />
                                            </button>

                                            <div 
                                                onMouseEnter={() => setActiveDropdown(item.name)}
                                                onMouseLeave={() => setActiveDropdown(null)}
                                                className={`absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 shadow-xl dark:shadow-black/50 rounded-2xl overflow-hidden z-50 transition-all duration-300 origin-top-left ${
                                                    activeDropdown === item.name ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                                }`}
                                            >
                                                <div className="p-2">
                                                    {item.items.map((subItem) => (
                                                        <div key={subItem.name} className="mb-1 last:mb-0">
                                                            <button
                                                                onClick={() => handleNavClick(subItem)}
                                                                className="w-full px-4 py-3 text-left text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 rounded-xl transition-all duration-200 flex items-center gap-4 group/item"
                                                            >
                                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                                                                    {subItem.icon}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="text-sm font-semibold">{subItem.name}</div>
                                                                    {subItem.description && <div className="text-xs text-slate-500 dark:text-slate-400">{subItem.description}</div>}
                                                                </div>
                                                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleNavClick(item)}
                                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-semibold text-sm transition-colors"
                                        >
                                            {item.name}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => router.push('/login')}
                                className="px-5 py-2 text-slate-700 font-medium hover:text-blue-700 transition-colors text-sm"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 text-sm flex items-center gap-2 group"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        {!isMenuOpen && (<div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-slate-900 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
                            >
                                <Menu size={22} />
                            </button>
                        </div>)}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                 <div className="fixed inset-0 z-200 lg:hidden overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl animate-fade-in slide-in-from-right duration-300 p-6 flex flex-col z-210">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md">
                                    <Shield size={20} />
                                </div>
                                <span className="font-bold text-xl text-slate-900 dark:text-white">EstateSecure</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {mainNavItems.map((item) => (
                                <div key={item.name}>
                                    {item.type === 'dropdown' ? (
                                        <div className="space-y-1">
                                            <button
                                                onClick={() => handleDropdownToggle(item.name)}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                                            >
                                                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{item.name}</span>
                                                <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            {activeDropdown === item.name && (
                                                <div className="pl-4 space-y-1 animate-in fade-in slide-in-from-top-1">
                                                    {item.items.map((sub) => (
                                                        <button
                                                            key={sub.name}
                                                            onClick={() => handleNavClick(sub)}
                                                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors flex items-center gap-3"
                                                        >
                                                            {sub.icon}
                                                            {sub.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleNavClick(item)}
                                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
                                        >
                                            {item.name}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 mt-auto space-y-4">
                            <button className="w-full py-4 text-center font-bold text-sm bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors">
                                Start Free Trial
                            </button>
                            <button onClick={() => router.push('/login')} className="w-full py-4 text-center font-bold text-sm bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navigation