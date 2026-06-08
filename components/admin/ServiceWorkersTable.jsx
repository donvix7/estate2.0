'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CleanTable } from '../ui/CleanTable';
import { 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  Clock, 
  Briefcase, 
  MoreHorizontal,
  Eye,
  Edit2,
  UserX,
  Trash2,
  ShieldCheck
} from 'lucide-react';

export default function ServiceWorkersTable({ workers, onRowClick, onEdit, onDelete, onStatusChange }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', () => setActiveMenu(null), true);
    window.addEventListener('resize', () => setActiveMenu(null));
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', () => setActiveMenu(null), true);
      window.removeEventListener('resize', () => setActiveMenu(null));
    };
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (activeMenu === id) {
      setActiveMenu(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      // Calculate position
      let top = rect.bottom + window.scrollY + 8;
      let left = rect.right + window.scrollX - 224; // 224 is w-56 (14rem)

      // Screen boundary checks
      const menuHeight = 240; // Approximate height
      const menuWidth = 224;
      
      if (rect.bottom + menuHeight > window.innerHeight) {
        top = rect.top + window.scrollY - menuHeight - 8;
      }
      
      if (left < 10) left = 10;
      if (left + menuWidth > window.innerWidth - 10) left = window.innerWidth - menuWidth - 10;

      setMenuPosition({ top, left });
      setActiveMenu(id);
    }
  };
  const headers = [
    'Staff Member',
    'Role & Dept',
    'Contact info',
    ""
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
          <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-semibold text-lg shrink-0 transition-colors group-hover:bg-[#1241a1] group-hover:text-white">
            {worker.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{worker.name}</div>
            <div className="text-xs text-gray-500 font-mono mt-0.5 font-medium">{worker.employeeId}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-gray-400" />
          {worker.role}
        </div>
        <div className="text-sm text-gray-500 mt-1">{worker.title}</div>
      </td>
      
      <td className="px-6 py-4 space-y-1">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
          <Phone className="w-3.5 h-3.5" />
          {worker.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
          <Mail className="w-3.5 h-3.5" />
          <span className="truncate max-w-[150px]" title={worker.email}>{worker.email}</span>
        </div>
      </td>
      
      <td className="px-6 py-4 text-right">
        <div className="relative inline-block text-left">
          <button 
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 border-none ${
              activeMenu === (worker._id || worker.id) 
                ? 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            onClick={(e) => toggleMenu(e, worker._id || worker.id)}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {mounted && activeMenu === (worker._id || worker.id) && createPortal(
            <div 
              ref={menuRef}
              style={{ 
                position: 'absolute', 
                top: `${menuPosition.top}px`, 
                left: `${menuPosition.left}px`,
                zIndex: 9999 
              }}
              className="w-56 rounded-[1.25rem] bg-slate-50 dark:bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="p-2 space-y-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onRowClick(worker); setActiveMenu(null); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                  View Profile
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); /* Logic for assignment */ setActiveMenu(null); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  Assign to Request
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit?.(worker); setActiveMenu(null); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                  <Edit2 className="w-4 h-4 text-slate-400" />
                  Edit Info
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onStatusChange?.(worker); setActiveMenu(null); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  {worker.status === 'active' ? 'Deactivate' : 'Activate'} Staff
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete?.(worker); setActiveMenu(null); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Staff
                </button>
              </div>
            </div>,
            document.body
          )}
        </div>
      </td>
      
    </>
  );

  const renderMobileItem = (worker) => (
    <div className="group flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-semibold text-xl shrink-0 transition-colors group-hover:bg-[#1241a1] group-hover:text-white">
            {worker.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">{worker.name}</h3>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5" /> {worker.role}
            </p>
          </div>
        </div>
        <div>
          {getStatusBadge(worker.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-slate-100 dark:bg-gray-800/50 p-3 rounded-md text-sm">
        <div>
          <span className="text-gray-500 text-xs block mb-1 font-semibold">Department</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{worker.department}</span>
        </div>
       
        <div className="col-span-2 space-y-1.5 pt-3 mt-1 font-medium">
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
