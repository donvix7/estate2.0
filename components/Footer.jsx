'use client'

import React from 'react';
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Linkedin, ArrowRight, Building2, Info, LayoutDashboard, AlertTriangle, Lock, X, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#111621] border-t border-slate-900 dark:border-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-10 bg-[#1241a1] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#1241a1]/20">
                <Building2 className="size-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter dark:text-white">EstatePro</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              The world's most sophisticated all-in-one management suite designed exclusively for luxury residences and smart estates.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-900 flex items-center justify-center text-slate-400 hover:text-[#1241a1] hover:border-[#1241a1] transition-all"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-8">Product</h4>
            <ul className="space-y-4">
              <FooterLink href="#features">Core Features</FooterLink>
              <FooterLink href="#">Pricing Plans</FooterLink>
              <FooterLink href="#">Security Protocols</FooterLink>
              <FooterLink href="#">Mobile Application</FooterLink>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-8">Resources</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Community Guidelines</FooterLink>
              <FooterLink href="#">Estate Partners</FooterLink>
              <FooterLink href="#">API Documentation</FooterLink>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-8">Newsletter</h4>
            <p className="text-sm text-slate-500 mb-6">Stay updated with the latest in modern estate management.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-900 dark:border-slate-900 rounded-xl focus:outline-none focus:border-[#1241a1] transition-all text-sm"
              />
              <button className="absolute right-2 top-2 size-8 bg-[#1241a1] text-white rounded-lg flex items-center justify-center hover:bg-[#1241a1]/90 transition-all">
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
            © {new Date().getFullYear()} EstatePro Management. Built for the future of living.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href="#" className="hover:text-[#1241a1] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#1241a1] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#1241a1] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FooterLink = ({ href, children }) => (
  <li>
    <Link 
      href={href} 
      className="text-slate-500 dark:text-slate-400 hover:text-[#1241a1] dark:hover:text-white font-medium transition-colors block text-sm"
    >
      {children}
    </Link>
  </li>
)