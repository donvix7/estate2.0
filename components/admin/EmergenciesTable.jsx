'use client';

import React from 'react';
import { CleanTable } from '../ui/CleanTable';
import { AlertTriangle, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';

export default function EmergenciesTable({ emergencies, onResolveClick }) {
  
  const headers = [
    'Emergency Info',
    'Reported By',
    'Date Logged',
    'Status',
    'Action'
  ];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            Active
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

  const getUrgencyIconColor = (type) => {
    switch (type.toLowerCase()) {
      case 'medical': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'fire': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'security': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const renderRow = (emg) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getUrgencyIconColor(emg.type)}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{emg.type} Alert</div>
            <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]" title={emg.description}>
              {emg.description}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
           <User className="w-4 h-4 text-gray-400 shrink-0" />
           <span className="font-medium whitespace-nowrap">{emg.residentName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
           <MapPin className="w-3.5 h-3.5 shrink-0" />
           {emg.unit}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {new Date(emg.date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
           <Clock className="w-3h-3" />
           {new Date(emg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col gap-1 items-start">
           {getStatusBadge(emg.status)}
           {emg.status === 'resolved' && emg.resolvedBy && (
            <span className="text-[10px] text-gray-500 max-w-[120px] truncate" title={`By ${emg.resolvedBy}`}>
              By {emg.resolvedBy}
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        {emg.status === 'active' ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onResolveClick(emg);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-red-500/20 active:scale-95 whitespace-nowrap"
          >
            Resolve
          </button>
        ) : (
          <span className="text-gray-400 italic text-sm">Completed</span>
        )}
      </td>
    </>
  );

  const renderMobileItem = (emg) => (
    <div className={`p-4 rounded-xl ${emg.status === 'active' ? 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10' : 'bg-white dark:bg-gray-800 shadow-sm'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getUrgencyIconColor(emg.type)}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{emg.type} Alert</h3>
            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> {new Date(emg.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
            </span>
          </div>
        </div>
        {getStatusBadge(emg.status)}
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {emg.description}
      </p>

      <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
         <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
           <User className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
           <div>
             <span className="block text-[10px] uppercase tracking-wider text-gray-500 -mb-0.5">Reported By</span>
             <span className="font-medium text-gray-900 dark:text-gray-200">{emg.residentName}</span>
           </div>
         </div>
         <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
           <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
           <div>
             <span className="block text-[10px] uppercase tracking-wider text-gray-500 -mb-0.5">Location</span>
             <span className="font-medium text-gray-900 dark:text-gray-200">{emg.unit}</span>
           </div>
         </div>
      </div>

      {emg.status === 'active' && (
        <div className="pt-3 flex justify-end">
           <button 
             onClick={(e) => {
               e.stopPropagation();
               onResolveClick(emg);
             }}
             className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
           >
             <CheckCircle2 className="w-4 h-4" /> Resolve Emergency
           </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30_rgb(0,0,0,0.2)] border-none">
        {/* Render the CleanTable component directly handling mobile styling using standard CSS classes within renderMobileItem instead of passing the entire component directly */}
        {/* CleanTable assumes a standard array with objects rendering rows unless customized. */}
       <CleanTable 
          headers={headers}
          data={emergencies}
          renderRow={renderRow}
          onRowClick={(item) => console.log('View Alert:', item.id)}
          emptyState="No emergency alerts found matching your criteria."
          renderMobileItem={renderMobileItem}
       />
    </div>
  );
}
