'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';
import EmergenciesTable from '@/components/admin/EmergenciesTable';
import ResolveEmergencyModal from '@/components/admin/ResolveEmergencyModal';
import StatsCard from '@/components/StatsCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataStateLayout } from '@/components/ui/DataStateLayout';

export default function EmergenciesPage() {
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal State
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEmergencies();
      setEmergencies(data);
    } catch (error) {
      console.error('Failed to load emergencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeEmergencies = emergencies.filter(e => e.status === 'active');
  const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved');

  const filteredEmergencies = emergencies.filter(emg => {
    const matchesSearch = 
      emg.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emg.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emg.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emg.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || emg.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <PageHeader 
        title="Emergencies" 
        description="Manage and resolve critical alerts submitted by residents instantly."
        icon={ShieldAlert}
        iconColor="red"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Reports" 
          value={emergencies.length} 
          icon={ShieldAlert} 
          color="blue" 
        />
        <StatsCard 
          title="Active Emergencies" 
          value={activeEmergencies.length} 
          icon={AlertTriangle} 
          color="red" 
        />
        <StatsCard 
          title="Resolved" 
          value={resolvedEmergencies.length} 
          icon={CheckCircle2} 
          color="green" 
        />
      </div>

      {/* Toolbar */}
      <FilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search alerts by resident, unit, type, or description..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'active', label: 'Active Alerts' },
          { value: 'resolved', label: 'Resolved' },
        ]}
      />

      {/* Data Section */}
      <DataStateLayout 
        isLoading={isLoading} 
        error={null} 
        hasData={filteredEmergencies.length > 0}
        emptyStateMessage="No emergency alerts match your current filters."
      >
        <EmergenciesTable 
          emergencies={filteredEmergencies}
          onResolveClick={(emg) => setSelectedEmergency(emg)} 
        />
      </DataStateLayout>

      {/* Resolve Modal */}
      {selectedEmergency && (
         <ResolveEmergencyModal 
            emergency={selectedEmergency}
            onClose={() => setSelectedEmergency(null)}
            onResolve={() => {
              setSelectedEmergency(null);
              loadEmergencies(); // Refresh list to show strictly updated statuses
            }}
         />
      )}
    </div>
  );
}