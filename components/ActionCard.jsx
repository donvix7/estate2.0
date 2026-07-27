import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default 
function ActionCard({ icon: Icon, title, desc, href = '#' }) {
  return (
    <Link href={href} className="group p-6 bg-[#818b94]/30 dark:bg-[#818b94]/40 rounded-md transition-all cursor-pointer text-left">
      <div className="bg-white dark:bg-slate-100 text-amber-500 p-3 dark:text-black font-bold rounded-md w-fit mb-4 group-hover:bg-amber-700 group-hover:text-white transition-all">
        <Icon className="size-6" />
      </div>
      <h4 className="font-semibold mb-1 text-sm text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-200 font-medium leading-relaxed">{desc}</p>
    </Link>
  )
}


