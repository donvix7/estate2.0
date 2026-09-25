'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Building2, Menu, X, Settings, HelpCircle, LogOut, ShieldAlert, User } from 'lucide-react'
import { AlertModal } from '../ui/AlertModal'
import { handleLogout } from '@/lib/action'

export default function DashboardMobileNav({ links = [], user, role, estateName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const closeMenu = () => setIsMenuOpen(false)

  const logoutUser = async () => {
    await handleLogout()
    router.replace('/auth/login')
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#2a2d33] bg-[#0d0f13]/95 px-4 backdrop-blur lg:hidden">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1241a1] text-white"><Building2 className="size-5" /></span>
          <span className="min-w-0">
            <span className="block text-sm font-bold leading-tight text-white">EMSS</span>
            <span className="block truncate text-[10px] font-medium text-[#8a8f98]">{estateName || 'Estate Portal'}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {role === 'resident' && (
            <Link href="/dashboard/resident/emergency" aria-label="Emergency contact" className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20">
              <ShieldAlert className="size-5" />
            </Link>
          )}
          <button type="button" onClick={() => setIsMenuOpen(true)} aria-label="Open navigation" className="flex size-10 items-center justify-center rounded-xl border border-[#2a2d33] text-[#c6c8ce] hover:bg-[#1a1d23]">
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60" onClick={closeMenu}>
          <aside className="ml-auto flex h-full w-[min(22rem,88vw)] flex-col border-l border-[#2a2d33] bg-[#111318] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#2a2d33] p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1a1d23] text-[#c6c8ce]"><User className="size-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user?.name || user?.firstName || 'Account'}</p>
                  <p className="truncate text-xs text-[#8a8f98]">{estateName || role || 'Estate member'}</p>
                </div>
              </div>
              <button type="button" onClick={closeMenu} aria-label="Close navigation" className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#8a8f98] hover:bg-[#1a1d23] hover:text-white"><X className="size-5" /></button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {links.map(({ href, label, icon: Icon = Building2, badge }) => {
                const active = pathname === href || pathname?.startsWith(`${href}/`)
                return (
                  <Link key={href} href={href} onClick={closeMenu} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${active ? 'bg-[#1241a1]/20 text-white' : 'text-[#a4a7af] hover:bg-[#1a1d23] hover:text-white'}`}>
                    <Icon className={`size-[18px] shrink-0 ${active ? 'text-blue-300' : 'text-[#8a8f98]'}`} />
                    <span className="flex-1">{label}</span>
                    {badge > 0 && <span className="rounded-full bg-[#1241a1] px-2 py-0.5 text-[10px] font-semibold text-white">{badge}</span>}
                  </Link>
                )
              })}
            </nav>

            <div className="space-y-1 border-t border-[#2a2d33] p-3">
              <Link href={`/dashboard/${role}/settings`} onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#a4a7af] hover:bg-[#1a1d23] hover:text-white"><Settings className="size-[18px]" />Settings</Link>
              <Link href={`/dashboard/${role}/help`} onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#a4a7af] hover:bg-[#1a1d23] hover:text-white"><HelpCircle className="size-[18px]" />Help & support</Link>
              <button type="button" onClick={() => { closeMenu(); setShowLogoutConfirm(true) }} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-red-400 hover:bg-red-500/10"><LogOut className="size-[18px]" />Sign out</button>
            </div>
          </aside>
        </div>
      )}

      <AlertModal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} onConfirm={logoutUser} title="Sign out?" message="You can sign back in at any time." confirmText="Sign out" type="warning" showCancel />
    </>
  )
}
