'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import ServicesTable from '@/components/admin/ServicesTable';
import { PageHeader } from '@/components/ui/PageHeader';
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <PageHeader 
        title="Service Requests" 
        description="Manage and track resident maintenance and service requests."
        icon={Wrench}
        iconColor="blue"
      >
        <button 
          onClick={() => router.push('/dashboard/admin/service_workers')}
          className="flex items-center gap-2 bg-[#1241a1] hover:brightness-110 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-[#1241a1]/20 border-none"
        >
          <Users className="size-4" />
          Service Workers
        </button>
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
          getStatusColor={getStatusColor}
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