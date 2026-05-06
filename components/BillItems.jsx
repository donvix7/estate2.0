
export default function BillItem({ icon: Icon, label, amount }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-[#1241a1]">
          <Icon className="size-4" />
        </div>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className="text-sm font-semibold text-[#1241a1]">{amount}</span>
    </div>
  )
}
