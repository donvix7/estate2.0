export default function ServiceRow({ id, category, icon: Icon, iconColor, desc, status, statusColor }) {
  return (
    <tr className="hover:bg-[#1a1d23]/50 hover:bg-[#1a1d23]/40 transition-colors">
      <td className="px-6 py-4 font-semibold text-white ">{id}</td>
      <td className="px-6 py-4">
        <span className="flex items-center gap-2 font-medium">
          <Icon className={`size-4 ${iconColor}`} />
          {category}
        </span>
      </td>
      <td className="px-6 py-4 text-white0 text-[#8a8f98] font-medium max-w-xs truncate" title={desc}>{desc}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#2a2d33]/10 text-white0'}`}>
          <span className={`size-1.5 rounded-full ${statusColor} ${status === 'In Progress' ? 'animate-pulse' : ''}`}></span>
          {status}
        </span>
      </td>
      
    </tr>
  )
}