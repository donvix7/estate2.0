'use client';

import React from 'react';
import { Clock, User, Home, Pickaxe, Loader2 } from 'lucide-react';

export default function ServicesTable({ 
  requests, 
  getStatusColor 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">ID / Date</th>
              <th className="px-6 py-4 font-semibold">Resident</th>
              <th className="px-6 py-4 font-semibold">Service Type</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Assigned To</th>
            </tr>
          </thead>
          <tbody className="">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{req.id}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(req.dateRequested).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                      {req.residentName.charAt(0)}
                    </div>
                    {req.residentName}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Home className="w-3 h-3" />
                    {req.unit}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {req.serviceType}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px] mt-1" title={req.description}>
                    {req.description}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {req.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {req.assignedTo}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
