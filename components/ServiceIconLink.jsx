import Link from "next/link";

export default function ServiceIconLink({ href, icon: Icon, label, urgent = false }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div className={`size-12 rounded-md flex items-center justify-center transition-all ${urgent ? 'bg-red-500/10 text-red-600 text-red-400 group-hover:bg-red-600 group-hover:text-white' : 'bg-[#1a1d23] text-[#8a8f98]  group-hover:bg-amber-700 group-hover:text-white'}`}>
        <Icon className="size-6" />
      </div>
      <span className={`text-[11px] font-semibold text-center ${urgent ? 'text-red-600 text-red-400' : 'text-[#8a8f98] text-[#8a8f98]'}`}>{label}</span>
    </Link>
  );
}