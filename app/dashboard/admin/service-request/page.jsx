'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ServicesTable from '@/components/admin/ServicesTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataStateLayout } from '@/components/ui/DataStateLayout';
import { getAllServiceRequests } from '@/lib/service';
import Pagination from '@/components/pagination';

export default function ServicesPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRequests();
  }, [page]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getAllServiceRequests(page);
      const result = data.data || data;
      setRequests(result.docs || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error('Failed to load service requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = 
      (req.residentName || '').toLowerCase().includes(searchStr) || 
      (req.residentId || '').toLowerCase().includes(searchStr) || 
      (req.type || req.category || '').toLowerCase().includes(searchStr) ||
      (req.desc || req.description || '').toLowerCase().includes(searchStr);
    
    const matchesStatus = statusFilter === 'all' || 
      (req.status || 'pending').toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <PageHeader 
        title="Service Requests" 
        description="Manage and track resident maintenance and service requests."
        icon={Wrench}
        iconColor="blue"
      >
        <Button
          icon={Users}
          onClick={() => router.push('/dashboard/admin/service_workers')}
        >
          Service Workers
        </Button>
      </PageHeader>

      {/* Toolbar */}
      <FilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search residents, services, or descriptions..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'pending', label: 'Pending' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' }
        ]}
      />

      {/* Requests Table */}
      <DataStateLayout 
        isLoading={isLoading} 
        error={null} 
        hasData={filteredRequests.length > 0}
        emptyStateMessage="No service requests match your current filters."
      >
        <ServicesTable 
          requests={filteredRequests} 
        />
      </DataStateLayout>

      <Pagination 
        page={page}
        totalPages={totalPages}
        handlePageChange={(p) => setPage(p)}
      />
    </div>
  );
}