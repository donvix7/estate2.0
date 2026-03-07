'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Search, Loader2, Home, Users } from 'lucide-react';
import { api } from '@/services/api';
import BuildingsTable from '@/components/admin/BuildingsTable';
import StatsCard from '@/components/StatsCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataStateLayout } from '@/components/ui/DataStateLayout';

export default function EstatesPage() {
  const [buildings, setBuildings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    setIsLoading(true);
    try {
      const data = await api.getBuildings();
      setBuildings(data);
    } catch (error) {
      console.error('Failed to load buildings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBuildings = buildings.filter(bld => {
    const matchesSearch = 
      bld.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bld.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bld.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || bld.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalBuildings = buildings.length;
  const totalUnits = buildings.reduce((acc, curr) => acc + curr.totalUnits, 0);
  const occupiedUnits = buildings.reduce((acc, curr) => acc + curr.occupiedUnits, 0);
  
  const globalOccupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <PageHeader 
        title="Estate Overview" 
        description="Manage building infrastructure, units, and track occupancy rates."
        icon={Building2}
        iconColor="indigo"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2">
        <StatsCard 
          title="Total Blocks/Buildings" 
          value={totalBuildings} 
          icon={Building2} 
          color="indigo" 
        />
        <StatsCard 
          title="Total Units" 
          value={totalUnits} 
          subtitle={`${occupiedUnits} currently occupied`}
          icon={Home} 
          color="blue" 
        />
        <StatsCard 
          title="Global Occupancy" 
          value={`${globalOccupancyRate}%`} 
          icon={Users} 
          color="green" 
        />
      </div>

      {/* Toolbar */}
      <FilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by block name, reference, or manager..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'all', label: 'Global Status' },
          { value: 'operational', label: 'Operational' },
          { value: 'fully occupied', label: 'Fully Occupied' },
          { value: 'under maintenance', label: 'Under Maintenance' },
        ]}
      />

      {/* Data Section */}
      <DataStateLayout 
        isLoading={isLoading} 
        error={null} // Optional error state if backend is updated to return standard errors
        hasData={filteredBuildings.length > 0}
        emptyStateMessage="No buildings match your current filters."
      >
        <BuildingsTable 
           buildings={filteredBuildings}
           onRowClick={(block) => router.push(`/dashboard/admin/estates/${block.id}`)}
        />
      </DataStateLayout>
    </div>
  );
}