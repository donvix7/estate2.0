import Link from "next/link";

export default function ServiceIconLink({ href, icon: Icon, label, urgent = false }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div className={`size-12 rounded-xl flex items-center justify-center transition-all ${urgent ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-active:bg-[#1241a1]/10 group-active:text-[#1241a1]'}`}>
        <Icon className="size-6" />
      </div>
      <span className={`text-[11px] font-medium text-center ${urgent ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
    </Link>
  );
}