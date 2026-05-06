
export default function AnnouncementItem({ icon: Icon, title, desc, time, urgent = false }) {
  return (
    <div className="group flex gap-4 p-4 rounded-md hover:bg-white dark:hover:bg-slate-800/50 transition-all cursor-pointer text-left">
      <div className="shrink-0 size-12 bg-[#1241a1]/10 rounded-md flex items-center justify-center text-[#1241a1] transition-colors group-hover:bg-[#1241a1] group-hover:text-white">
        <Icon className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">{title}</h4>
          {urgent && <span className="text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-full font-semibold">URGENT</span>}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{desc}</p>
        <p className="text-[10px] text-slate-400 mt-1">{time} • Building Management</p>
      </div>
    </div>
  )
}