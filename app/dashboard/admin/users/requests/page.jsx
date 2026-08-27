'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  UserPlus,
  Phone,
  Hash,
  ArrowLeft
} from 'lucide-react';
import { getResidentRequests } from '@/lib/service';
import { handleResidentRequestDecision } from '@/lib/action';
import { PageHeader } from '@/components/ui/PageHeader';
import { CleanTable } from '@/components/ui/CleanTable';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Pagination from '@/components/pagination';

export default function ResidentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getResidentRequests(page);
        const responseData = data.data || data;
        const docs = responseData.docs || [];
        setTotalPages(responseData.totalPages || 1);
        setRequests(docs);
        setFilteredRequests(docs);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load resident requests');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [page]);

  useEffect(() => {
    let filtered = requests;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(req => 
        (req.name?.toLowerCase().includes(term)) ||
        (req.phone?.toLowerCase().includes(term)) ||
        (req._id?.toLowerCase().includes(term))
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status?.toLowerCase() === statusFilter.toLowerCase());
    }
    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  const handleDecision = async (id, decision) => {
    try {
      const result = await handleResidentRequestDecision(id, decision);
      if (result.success) {
        toast.success(`Request acknowledged successfully`);
        // Update local state to reflect change
        setRequests(prev => prev.map(req => req._id === id ? { ...req, status: 'recieved' } : req));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
    
  };

  const statusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <StatusBadge status="Pending" tone="amber" />;
      case 'recieved':
        return <StatusBadge status="Acknowledge" tone="green" />;
      default:
        return <StatusBadge status={status || 'Unknown'} />;
    }
  };

  if (isLoading) return <LoadingState message="Fetching requests..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/dashboard/admin/users"
          className="p-2 hover:bg-[#1a1d23] hover:bg-[#2a2d33] rounded-full transition-colors text-[#8a8f98] hover:text-[#1241a1]"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#8a8f98]">
          <Link href="/dashboard/admin/users" className="hover:text-[#1241a1] transition-colors">Users</Link>
          <span className="text-[#8a8f98]">/</span>
          <span className="text-[#1241a1]">Resident Requests</span>
        </div>
      </div>

      <PageHeader 
        title="Resident Onboarding Requests" 
        description="Review incoming requests from prospective residents. Acknowledge and proceed with profile creation."
        icon={UserPlus}
      />

      <Card className="space-y-8">
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name, phone or Request ID..."
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 bg-[#0d0f13] px-4 py-4 rounded-xl shadow-sm">
              <select 
                className="bg-transparent border-none p-0 text-sm font-bold text-[#8a8f98] focus:ring-0 outline-none cursor-pointer min-w-[120px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="recieved">Received</option>
              </select>
            </div>
            <div className="hidden lg:block px-4 py-2 bg-[#1241a1]/5 rounded-lg">
              <p className="text-[10px] font-bold text-[#1241a1] uppercase tracking-widest">
                {filteredRequests.length} Total Requests
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <CleanTable 
            headers={['Request ID', 'Resident Identity', 'Contact Details', 'Current Status', 'Quick Actions']}
            data={filteredRequests}
            renderRow={(req) => (
              <>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Hash className="size-3 text-[#8a8f98]" />
                    <span className="font-mono text-xs font-bold text-[#8a8f98] uppercase tracking-tighter">
                      {req._id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-[#1a1d23] rounded-xl flex items-center justify-center shadow-inner">
                      <User className="size-5 text-[#8a8f98]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none mb-1.5">{req.name}</p>
                      <p className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-tight truncate max-w-[150px]">
                        {req.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2.5 text-[#8a8f98]">
                    <div className="p-1.5 bg-[#1a1d23] rounded-md">
                      <Phone className="size-3.5 text-[#8a8f98]" />
                    </div>
                    <span className="text-xs font-bold">{req.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {statusBadge(req.status)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      href={`/dashboard/admin/users/requests/${req._id}`}
                      variant="secondary"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </td>
              </>
            )}
            emptyState={
              <EmptyState
                icon={Clock}
                title="Zero Requests Found"
                description="Your request queue is empty. New resident onboarding requests will appear here as they arrive."
              />
            }
          />
        </div>

        {/* Mobile View (Cards) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center bg-[#1a1d23] rounded-2xl">
              <p className="text-[#8a8f98] font-bold text-xs uppercase tracking-widest">No Requests</p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div key={req._id} className="bg-[#1a1d23] p-5 rounded-2xl space-y-4 shadow-sm border border-transparent active:border-[#1241a1]/20 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-[#0d0f13] rounded-xl flex items-center justify-center shadow-sm">
                      <User className="size-5 text-[#8a8f98]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{req.name}</p>
                      <p className="text-[10px] font-mono text-[#8a8f98] uppercase tracking-tighter">ID: {req._id}</p>
                    </div>
                  </div>
                  {statusBadge(req.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-none">
                  <div>
                    <p className="text-[9px] font-bold text-[#8a8f98] uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-xs font-bold text-white text-[#8a8f98]">{req.phone}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[#8a8f98] uppercase tracking-widest mb-1">Email</p>
                    <p className="text-xs font-bold text-white text-[#8a8f98] truncate">{req.email}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    href={`/dashboard/admin/users/requests/${req._id}`}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

      </Card>
      <Pagination
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
      
    </div>
  );
}
