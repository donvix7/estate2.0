import { Building2, ShieldCheck } from 'lucide-react'

/** Quiet brand panel shared by the registration screens. */
export default function AuthCarousel({ children }) {
  return (
    <aside className="relative hidden min-h-screen w-1/2 overflow-hidden bg-[#101827] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-28 size-[28rem] rounded-full border border-white/5" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-80 rounded-full border border-white/5" />
      <div className="relative flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-white/10"><Building2 className="size-5" /></span>
        <span className="text-lg font-semibold tracking-tight">EMSS</span>
      </div>

      <div className="relative max-w-lg space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
          <ShieldCheck className="size-4 text-emerald-300" /> Secure estate management
        </div>
        <div className="space-y-4">{children}</div>
      </div>

      <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} EMSS</p>
    </aside>
  )
}
