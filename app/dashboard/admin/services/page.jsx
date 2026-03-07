'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Search } from 'lucide-react';
import { api } from '@/services/api';
import ServicesTable from '@/components/admin/ServicesTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataStateLayout } from '@/components/ui/DataStateLayout';

export default function ServicesPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await api.getServiceRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load service requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.residentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      req.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    
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
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <PageHeader 
        title="Service Requests" 
        description="Manage and track resident maintenance and service requests."
        icon={Wrench}
        iconColor="blue"
      />

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
    </div>
  );
}