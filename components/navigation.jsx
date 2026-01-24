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
  Lock,
  Building
} from 'lucide-react'

const Navigation = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDocsOpen, setIsDocsOpen] = useState(false)
    const [activeLink, setActiveLink] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setActiveLink(pathname)
    }, [pathname])

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Features', path: '/#features', icon: <Shield size={18} /> },
    ]

    const docItems = [
        { name: 'API Documentation', path: '/docs/api' },
        { name: 'Setup Guide', path: '/docs/setup' },
        { name: 'Security Features', path: '/docs/security' },
        { name: 'Integration Guide', path: '/docs/integration' },
        { name: 'FAQ', path: '/docs/faq' },
    ]

    return (
        <>
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white shadow-md py-3 border-b border-gray-200' 
                    : 'bg-white py-4'
            }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div 
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-3 cursor-pointer group min-w-0"
                        >
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 text-white font-bold flex items-center justify-center text-xl">
                                    ES
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate">
                                    EstateSecure
                                </h1>
                                <p className="text-xs text-gray-600 font-medium mt-0.5 truncate">
                                    Security Platform
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        if (item.path.startsWith('/#')) {
                                            const element = document.querySelector(item.path.substring(1))
                                            element?.scrollIntoView({ behavior: 'smooth' })
                                        } else {
                                            router.push(item.path)
                                        }
                                    }}
                                    className={`relative px-4 py-2.5 font-medium transition-all duration-200 group min-w-[90px] ${
                                        activeLink === item.path 
                                            ? 'text-gray-900 border-b-2 border-gray-900' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="flex items-center gap-2 justify-center">
                                        <span className="text-sm">{item.name}</span>
                                    </span>
                                </button>
                            ))}

                            {/* Documentation Dropdown */}
                            <div className="relative">
                                <button
                                    onMouseEnter={() => setIsDocsOpen(true)}
                                    onMouseLeave={() => setIsDocsOpen(false)}
                                    className={`relative px-4 py-2.5 font-medium transition-all duration-200 flex items-center gap-2 group min-w-[160px] ${
                                        activeLink.includes('/docs') 
                                            ? 'text-gray-900 border-b-2 border-gray-900' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <FileText size={18} className="shrink-0" />
                                    <span className="text-sm">Documentation</span>
                                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                                        isDocsOpen ? 'rotate-180' : ''
                                    }`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDocsOpen && (
                                    <div 
                                        onMouseEnter={() => setIsDocsOpen(true)}
                                        onMouseLeave={() => setIsDocsOpen(false)}
                                        className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg border border-gray-200 overflow-hidden z-50"
                                    >
                                        <div className="py-2">
                                            {docItems.map((doc) => (
                                                <button
                                                    key={doc.name}
                                                    onClick={() => {
                                                        router.push(doc.path)
                                                        setIsDocsOpen(false)
                                                    }}
                                                    className="w-full px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-sm"
                                                >
                                                    <FileText size={16} className="text-gray-600" />
                                                    <span className="font-medium">{doc.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-4 shrink-0">
                            <button
                                onClick={() => router.push('/login')}
                                className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="px-5 py-2.5 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-200 shadow-sm text-sm"
                            >
                                <span className="flex items-center gap-2">
                                    Get Started
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden pt-16">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    {/* Menu Panel */}
                    <div className="relative bg-white shadow-lg mx-4 overflow-hidden">
                        <div className="p-4 space-y-1">
                            {/* Mobile Nav Items */}
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        if (item.path.startsWith('/#')) {
                                            const element = document.querySelector(item.path.substring(1))
                                            element?.scrollIntoView({ behavior: 'smooth' })
                                            setIsMenuOpen(false)
                                        } else {
                                            router.push(item.path)
                                            setIsMenuOpen(false)
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 ${
                                        activeLink === item.path 
                                            ? 'text-gray-900 bg-gray-50' 
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`p-2 ${
                                        activeLink === item.path 
                                            ? 'text-gray-900' 
                                            : 'text-gray-600'
                                    }`}>
                                        {item.icon}
                                    </div>
                                    <span className="font-medium text-sm">{item.name}</span>
                                </button>
                            ))}

                            {/* Documentation Section */}
                            <div className="pt-4">
                                <h3 className="px-4 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Documentation</h3>
                                <div className="space-y-1">
                                    {docItems.map((doc) => (
                                        <button
                                            key={doc.name}
                                            onClick={() => {
                                                router.push(doc.path)
                                                setIsMenuOpen(false)
                                            }}
                                            className="w-full px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-left transition-colors text-sm"
                                        >
                                            {doc.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="pt-4 border-t border-gray-200"></div>
                            
                            {/* CTA Buttons */}
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={() => {
                                        router.push('/login')
                                        setIsMenuOpen(false)
                                    }}
                                    className="w-full px-6 py-3.5 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        router.push('/register')
                                        setIsMenuOpen(false)
                                    }}
                                    className="w-full px-6 py-3.5 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all text-sm"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Get Started
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Styles */}
            <style jsx global>{`
                /* Smooth transitions */
                * {
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                }

                /* Prevent horizontal scroll on mobile */
                body {
                    overflow-x: hidden;
                }
            `}</style>
        </>
    )
}

export default Navigation