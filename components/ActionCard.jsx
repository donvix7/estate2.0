import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default 
function ActionCard({ icon: Icon, title, desc, href = '#' }) {
  return (
    <Link href={href} className="group p-5 bg-white dark:bg-slate-900 rounded-xl hover:border-[#1241a1] transition-all cursor-pointer text-left">
      <div className="bg-[#1241a1]/10 text-[#1241a1] p-3 rounded-lg w-fit mb-4 group-hover:bg-[#1241a1] group-hover:text-white transition-colors">
        <Icon className="size-6" />
      </div>
      <h4 className="font-bold mb-1 text-sm">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
    </Link>
  )
}


