import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default 
function ActionCard({ icon: Icon, title, desc, href = '#' }) {
  return (
    <Link href={href} className="group p-6 bg-[#818b94]/30 bg-[#818b94]/40 rounded-md transition-all cursor-pointer text-left">
      <div className="bg-white bg-[#1a1d23] text-amber-500 p-3 text-black font-bold rounded-md w-fit mb-4 group-hover:bg-amber-700 group-hover:text-white transition-all">
        <Icon className="size-6" />
      </div>
      <h4 className="font-semibold mb-1 text-sm text-white text-white">{title}</h4>
      <p className="text-xs text-white0 text-white font-medium leading-relaxed">{desc}</p>
    </Link>
  )
}


