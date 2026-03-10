'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, PackageSearch, Plus } from 'lucide-react';
import { api } from '@/services/api';
import LostAndFoundTable from '@/components/admin/LostAndFoundTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataStateLayout } from '@/components/ui/DataStateLayout';
import { toast } from 'react-toastify';

export default function LostAndFoundPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLostAndFoundItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to load lost and found items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationFound.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.foundBy.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <PageHeader 
        title="Lost & Found" 
        description="Log and track items found within the estate premises."
        icon={PackageSearch}
        iconColor="purple"
      >
        <button 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_4px_24px_rgba(168,85,247,0.25)] transition-all active:scale-95 border-none"
          onClick={() => toast.info("Report Found Item feature coming soon.")}
        >
          <Plus className="w-5 h-5" />
          Report Item
        </button>
      </PageHeader>

      {/* Toolbar */}
      <FilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search exactly what, where, or who found it..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'unclaimed', label: 'Unclaimed' },
          { value: 'claimed', label: 'Claimed' },
          { value: 'discarded', label: 'Discarded' }
        ]}
      />

      {/* Data Section */}
      <DataStateLayout 
        isLoading={isLoading} 
        error={null} 
        hasData={filteredItems.length > 0}
        emptyStateMessage="No reported items match your current filters."
      >
        <LostAndFoundTable 
          items={filteredItems}
        />
      </DataStateLayout>
    </div>
  );
}