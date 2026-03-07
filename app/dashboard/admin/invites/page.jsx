'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Search, Loader2, QrCode, CheckCircle2, Clock } from 'lucide-react';
import { api } from '@/services/api';
import InvitesTable from '@/components/admin/InvitesTable';
import StatsCard from '@/components/StatsCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { DataStateLayout } from '@/components/ui/DataStateLayout';

export default function InvitesPage() {
  const [invites, setInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    setIsLoading(true);
    try {
      const data = await api.getInvites();
      setInvites(data);
    } catch (error) {
      console.error('Failed to load invites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvites = invites.filter(inv => {
    const matchesSearch = 
      inv.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.code.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || inv.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalInvites = invites.length;
  const pendingInvites = invites.filter(i => i.status === 'pending').length;
  const activeInvites = invites.filter(i => i.status === 'approved' || i.status === 'accepted').length;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <PageHeader 
        title="Guest Invites" 
        description="Monitor pending guest requests and active access codes."
        icon={Mail}
        iconColor="yellow"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Invites" 
          value={totalInvites} 
          icon={QrCode} 
          color="blue" 
        />
        <StatsCard 
          title="Pending Requests" 
          value={pendingInvites} 
          icon={Clock} 
          color="yellow" 
        />
        <StatsCard 
          title="Active/Approved" 
          value={activeInvites} 
          icon={CheckCircle2} 
          color="green" 
        />
      </div>

      {/* Toolbar */}
      <FilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by guest, resident, or access code..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved/Active' },
          { value: 'expired', label: 'Expired' },
          { value: 'rejected', label: 'Rejected/Revoked' },
        ]}
      />

      {/* Data Section */}
      <DataStateLayout 
        isLoading={isLoading} 
        error={null} 
        hasData={filteredInvites.length > 0}
        emptyStateMessage="No invites match your current filters."
      >
        <InvitesTable 
          invites={filteredInvites}
        />
      </DataStateLayout>
    </div>
  );
}