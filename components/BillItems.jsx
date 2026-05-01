
export default function BillItem({ icon: Icon, label, amount }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded bg-[#1241a1]/20 text-[#1241a1]">
          <Icon className="size-4" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold">{amount}</span>
    </div>
  )
}
