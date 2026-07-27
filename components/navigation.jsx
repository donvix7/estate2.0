'use client'

import { useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { 
  Menu, 
  X, 
  LogIn, 
  User, 
  LogOut, 
  LayoutDashboard 
} from 'lucide-react'
import { getResidentData } from '@/lib/service'
import { Logout } from '@/lib/action'
import Link from 'next/link'

const Navigation = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [role, setRole] = useState('')

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const result = await getResidentData();
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
            router.push('/auth/login');
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

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
    };

    if (isLoading) {
        return (
            <header className="fixed top-[24px] left-0 right-0 z-50 flex items-center justify-center px-4 w-full pointer-events-none">
                <div className="pointer-events-auto w-full max-w-[700px] flex items-center justify-between bg-black/95 backdrop-blur-xl rounded-full px-2 py-2 shadow-xl border border-white/10 h-[56px]">
                    <div className="flex items-center gap-6 pl-2">
                        <div className="w-[34px] h-[34px] rounded-full border border-page-bg/80 flex items-center justify-center shrink-0">
                            <span className="text-page-bg font-bold text-sm leading-none">E</span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin mr-2"></div>
                </div>
            </header>
        )
    }

    return (
        <>
            <header className="fixed top-[24px] left-0 right-0 z-50 flex items-center justify-center px-4 w-full pointer-events-none">
                <div className="pointer-events-auto w-full max-w-[700px] flex items-center justify-between bg-black/95 backdrop-blur-xl rounded-full px-2 py-2 shadow-xl border border-white/10 h-[56px]">
                    <div className="flex items-center gap-6 pl-2">
                        {/* Logo */}
                        <div 
                            onClick={() => router.push('/')}
                            className="w-[34px] h-[34px] rounded-full border border-page-bg/80 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
                        >
                            <span className="text-page-bg font-bold text-sm leading-none">E</span>
                        </div>
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <button 
                                onClick={() => handleNavClick('/#features')} 
                                className="font-label text-label text-page-bg/80 hover:text-page-bg transition-colors duration-300 cursor-pointer bg-transparent border-0 outline-none"
                            >
                                Features
                            </button>
                            <button 
                                onClick={() => handleNavClick('/pricing')} 
                                className="font-label text-label text-page-bg/80 hover:text-page-bg transition-colors duration-300 cursor-pointer bg-transparent border-0 outline-none"
                            >
                                Pricing
                            </button>
                            <button 
                                onClick={() => handleNavClick('/#console')} 
                                className="font-label text-label text-page-bg/80 hover:text-page-bg transition-colors duration-300 cursor-pointer bg-transparent border-0 outline-none"
                            >
                                Console
                            </button>
                            <button 
                                onClick={() => handleNavClick('/#estates')} 
                                className="font-label text-label text-page-bg/80 hover:text-page-bg transition-colors duration-300 cursor-pointer bg-transparent border-0 outline-none"
                            >
                                Estates
                            </button>
                            <button 
                                onClick={() => handleNavClick('/#faq')} 
                                className="font-label text-label text-page-bg/80 hover:text-page-bg transition-colors duration-300 cursor-pointer bg-transparent border-0 outline-none"
                            >
                                FAQ
                            </button>
                        </nav>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {!isLoggedIn ? (
                            <>
                                <button 
                                    onClick={() => router.push('/auth/login')}
                                    className="font-label text-page-bg/80 hover:text-page-bg transition-colors duration-300 text-[10px] font-semibold uppercase tracking-wider bg-transparent border-0 px-2 cursor-pointer outline-none"
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => router.push('/auth/register')}
                                    className="font-label rounded-full bg-white text-black hover:bg-page-bg/85 transition-all duration-300 shrink-0 flex items-center px-4 text-[10px] h-[32px] font-semibold uppercase tracking-wider cursor-pointer border-0 outline-none"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => router.push(role === 'admin' ? '/dashboard/admin' : '/dashboard/resident')}
                                    className="font-label rounded-full bg-white text-black hover:bg-page-bg/85 transition-all duration-300 shrink-0 flex items-center px-4 text-[10px] h-[32px] font-semibold uppercase tracking-wider cursor-pointer border-0 outline-none"
                                >
                                    Dashboard
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="font-label text-page-bg/80 hover:text-page-bg transition-colors duration-300 text-[10px] font-semibold uppercase tracking-wider bg-transparent border-0 px-2 cursor-pointer outline-none"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center pr-2">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1 text-white hover:bg-white/10 rounded-lg transition-colors bg-transparent border-0 cursor-pointer outline-none"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[200] md:hidden overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    <div className="absolute top-0 right-0 h-full w-full max-w-xs bg-deep-black border-l border-white/10 shadow-2xl p-6 flex flex-col z-[210] animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-[30px] h-[30px] rounded-full border border-page-bg/80 flex items-center justify-center shrink-0">
                                    <span className="text-page-bg font-bold text-xs leading-none">E</span>
                                </div>
                                <span className="font-bold text-lg text-white">EstateEase</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border-0 outline-none cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3">
                            {['Features', 'Pricing', 'Console', 'Estates', 'FAQ'].map((link) => {
                                const path = link === 'Pricing' ? '/pricing' : `/#${link.toLowerCase()}`
                                return (
                                    <button
                                        key={link}
                                        onClick={() => handleNavClick(path)}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white font-label text-xs uppercase tracking-wider transition-colors bg-transparent border-0 outline-none cursor-pointer"
                                    >
                                        {link}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="pt-6 mt-auto space-y-3 border-t border-white/10">
                            {!isLoggedIn ? (
                                <>
                                    <button 
                                        onClick={() => { setIsMenuOpen(false); router.push('/auth/register'); }}
                                        className="w-full py-3 text-center font-label text-[10px] uppercase font-bold tracking-wider bg-white text-black hover:bg-page-bg/90 rounded-full transition-colors border-0 outline-none cursor-pointer"
                                    >
                                        Get Started
                                    </button>
                                    <button 
                                        onClick={() => { setIsMenuOpen(false); router.push('/auth/login'); }}
                                        className="w-full py-3 text-center font-label text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white hover:bg-white/20 rounded-full transition-colors border-0 outline-none cursor-pointer"
                                    >
                                        Login
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => { setIsMenuOpen(false); router.push(role === 'admin' ? '/dashboard/admin' : '/dashboard/resident'); }}
                                        className="w-full py-3 text-center font-label text-[10px] uppercase font-bold tracking-wider bg-white text-black hover:bg-page-bg/90 rounded-full transition-colors border-0 outline-none cursor-pointer"
                                    >
                                        Dashboard
                                    </button>
                                    <button 
                                        onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                                        className="w-full py-3 text-center font-label text-[10px] uppercase font-bold tracking-wider bg-red-600 text-white hover:bg-red-700 rounded-full transition-colors border-0 outline-none cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navigation