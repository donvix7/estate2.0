'use client';

import { Clock, Home, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ServicesTable({ 
  requests, 
  getStatusColor 
}) {
  const router = useRouter();
  
  return (
    <div className="bg-slate-100 dark:bg-gray-800 rounded-xl ">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-200 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 ">
            <tr>
              <th className="px-6 py-4 font-semibold">ID / Date</th>
              <th className="px-6 py-4 font-semibold">Resident</th>
              <th className="px-6 py-4 font-semibold">Service Type</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Assigned To</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {requests.map((req) => (
              <tr key={req._id || req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{(req._id || req.id || '').substring(0, 10)}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(req.createdAt || req.date || Date.now()).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    
                    {req.residentName || req.residentId || 'Unknown Resident'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    {req.unit || req.estateID || 'General'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white capitalize">
                    {req.type || req.category || 'Service'}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px] mt-1" title={req.desc || req.description}>
                    {req.desc || req.description || 'No description provided'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${getStatusColor(req.status || 'pending')}`}>
                    {req.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {req.serviceWorkerId || req.assignedTo ? (
                    <div className="flex items-center gap-2">
                      {req.serviceWorkerId || req.assignedTo}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/dashboard/admin/service-request/${req._id || req.id}`}
                      className="text-[#1241a1] hover:underline text-xs font-bold transition-all border-none bg-transparent"
                    >
                      View 
                    </Link>
                 
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
