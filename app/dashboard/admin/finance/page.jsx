'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, Search, Loader2, ArrowUpRight, CopyPlus, Wallet } from 'lucide-react';
import { api } from '@/services/api';
import FinanceTable from '@/components/admin/FinanceTable';
import StatsCard from '@/components/StatsCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataStateLayout } from '@/components/ui/DataStateLayout';

export default function FinancePage() {
  const [invoices, setInvoices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('invoices'); // invoices | transactions

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [invData, txnData] = await Promise.all([
        api.getInvoices(),
        api.getTransactions()
      ]);
      setInvoices(invData);
      setTransactions(txnData);
    } catch (error) {
      console.error('Failed to load finance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = activeTab === 'invoices' 
    ? invoices.filter(inv => {
        return inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
               inv.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               inv.description.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : transactions.filter(txn => {
        return txn.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
               txn.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               txn.reference.toLowerCase().includes(searchTerm.toLowerCase());
      });

  // Calculate stats
  const totalRevenue = transactions
    .filter(t => t.type === 'Payment' || t.type === 'Part-Payment')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const pendingInvoices = invoices.filter(i => i.status !== 'paid').length;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <PageHeader 
        title="Financial Overview" 
        description="Manage billing, invoices, and track incoming payments."
        icon={Receipt}
        iconColor="green"
      >
        <button 
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_4px_24px_rgba(34,197,94,0.25)] transition-all active:scale-95 border-none"
          onClick={() => alert("Issue New Invoice clicked")}
        >
          <CopyPlus className="w-5 h-5" />
          Issue Invoice
        </button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Revenue" 
          value={`₦${totalRevenue.toLocaleString()}`} 
          icon={Wallet} 
          color="green" 
        />
        <StatsCard 
          title="Pending Invoices" 
          value={pendingInvoices} 
          icon={Receipt} 
          color="amber" 
        />
        <StatsCard 
          title="Recent Transactions" 
          value={transactions.length} 
          icon={ArrowUpRight} 
          color="blue" 
        />
      </div>

      {/* Tabs & Toolbar */}
      <FilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder={`Search ${activeTab}...`}
      >
        <div className="flex p-1 bg-gray-100 dark:bg-gray-900/50 rounded-xl w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors border-none ${
              activeTab === 'invoices' 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            All Invoices
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors border-none ${
              activeTab === 'transactions' 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Transactions
          </button>
        </div>
      </FilterBar>

      {/* Data Section */}
      <DataStateLayout 
        isLoading={isLoading} 
        error={null} 
        hasData={filteredData.length > 0}
        emptyStateMessage={`No ${activeTab} match your current filters.`}
      >
        <FinanceTable 
          items={filteredData}
          type={activeTab}
        />
      </DataStateLayout>
    </div>
  );
}
