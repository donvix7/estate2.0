import { Building2, LoaderCircle } from 'lucide-react'

export function LoadingState({ message = 'Loading...', inline = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full items-center justify-center bg-[#0d0f13] px-5 ${inline ? 'min-h-36 rounded-xl' : 'min-h-screen'}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-5 flex size-16 items-center justify-center rounded-2xl border border-[#30343d] bg-[#15171c] shadow-lg shadow-black/20">
          <Building2 className="size-7 text-blue-300" />
          <LoaderCircle className="absolute -inset-1 size-[4.5rem] animate-spin text-blue-500/70" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-white">Loading</p>
        <p className="mt-1.5 w-full text-xs text-[#8a8f98]">{message}</p>
      </div>
    </div>
  )
}
