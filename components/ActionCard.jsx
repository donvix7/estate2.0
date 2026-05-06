import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default 
function ActionCard({ icon: Icon, title, desc, href = '#' }) {
  return (
    <Link href={href} className="group p-6 bg-slate-100 dark:bg-slate-800/30 rounded-md transition-all cursor-pointer text-left">
      <div className="bg-white dark:bg-slate-900 text-[#1241a1] p-3 rounded-md w-fit mb-4 group-hover:bg-[#1241a1] group-hover:text-white transition-all">
        <Icon className="size-6" />
      </div>
      <h4 className="font-semibold mb-1 text-sm text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
    </Link>
  )
}


