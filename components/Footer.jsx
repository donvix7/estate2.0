'use client'

import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-xl pb-lg px-margin rounded-t-[64px] relative z-20">
      <div className="max-w-[1728px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl mb-xl">
          {/* Brand Column */}
          <div className="flex flex-col gap-8">
            <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg leading-none">E</span>
            </div>
            <p className="font-body-md text-white/50 max-w-xs">
              The operating system for modern residential communities. Empowering operations through intelligent, automated tools.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px] text-white/70">share</span>
              </a>
              <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px] text-white/70">public</span>
              </a>
              <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px] text-white/70">hub</span>
              </a>
            </div>
          </div>
          {/* Navigation Columns */}
          <div>
            <h4 className="font-label text-white mb-6 uppercase tracking-widest text-[10px]">Product</h4>
            <ul className="flex flex-col gap-4">
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="/#features">Platform</Link></li>
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="/#console">Interactive Console</Link></li>
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="/#estates">Properties</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label text-white mb-6 uppercase tracking-widest text-[10px]">Company</h4>
            <ul className="flex flex-col gap-4">
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="#">About Us</Link></li>
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="#">Careers</Link></li>
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="#">Newsroom</Link></li>
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="#">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label text-white mb-6 uppercase tracking-widest text-[10px]">Resources</h4>
            <ul className="flex flex-col gap-4">
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="/#faq">FAQ</Link></li>
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="#">Documentation</Link></li>
              <li><Link className="font-body-md text-white/60 hover:text-white transition-colors" href="#">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-md border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label text-[11px] text-white/40">© 2026 EstateEase Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link className="font-label text-[11px] text-white/40 hover:text-white transition-colors" href="#">Privacy Policy</Link>
            <Link className="font-label text-[11px] text-white/40 hover:text-white transition-colors" href="#">Terms of Service</Link>
            <Link className="font-label text-[11px] text-white/40 hover:text-white transition-colors" href="#">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}