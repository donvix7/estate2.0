
export default function BillItem({ icon: Icon, label, amount }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a1d23]/90 bg-[#0B0C11] border-none shadow-inner">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#1a1d23] text-white text-white">
          <Icon className="size-4" />
        </div>
        <span className="text-sm font-semibold text-white text-white">{label}</span>
      </div>
      <span className="text-sm font-bold text-white text-white">{amount}</span>
    </div>
  )
}

