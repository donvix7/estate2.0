'use client';

import React from 'react';
import { CleanTable } from '../ui/CleanTable';
import { CheckCircle2, Box, MapPin, Clock, User, Info } from 'lucide-react';

export default function LostAndFoundTable({ items, onRowClick }) {
  
  const headers = [
    'Item Details',
    'Location Found',
    'Found By',
    'Date Logged',
    'Status'
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'claimed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Claimed
          </span>
        );
      case 'unclaimed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Info className="w-3.5 h-3.5" />
            Unclaimed
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

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{item.itemName}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.category}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate max-w-[180px]" title={item.locationFound}>{item.locationFound}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate max-w-[150px]" title={item.foundBy}>{item.foundBy}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
          <Clock className="w-4 h-4 text-gray-400" />
          {new Date(item.dateFound).toLocaleDateString()}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1 items-start">
          {getStatusBadge(item.status)}
          {item.status === 'claimed' && item.claimedBy && (
            <span className="text-[10px] text-gray-500 max-w-[120px] truncate" title={`By ${item.claimedBy}`}>
              By {item.claimedBy}
            </span>
          )}
        </div>
      </td>
    </>
  );

  const renderMobileItem = (item) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{item.itemName}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
              {item.category}
            </p>
          </div>
        </div>
        <div>
          {getStatusBadge(item.status)}
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50 text-sm space-y-2.5">
        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
          <div>
            <span className="text-gray-500 text-xs block -mt-0.5">Location Found</span>
            <span className="font-medium">{item.locationFound}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-3 pt-2 border-t border-gray-200 dark:border-gray-700/50">
          <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <User className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-500 text-[10px] uppercase tracking-wider block -mt-0.5 mb-0.5">Found By</span>
              <span className="font-medium text-xs line-clamp-1" title={item.foundBy}>{item.foundBy}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <Clock className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-500 text-[10px] uppercase tracking-wider block -mt-0.5 mb-0.5">Date Logged</span>
              <span className="font-medium text-xs">{new Date(item.dateFound).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {item.status === 'claimed' && (
           <div className="pt-2 border-t border-gray-200 dark:border-gray-700/50 flex items-start gap-2 text-green-700 dark:text-green-400">
             <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
             <div>
               <span className="text-green-600/70 dark:text-green-400/70 text-[10px] uppercase tracking-wider block -mt-0.5 mb-0.5">Claimed By</span>
               <span className="font-medium text-xs">{item.claimedBy}</span>
             </div>
           </div>
        )}
      </div>
    </div>
  );

  return (
    <CleanTable 
      headers={headers}
      data={items}
      renderRow={renderRow}
      renderMobileItem={renderMobileItem}
      onRowClick={onRowClick}
      emptyState="No items have been reported yet."
    />
  );
}
