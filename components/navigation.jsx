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
  Building,
  Info,
  MessageSquare,
  Globe,
  Zap,
  Target,
  BarChart3,
  Lock,
  Award,
  TrendingUp,
  StepForward
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

    const renderDesktopNav = () => (
        <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {mainNavItems.map((item) => (
                <div key={item.name} className="relative">
                    {item.type === 'dropdown' ? (
                        <div className="relative group">
                            <button
                                onMouseEnter={() => setActiveDropdown(item.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                                className={`relative px-4 py-2.5 font-medium transition-all duration-200 group min-w-[90px] flex items-center gap-2 ${
                                    activeLink === item.path || activeDropdown === item.name
                                        ? 'text-gray-900 border-b-2 border-gray-900' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {item.icon}
                                <span className="text-sm">{item.name}</span>
                                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                                    activeDropdown === item.name ? 'rotate-180' : ''
                                }`} />
                            </button>

                            {item.name === 'Product' && (
                                <div 
                                    onMouseEnter={() => setActiveDropdown('Product')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                    className={`absolute top-full left-0 mt-1 w-64 bg-white shadow-xl border-gray-200 rounded-lg overflow-hidden z-50 transition-all duration-200 transform ${
                                        activeDropdown === 'Product' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                                    }`}
                                >
                                    <div className="py-2">
                                        {item.items.map((subItem) => (
                                            <button
                                                key={subItem.name}
                                                onClick={() => handleNavClick(subItem)}
                                                className="w-full px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-sm group/item"
                                            >
                                                <div className="p-2 bg-gray-100 group-hover/item:bg-gray-900 group-hover/item:text-white rounded-lg transition-colors">
                                                    {subItem.icon}
                                                </div>
                                                <div className="text-left">
                                                    <span className="font-medium">{subItem.name}</span>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {subItem.description}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {item.name === 'Resources' && (
                                <div 
                                    onMouseEnter={() => setActiveDropdown('Resources')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                    className={`absolute top-full left-0 mt-1 w-72 bg-white shadow-xl border-gray-200 rounded-lg overflow-hidden z-50 transition-all duration-200 transform ${
                                        activeDropdown === 'Resources' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                                    }`}
                                >
                                    <div className="py-2">
                                        {item.items.map((resource) => (
                                            <div key={resource.name} className=" border-b border-gray-100 last:border-b-0">
                                                <button
                                                    onClick={() => handleNavClick(resource)}
                                                    className="w-full px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-sm"
                                                >
                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                                        {resource.icon}
                                                    </div>
                                                    <span className="font-medium">{resource.name}</span>
                                                </button>
                                                {resource.subItems && (
                                                    <div className="pl-14 pr-2 pb-2">
                                                        {resource.subItems.map((sub) => (
                                                            <button
                                                                key={sub.name}
                                                                onClick={() => handleNavClick(sub)}
                                                                className="w-full px-3 py-2 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded text-sm transition-colors"
                                                            >
                                                                {sub.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => handleNavClick(item)}
                            className={`relative px-4 py-2.5 font-medium transition-all duration-200 group min-w-[90px] flex items-center gap-2 ${
                                activeLink === item.path 
                                    ? 'text-gray-900 border-b-2 border-gray-900' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {item.icon}
                            <span className="text-sm">{item.name}</span>
                        </button>
                    )}
                </div>
            ))}
        </div>
    )

    const renderMobileNav = () => (
        <div className="lg:hidden flex items-center">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
        </div>
    )

    const renderMobileMenu = () => (
        <div className="fixed inset-0 z-40 lg:hidden pt-20">
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsMenuOpen(false)}
            />
            
            <div className="relative bg-white shadow-2xl h-full max-w-sm w-full ml-auto animate-slideIn">
                <div className="overflow-y-auto h-full">
                    <div className="p-6 space-y-1">
                        {mainNavItems.map((item) => (
                            <div key={item.name}>
                                {item.type === 'dropdown' ? (
                                    <div className=" border-b border-gray-100 last:border-b-0">
                                        <button
                                            onClick={() => handleDropdownToggle(item.name)}
                                            className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-all duration-200 ${
                                                activeLink === item.path || activeDropdown === item.name
                                                    ? 'text-gray-900 bg-gray-50' 
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 ${
                                                    activeLink === item.path ? 'text-gray-900' : 'text-gray-600'
                                                }`}>
                                                    {item.icon}
                                                </div>
                                                <span className="font-medium text-sm">{item.name}</span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                                activeDropdown === item.name ? 'rotate-180' : ''
                                            }`} />
                                        </button>

                                        {activeDropdown === item.name && (
                                            <div className="pl-14 pr-4 py-2 space-y-1 bg-gray-50">
                                                {item.items.map((subItem) => (
                                                    <div key={subItem.name}>
                                                        <button
                                                            onClick={() => handleNavClick(subItem)}
                                                            className="w-full px-3 py-2.5 text-left text-gray-700 hover:text-gray-900 transition-colors text-sm flex items-center gap-3"
                                                        >
                                                            <div className="p-1.5">
                                                                {subItem.icon}
                                                            </div>
                                                            <span>{subItem.name}</span>
                                                        </button>
                                                        {subItem.subItems && (
                                                            <div className="pl-10 pr-2 py-1 space-y-1">
                                                                {subItem.subItems.map((sub) => (
                                                                    <button
                                                                        key={sub.name}
                                                                        onClick={() => handleNavClick(sub)}
                                                                        className="w-full px-3 py-1.5 text-left text-gray-600 hover:text-gray-900 transition-colors text-sm"
                                                                    >
                                                                        {sub.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleNavClick(item)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 ${
                                            activeLink === item.path 
                                                ? 'text-gray-900 bg-gray-50' 
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`p-2 ${
                                            activeLink === item.path ? 'text-gray-900' : 'text-gray-600'
                                        }`}>
                                            {item.icon}
                                        </div>
                                        <span className="font-medium text-sm">{item.name}</span>
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="pt-6 border-t border-gray-200 space-y-4">
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        router.push('/login')
                                        setIsMenuOpen(false)
                                    }}
                                    className="w-full px-6 py-3.5 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all text-sm"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        router.push('/register')
                                        setIsMenuOpen(false)
                                    }}
                                    className="w-full px-6 py-3.5 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all text-sm shadow-lg"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Start Free Trial
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </button>
                            </div>
                            
                            <div className="text-center pt-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                    <Shield className="w-4 h-4 text-gray-700" />
                                    <span className="text-xs text-gray-600 font-medium">
                                        Trusted by 2,500+ Communities
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderCTAButtons = () => (
        <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button
                onClick={() => router.push('/demo')}
                className="px-5 py-2.5 border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-900 font-medium transition-all duration-200 text-sm"
            >
                Schedule Demo
            </button>
            <button
                onClick={() => router.push('/register')}
                className="px-5 py-2.5 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
                <span className="flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                </span>
            </button>
        </div>
    )

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 py-2' 
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
                                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-900 text-white font-bold flex items-center justify-center rounded-md shadow-sm group-hover:scale-105 transition-transform">
                                    <Shield size={22} />
                                </div>
                            </div>
                            <div className="min-w-0 hidden sm:block">
                                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate">
                                    EstateSecure
                                </h1>
                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest truncate">
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
                                                        ? 'text-gray-900 bg-gray-50' 
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                                                className={`absolute top-full left-0 mt-2 w-72 bg-white shadow-xl border-gray-200 rounded-md overflow-hidden z-50 transition-all duration-300 origin-top-left ${
                                                    activeDropdown === item.name ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                                }`}
                                            >
                                                <div className="p-2">
                                                    {item.items.map((subItem) => (
                                                        <div key={subItem.name} className="mb-1 last:mb-0">
                                                            <button
                                                                onClick={() => handleNavClick(subItem)}
                                                                className="w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center gap-4 group/item"
                                                            >
                                                                <div className="p-2 bg-gray-100 rounded-md group-hover/item:bg-gray-900 group-hover/item:text-white transition-all">
                                                                    {subItem.icon}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="text-sm font-semibold">{subItem.name}</div>
                                                                    {subItem.description && <div className="text-xs text-gray-500">{subItem.description}</div>}
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
                                            className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 font-semibold text-sm"
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
                                className="px-5 py-2 text-gray-900 font-medium hover:text-gray-700 transition-colors text-sm"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm flex items-center gap-2"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                 <div className="fixed inset-0 z-40 lg:hidden overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-white/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white border-l border-gray-200 shadow-2xl animate-in slide-in-from-right duration-300 p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-900 rounded-md text-white">
                                    <Shield size={20} />
                                </div>
                                <span className="font-bold text-xl text-gray-900">EstateSecure</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
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
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-gray-50"
                                            >
                                                <span className="font-semibold text-sm text-gray-900">{item.name}</span>
                                                <ChevronDown size={16} className={activeDropdown === item.name ? 'rotate-180' : ''} />
                                            </button>
                                            
                                            {activeDropdown === item.name && (
                                                <div className="pl-4 space-y-1 animate-in fade-in slide-in-from-top-1">
                                                    {item.items.map((sub) => (
                                                        <button
                                                            key={sub.name}
                                                            onClick={() => handleNavClick(sub)}
                                                            className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 text-sm text-gray-600 flex items-center gap-3"
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
                                            className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 font-semibold text-sm"
                                        >
                                            {item.name}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-200 mt-auto space-y-4">
                            <button className="w-full py-4 text-center font-bold text-sm bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors">
                                Start Free Trial
                            </button>
                            <button onClick={() => router.push('/login')} className="w-full py-4 text-center font-bold text-sm border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors">
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