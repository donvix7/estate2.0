'use client';

import React from 'react';
import { CleanTable } from '../ui/CleanTable';
import { FileText, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FinanceTable({ items, type = 'invoices', onRowClick }) {
  
  const isInvoice = type === 'invoices';
  
  const headers = isInvoice 
    ? ['Invoice Details', 'Resident', 'Amount', 'Dates', 'Status']
    : ['Transaction Details', 'Resident', 'Amount', 'Method', 'Status'];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'overdue':
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
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

  const renderRow = (item) => {
    if (isInvoice) {
      return (
        <>
          <td className="px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{item.id}</div>
                <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]" title={item.description}>{item.description}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="font-medium text-gray-900 dark:text-white">{item.residentName}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.unit}</div>
          </td>
          <td className="px-6 py-4">
            <div className="font-bold text-gray-900 dark:text-white">${item.amount.toLocaleString()}</div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
            <div>Issued: {new Date(item.dateIssued).toLocaleDateString()}</div>
            <div className={item.status === 'overdue' ? 'text-red-500' : ''}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </div>
          </td>
          <td className="px-6 py-4">
            {getStatusBadge(item.status)}
          </td>
        </>
      );
    }
    
    // Transactions Row
    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
               {item.type.includes('Payment') ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{item.id}</div>
              <div className="text-xs text-gray-500 mt-0.5">{new Date(item.date).toLocaleString()}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
            <div className="font-medium text-gray-900 dark:text-white">{item.residentName}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.unit}</div>
        </td>
        <td className="px-6 py-4">
          <div className="font-bold text-gray-900 dark:text-white">${item.amount.toLocaleString()}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900 dark:text-gray-300 font-medium">{item.method}</div>
          <div className="text-xs text-gray-500 mt-0.5">Ref: {item.reference}</div>
        </td>
        <td className="px-6 py-4">
          {getStatusBadge(item.status)}
        </td>
      </>
    );
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <CleanTable 
          headers={headers}
          data={items}
          renderRow={renderRow}
          onRowClick={onRowClick}
          emptyState={`No ${type} found matching your criteria.`}
        />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500 italic">
            No {type} found matching your criteria.
          </div>
        ) : (
          items.map((item, index) => (
            <div 
              key={item.id}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-900 space-y-4 active:scale-[0.98] transition-all ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isInvoice ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {isInvoice ? <FileText className="w-5 h-5" /> : (item.type?.includes('Payment') ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.id}</h4>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{isInvoice ? item.description : item.method}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-slate-50 dark:border-slate-900/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resident</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.residentName}</p>
                  <p className="text-[10px] text-slate-500 font-medium italic">{item.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{isInvoice ? 'Due Date' : 'Transaction Date'}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">${item.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {new Date(isInvoice ? item.dueDate : item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
