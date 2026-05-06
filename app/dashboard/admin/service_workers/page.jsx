'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Search, Plus, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import ServiceWorkersTable from '@/components/admin/ServiceWorkersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataStateLayout } from '@/components/ui/DataStateLayout';
import { LoadingState } from '@/components/ui/LoadingState';
import { getWorkers } from '@/lib/service';

export default function ServiceWorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkers();
      setWorkers(data.docs);
    } catch (error) {
      console.error('Failed to load service workers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    return (
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      worker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <PageHeader 
        title="Service Workers" 
        description="Manage maintenance staff and external service personnel."
        icon={Wrench}
        iconColor="blue"
      >
        <button 
          className="flex items-center gap-2 bg-[#1241a1] hover:brightness-110 text-white px-5 py-2.5 rounded-md font-semibold transition-all active:scale-95 border-none"
          onClick={() => router.push('/dashboard/admin/service_workers/add')}
        >
          <Plus className="w-5 h-5" />
          Add Worker
        </button>
      </PageHeader>

      {/* Toolbar */}
      <FilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search workers by name, role, or department..."
      />

      {/* Data Section */}
      {isLoading ? (
        <div className="py-20">
          <LoadingState message="Syncing Service Workforce..." />
        </div>
      ) : (
        <DataStateLayout 
          isLoading={false} 
          error={null} 
          hasData={filteredWorkers.length > 0}
          emptyStateMessage="No service workers match your current filters."
        >
          <ServiceWorkersTable 
            workers={filteredWorkers}
            searchTerm={searchTerm} 
          />
        </DataStateLayout>
      )}
    </div>
  );
}