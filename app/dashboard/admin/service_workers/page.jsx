'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Plus, Loader2 } from 'lucide-react';
import ServiceWorkersTable from '@/components/admin/ServiceWorkersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataStateLayout } from '@/components/ui/DataStateLayout';
import { LoadingState } from '@/components/ui/LoadingState';
import { getWorkers } from '@/lib/service';
import Pagination from '@/components/pagination';

export default function ServiceWorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  useEffect(() => {
    loadWorkers();
  }, [page]);

  const loadWorkers = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkers(page);
      const result = data.data || data;
      setWorkers(result.docs || []);
      setTotalPages(result.totalPages || 1);
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
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <PageHeader 
        title="Service Workers" 
        description="Manage maintenance staff and external service personnel."
        icon={Wrench}
        iconColor="blue"
      >
        <Button
          icon={Plus}
          onClick={() => router.push('/dashboard/admin/service_workers/add')}
        >
          Add Worker
        </Button>
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
            onRowClick={(worker) => router.push(`/dashboard/admin/service_workers/${worker._id || worker.id}`)}
          />
        </DataStateLayout>
      )}

      <Pagination 
        page={page}
        totalPages={totalPages}
        handlePageChange={(p) => setPage(p)}
      />
    </div>
  );
}