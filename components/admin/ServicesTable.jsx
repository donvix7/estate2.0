'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '../ui/StatusBadge';

export default function ServicesTable({ 
  requests
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[#1a1d23]/50 text-white0 text-[#8a8f98]">
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
            <tr key={req._id || req.id} className="hover:bg-[#2a2d33] hover:bg-[#1a1d23]/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="font-medium text-white text-white">{(req._id || req.id || '').substring(0, 10)}</div>
                <div className="text-xs text-white0 flex items-center gap-1 mt-1">
                  <Clock className="size-3" />
                  {new Date(req.createdAt || req.date || Date.now()).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-white text-white">
                  {req.residentName || req.residentId || 'Unknown Resident'}
                </div>
                <div className="text-xs text-white0 flex items-center gap-1 mt-1">
                  {req.unit || req.estateID || 'General'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-white text-white capitalize">
                  {req.type || req.category || 'Service'}
                </div>
                <div className="text-xs text-white0 truncate max-w-[200px] mt-1" title={req.desc || req.description}>
                  {req.desc || req.description || 'No description provided'}
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={req.status || 'Pending'} />
              </td>
              <td className="px-6 py-4 text-white0 text-[#8a8f98]">
                {req.serviceWorkerId || req.assignedTo ? (
                  <div className="flex items-center gap-2">
                    {req.serviceWorkerId || req.assignedTo}
                  </div>
                ) : (
                  <span className="text-[#8a8f98] italic">Unassigned</span>
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
  );
}
