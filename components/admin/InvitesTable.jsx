'use client';

import React from 'react';
import { CleanTable } from '../ui/CleanTable';
import { Mail, CheckCircle2, Clock, XCircle, User, Home, QrCode } from 'lucide-react';

export default function InvitesTable({ invites, onRowClick }) {
  
  const headers = [
    'Resident/Unit',
    'Guest Details',
    'Invite Info',
    'Access Code',
    'Status'
  ];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'expired':
      case 'rejected':
      case 'revoked':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3.5 h-3.5" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
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

  const renderRow = (invite) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
             {invite.residentName === 'System' ? <Clock className="w-5 h-5"/> : <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{invite.residentName}</div>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Home className="w-3 h-3" />
              {invite.unit}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 dark:text-white">{invite.guestName}</div>
        <div className="text-xs text-gray-500 mt-0.5">{invite.type}</div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {new Date(invite.date).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {new Date(invite.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 w-fit px-2.5 py-1 rounded-lg">
          <QrCode className="w-3.5 h-3.5 text-gray-400" />
          {invite.code}
        </div>
      </td>
      
      <td className="px-6 py-4">
        {getStatusBadge(invite.status)}
      </td>
    </>
  );

  const renderMobileItem = (invite) => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{invite.guestName}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
            {invite.type}
          </span>
        </div>
        {getStatusBadge(invite.status)}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50">
        <div className="grid grid-cols-2 gap-y-3">
          <div>
            <span className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Host</span>
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              {invite.residentName === 'System' ? 'Admin / System' : invite.residentName}
            </span>
          </div>
          <div>
            <span className="text-gray-500 text-[10px] uppercase tracking-wider block mb-1">Date</span>
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {new Date(invite.date).toLocaleDateString()}
            </span>
          </div>
          <div className="col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700/50 flex align-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
               <Home className="w-4 h-4"/> {invite.unit}
            </span>
            <span className="font-mono text-sm font-bold tracking-widest text-gray-800 dark:text-gray-200">
              {invite.code}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CleanTable 
      headers={headers}
      data={invites}
      renderRow={renderRow}
      renderMobileItem={renderMobileItem}
      onRowClick={onRowClick}
      emptyState="No invites found."
    />
  );
}
