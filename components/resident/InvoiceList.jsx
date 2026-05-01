"use client"
import React, { useState } from 'react'
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronDown,
  Eye
} from 'lucide-react'
import Link from 'next/link';
import { getInvoices } from '@/lib/service';


const getStatusConfig = (status) => {
  switch (status) {
    case 'paid':
      return {
        icon: CheckCircle2,
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800/30',
        label: 'Paid'
      }
    case 'unpaid':
      return {
        icon: Clock,
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800/30',
        label: 'Pending'
      }
    case 'overdue':
      return {
        icon: AlertCircle,
        bg: 'bg-red-50 dark:bg-red-500/10',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800/30',
        label: 'Overdue'
      }
    default:
      return {
        icon: Receipt,
        bg: 'bg-gray-50 dark:bg-gray-500/10',
        text: 'text-gray-700 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-800/30',
        label: status
      }
  }
}

export default async function InvoiceList() {

    const invoices = await getInvoices();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = invoices.docs.filter(inv => {
    const matchesSearch = inv.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = invoices.docs
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)]">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Total Invoices</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_INVOICES.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                </div>
                <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Outstanding Balance</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white relative z-10">
                ₦{totalOutstanding.toLocaleString()}
            </p>
        </div>
        
        <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl p-5 shadow-lg shadow-blue-500/20 text-white flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
             <h3 className="font-medium text-blue-100 mb-2">Need to settle a bill?</h3>
           <Link href="/dashboard/resident/finance">
           <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl font-medium transition-all w-fit backdrop-blur-md">
                 <CreditCard className="w-4 h-4" />
                 Pay Outstanding
             </button>
           </Link>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] overflow-hidden">
        
        {/* Header / Controls */}
        <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input 
                    type="text"
                    placeholder="Search invoice by ID or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-transparent dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition-all"
                />
            </div>
            
            <div className="flex items-center gap-2">
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-transparent dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 dark:text-gray-300 transition-all cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <Filter className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Invoice List */}
        <div className="flex flex-col gap-2 p-2 pt-0">
            {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => {
                    const status = getStatusConfig(invoice.status);
                    const StatusIcon = status.icon;

                    return (
                        <div key={invoice.id} className="p-4 md:p-5 hover:bg-gray-50 dark:hover:bg-gray-800/80 rounded-xl transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-4">
                            
                            {/* Left: Info */}
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center shrink-0">
                                    <Receipt className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{invoice.title}</h4>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border} flex items-center gap-1`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate max-w-sm lg:max-w-md">
                                        {invoice.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-500">
                                        <span>ID: {invoice.id}</span>
                                        <span>•</span>
                                        <span>Issued: {new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year:'numeric' })}</span>
                                        {invoice.status !== 'paid' && (
                                            <>
                                                <span>•</span>
                                                <span className={invoice.status === 'overdue' ? 'text-red-500 dark:text-red-400' : ''}>
                                                    Due: {new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year:'numeric' })}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Amount & Actions */}
                            <div className="flex items-center justify-between md:justify-end gap-6 ml-16 md:ml-0">
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        ₦{invoice.amount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {invoice.status !== 'paid' ? (
                                        <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold transition-colors">
                                            Pay
                                        </button>
                                    ) : (
                                        <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors" title="View Receipt">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors" title="Download PDF">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    );
                })
            ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                        <Receipt className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No invoices found</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                        No invoices match your current search or filter criteria.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
