'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Search, 
  Filter, 
  UserPlus,
  Phone,
  Hash,
  Eye,
  Check,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { getResidentRequests } from '@/lib/service';
import { handleResidentRequestDecision } from '@/lib/action';
import { PageHeader } from '@/components/ui/PageHeader';
import { CleanTable } from '@/components/ui/CleanTable';
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

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold uppercase rounded-full tracking-wider">Pending</span>;
      case 'recieved':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-full tracking-wider">Acknowledge</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold uppercase rounded-full tracking-wider">{status || 'Unknown'}</span>;
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
    
  };

  if (isLoading) return <LoadingState message="Fetching requests..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/dashboard/admin/users"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-[#1241a1]"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">
          <Link href="/dashboard/admin/users" className="hover:text-[#1241a1] transition-colors">Users</Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#1241a1]">Resident Requests</span>
        </div>
      </div>

      <PageHeader 
        title="Resident Onboarding Requests" 
        description="Review incoming requests from prospective residents. Acknowledge and proceed with profile creation."
        icon={UserPlus}
      />

      <div className="bg-slate-50 dark:bg-slate-800/20 rounded-2xl shadow-sm p-6 lg:p-8 space-y-8">
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-[#1241a1] transition-colors" />
            <input 
              type="text"
              placeholder="Search by name, phone or Request ID..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-4 rounded-xl shadow-sm">
              <Filter className="size-4 text-slate-400" />
              <select 
                className="bg-transparent border-none p-0 text-sm font-bold text-slate-600 dark:text-slate-300 focus:ring-0 outline-none cursor-pointer min-w-[120px]"
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
                    <Hash className="size-3 text-slate-400" />
                    <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      {req._id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-inner">
                      <User className="size-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1.5">{req.name}</p>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight truncate max-w-[150px]">
                        {req.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md">
                      <Phone className="size-3.5 text-slate-400" />
                    </div>
                    <span className="text-xs font-bold">{req.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {getStatusBadge(req.status)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-3">
                       <Link
                    href={`/dashboard/admin/users/requests/${req._id}`}
                    className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white active:scale-95"
                  >
                  View Details
                  </Link>
                  </div>
                </td>
              </>
            )}
            emptyState={
              <div className="py-24 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Clock className="size-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Zero Requests Found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed">
                  Your request queue is empty. New resident onboarding requests will appear here as they arrive.
                </p>
              </div>
            }
          />
        </div>

        {/* Mobile View (Cards) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Requests</p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div key={req._id} className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl space-y-4 shadow-sm border border-transparent active:border-[#1241a1]/20 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                      <User className="size-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{req.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">ID: {req._id}</p>
                    </div>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-none">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{req.phone}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{req.email}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/admin/users/requests/${req._id}`}
                    className="flex-1 py-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 shadow-lg shadow-emerald-600/10 active:scale-95 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
      
    </div>
  );
}
