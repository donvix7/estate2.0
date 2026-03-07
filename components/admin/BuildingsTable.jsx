'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CleanTable } from '../ui/CleanTable';
import { Building2, Home, Users, CheckCircle2, Wrench, AlertTriangle, UserCog, MoreVertical, Eye, Phone } from 'lucide-react';

export default function BuildingsTable({ buildings, onRowClick }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const headers = [
    'Building/Block',
    'Units (Total vs Occupied)',
    'Assigned Manager',
    'Status',
    'Actions'
  ];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Operational
          </span>
        );
      case 'fully occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Users className="w-3.5 h-3.5" />
            Fully Occupied
          </span>
        );
      case 'under maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <Wrench className="w-3.5 h-3.5" />
            Maintenance
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

  const renderRow = (block) => {
    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border-none">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">{block.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded w-fit">
                {block.id}
              </div>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center p-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg min-w-[40px]">
              <span className="text-xs text-gray-500 mb-0.5">Total</span>
              <span className="font-semibold text-gray-900 dark:text-white leading-none">{block.totalUnits}</span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <div className="flex flex-col items-center p-1.5 bg-green-50 dark:bg-green-900/10 rounded-lg min-w-[40px] border-none">
              <span className="text-xs text-green-600 dark:text-green-500 mb-0.5">Occ.</span>
              <span className="font-semibold text-green-700 dark:text-green-400 leading-none">{block.occupiedUnits}</span>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 shrink-0">
               <UserCog className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{block.manager}</span>
              <span className="text-xs text-gray-500">{block.managerPhone}</span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          {getStatusBadge(block.status)}
        </td>

        <td className="px-6 py-4">
           <div className="relative" ref={openDropdownId === block.id ? dropdownRef : null}>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={(e) => {
                   e.stopPropagation();
                   setOpenDropdownId(openDropdownId === block.id ? null : block.id);
                }}
              >
                  <MoreVertical className="w-5 h-5" />
              </button>
              
              {openDropdownId === block.id && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] border-none z-50 flex flex-col py-2 animate-fade-in">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); onRowClick(block); }} 
                     className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 w-full text-left font-medium text-sm transition-colors"
                   >
                      <Eye className="w-4 h-4 text-gray-400" />
                      View Details
                   </button>
                   <a 
                     href={`tel:${block.managerPhone}`}
                     onClick={(e) => e.stopPropagation()} 
                     className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 w-full text-left font-medium text-sm transition-colors"
                   >
                      <Phone className="w-4 h-4 text-gray-400" />
                      Contact Manager
                   </a>
                </div>
              )}
           </div>
        </td>
      </>
    );
  };

  const renderMobileItem = (block) => {
    const occupancyRate = (block.occupiedUnits / block.totalUnits) * 100;
    let progressColor = 'bg-green-500';
    if (occupancyRate < 50) progressColor = 'bg-amber-500';
    if (occupancyRate === 100) progressColor = 'bg-blue-500';

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] border-none flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border-none">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1">{block.name}</h3>
              <span className="font-mono text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                Ref: {block.id}
              </span>
            </div>
          </div>
          {getStatusBadge(block.status)}
        </div>

        <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border-none">
           <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total Units</span>
             <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><Home className="w-4 h-4 text-gray-400"/> {block.totalUnits}</span>
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1 pl-1.5">Occupied</span>
             <span className="text-lg font-bold text-green-600 dark:text-green-400 pl-1.5">{block.occupiedUnits}</span>
           </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
           <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <UserCog className="w-5 h-5 text-gray-400" />
           </div>
           <div>
              <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold">Facility Manager</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{block.manager}</span>
           </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
            <button 
               onClick={(e) => { e.stopPropagation(); onRowClick(block); }}
               className="py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center justify-center gap-2"
            >
               <Eye className="w-4 h-4" /> View Details
            </button>
            <a 
               href={`tel:${block.managerPhone}`}
               onClick={(e) => e.stopPropagation()}
               className="py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold flex items-center justify-center gap-2"
            >
               <Phone className="w-4 h-4" /> Call Manager
            </a>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden">
       <CleanTable 
          headers={headers}
          data={buildings}
          renderRow={renderRow}
          onRowClick={onRowClick}
          emptyState="No buildings found in the estate."
          renderMobileItem={renderMobileItem}
       />
    </div>
  );
}
