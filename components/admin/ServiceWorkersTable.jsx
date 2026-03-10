'use client';

import React from 'react';
import { CleanTable } from '../ui/CleanTable';
import { CheckCircle2, XCircle, Phone, Mail, Clock, Briefcase } from 'lucide-react';

export default function ServiceWorkersTable({ workers, onRowClick }) {
  
  const headers = [
    'Staff Member',
    'Role & Dept',
    'Contact info',
    'Shift',
    'Status'
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3.5 h-3.5" />
            Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  const renderRow = (worker) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg shrink-0">
            {worker.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{worker.name}</div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">{worker.employeeId}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-gray-400" />
          {worker.role}
        </div>
        <div className="text-sm text-gray-500 mt-1">{worker.department}</div>
      </td>
      
      <td className="px-6 py-4 space-y-1">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Phone className="w-3.5 h-3.5" />
          {worker.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Mail className="w-3.5 h-3.5" />
          <span className="truncate max-w-[150px]" title={worker.email}>{worker.email}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
          <Clock className="w-4 h-4 text-gray-400" />
          {worker.shift}
        </div>
      </td>
      
      <td className="px-6 py-4">
        {getStatusBadge(worker.status)}
      </td>
    </>
  );

  const renderMobileItem = (worker) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-xl shrink-0">
            {worker.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{worker.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5" /> {worker.role}
            </p>
          </div>
        </div>
        <div>
          {getStatusBadge(worker.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm">
        <div>
          <span className="text-gray-500 text-xs block mb-1">Department</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{worker.department}</span>
        </div>
        <div>
          <span className="text-gray-500 text-xs block mb-1">Shift</span>
          <span className="font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-1" title={worker.shift}>
             <Clock className="w-3.5 h-3.5" /> {worker.shift.split(' (')[0]}
          </span>
        </div>
        <div className="col-span-2 space-y-1.5 pt-3 mt-1">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{worker.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{worker.email}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CleanTable 
      headers={headers}
      data={workers}
      renderRow={renderRow}
      renderMobileItem={renderMobileItem}
      onRowClick={onRowClick}
      emptyState="No service workers found."
    />
  );
}
