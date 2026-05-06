import Link from "next/link";

export default function ServiceIconLink({ href, icon: Icon, label, urgent = false }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div className={`size-12 rounded-md flex items-center justify-center transition-all ${urgent ? 'bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-[#1241a1] group-hover:text-white'}`}>
        <Icon className="size-6" />
      </div>
      <span className={`text-[11px] font-semibold text-center ${urgent ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
    </Link>
  );
}