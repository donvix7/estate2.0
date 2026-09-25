'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function BottomNav({ pathname: currentPath, links = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const routerPath = usePathname()
  const pathname = currentPath || routerPath
  const visibleLinks = links.slice(0, 4)
  const hasMore = links.length > visibleLinks.length

  return (
    <>
      <nav aria-label="Primary navigation" className="fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-[#2a2d33] bg-[#111318]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xl backdrop-blur lg:hidden">
        <div className="flex h-[4.25rem] items-center justify-around">
          {visibleLinks.map(({ href, label, icon: Icon }, index) => {
            const active = pathname === href || pathname?.startsWith(`${href}/`)
            return (
              <Link key={`${href}-${index}`} href={href} aria-current={active ? 'page' : undefined} className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-medium ${active ? 'text-blue-300' : 'text-[#8a8f98] hover:text-white'}`}>
                {Icon && <Icon className="size-5" />}
                <span className="max-w-full truncate px-1">{label}</span>
              </Link>
            )
          })}
          {hasMore && <button type="button" onClick={() => setIsOpen(true)} aria-label="More pages" className="flex min-w-12 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[#8a8f98] hover:text-white"><Menu className="size-5" /><span className="text-[10px]">More</span></button>}
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/60 p-3" onClick={() => setIsOpen(false)}>
          <section role="dialog" aria-modal="true" aria-label="All pages" className="max-h-[75vh] w-full overflow-hidden rounded-2xl border border-[#2a2d33] bg-[#111318] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#2a2d33] px-5 py-4">
              <p className="text-base font-semibold text-white">All pages</p>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close pages" className="rounded-lg p-2 text-[#8a8f98] hover:bg-[#1a1d23] hover:text-white"><X className="size-5" /></button>
            </div>
            <nav className="grid max-h-[calc(75vh-4rem)] grid-cols-2 gap-2 overflow-y-auto p-3">
              {links.map(({ href, label, icon: Icon }, index) => {
                const active = pathname === href || pathname?.startsWith(`${href}/`)
                return (
                  <Link key={`${href}-${index}`} href={href} onClick={() => setIsOpen(false)} className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-sm ${active ? 'bg-[#1241a1]/20 text-white' : 'bg-[#1a1d23]/70 text-[#b5b7be] hover:bg-[#1a1d23] hover:text-white'}`}>
                    {Icon && <Icon className={`size-[18px] shrink-0 ${active ? 'text-blue-300' : 'text-[#8a8f98]'}`} />}
                    <span className="truncate">{label}</span>
                  </Link>
                )
              })}
            </nav>
          </section>
        </div>
      )}
    </>
  )
}
