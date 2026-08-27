import { MoreVertical } from 'lucide-react';
import React from 'react'

function ResourceItem({ icon, name, status, color, active }) {
  return (
    <div className={`p-4 flex items-center justify-between ${active ? 'bg-red-500/5' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`size-9 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-black">{name}</p>
          <p className={`text-[10px] ${active ? 'text-red-500 font-black' : 'text-white0 font-bold'}`}>{status}</p>
        </div>
      </div>
      <button className="p-1 hover:bg-[#2a2d33]  rounded-lg transition-colors">
        <MoreVertical className="w-4 h-4 text-[#8a8f98]" />
      </button>
    </div>
  );
}

export default ResourceItem