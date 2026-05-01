export default function ServiceRow({ id, category, icon: Icon, iconColor, desc, status, statusColor }) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
      <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{id}</td>
      <td className="px-6 py-4">
        <span className="flex items-center gap-2 font-medium">
          <Icon className={`size-4 ${iconColor}`} />
          {category}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium max-w-xs truncate" title={desc}>{desc}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-500/10 text-slate-500'}`}>
          <span className={`size-1.5 rounded-full ${statusColor} ${status === 'In Progress' ? 'animate-pulse' : ''}`}></span>
          {status}
        </span>
      </td>
      
    </tr>
  )
}