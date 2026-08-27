'use client'

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  Search, 
  Filter, 
  User, 
  Users,
  MapPin, 
  Clock, 
  ChevronRight,
  Star,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { getServiceRequestById, getWorkers } from '@/lib/service';
import { assignWorkerToRequest } from '@/lib/action';
import { BackButton } from '@/components/ui/BackButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from 'react-toastify';

export default function ServiceRequestAssignmentPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [reqData, workerData] = await Promise.all([
          getServiceRequestById(params.id),
          getWorkers()
        ]);
        
        setRequest(reqData);
        // Safely extract docs array or default to empty
        const docs = workerData?.docs || workerData || [];
        setWorkers(docs);
      } catch (error) {
        console.error('Failed to load assignment data:', error);
        toast.error('Failed to load request details');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const handleAssign = async (worker) => {
    setIsAssigning(true);
    const workerId = worker._id || worker.id;
    const residentId = request.residentId || request.residentID;
    
    try {
      const res = await assignWorkerToRequest(params.id, workerId, residentId);
      if (res.success) {
        toast.success(`Request assigned to ${worker.name}`);
        router.refresh();
        setRequest(prev => ({ 
          ...prev, 
          serviceWorkerId: workerId, 
          workerName: worker.name,
          status: 'In Progress' 
        }));
      } else {
        toast.error(res.message || 'Failed to assign worker');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = (w.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (w.role || w.title || w.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || w.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getWorkerInitials = (name) => {
    if (!name) return 'W';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) return <LoadingState message="Fetching Request Details & Workforce..." />;
  if (!request) return (
    <div className="p-20 text-center space-y-4">
      <AlertCircle className="size-12 text-[#8a8f98] mx-auto" />
      <p className="text-[#8a8f98] font-medium">Request not found.</p>
      <BackButton fallbackRoute="/dashboard/admin/service-request" />
    </div>
  );

  return (
    <div className="flex flex-col animate-in fade-in duration-700 max-w-7xl mx-auto pb-12">
      <PageHeader 
          title="Service Assignment" 
          description="Review request details and deploy a qualified professional."
          icon={Briefcase}
          iconColor="blue"
        >
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary"
              size="md"
              icon={Users}
              onClick={() => router.push('/dashboard/admin/service_workers')}
            >
              Manage Workforce
            </Button>
          </div>
        </PageHeader>
      <div className='flex gap-6'>
              {/* ── Left: Request Details ── */}
      <div className="flex-1 min-w-0 space-y-8">
        <Card>
          <CardBody>
            <div className="flex items-center gap-5">
              <div className="size-16 rounded-2xl bg-[#1241a1]/10 flex items-center justify-center shrink-0">
                <Wrench className="size-8 text-[#1241a1]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                   <span className="text-xs font-bold text-[#1241a1] uppercase tracking-widest bg-[#1241a1]/5 px-2 py-1 rounded-md">
                     {(request._id || request.id || '').substring(0, 10)}
                   </span>
                   <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                     request.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-[#1a1d23] text-[#8a8f98]'
                   }`}>
                     {request.priority || 'Normal'} Priority
                   </span>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  request.status === 'Pending' || request.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {request.status || 'Pending'}
                </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {request.title || request.category || 'Service Request'}
                </h2>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardBody>
              <h3 className="text-sm font-bold text-[#8a8f98] uppercase tracking-wider flex items-center gap-2 mb-4">
                <AlertCircle className="size-4" /> Issue Description
              </h3>
              <p className="text-[#8a8f98] leading-relaxed text-lg">
                {request.desc || request.description || 'No detailed description provided.'}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-sm font-bold text-[#8a8f98] uppercase tracking-wider mb-5">Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#1a1d23] flex items-center justify-center">
                    <MapPin className="size-5 text-[#8a8f98]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8a8f98] font-bold uppercase tracking-wide">Location</p>
                    <p className="text-sm font-bold text-white text-[#8a8f98]">{request.estateID || 'Main Estate'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#1a1d23] flex items-center justify-center">
                    <User className="size-5 text-[#8a8f98]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8a8f98] font-bold uppercase tracking-wide">Resident</p>
                    <p className="text-sm font-bold text-white text-[#8a8f98]">{request.residentName || request.residentId || 'Anonymous'}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {request.workerName && (
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardBody className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                   <CheckCircle2 className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-900 text-emerald-400 uppercase tracking-wide">Assigned Professional</p>
                  <p className="text-sm text-emerald-700 text-emerald-400 font-medium">{request.workerName}</p>
                </div>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-widest mb-1">Status</p>
                <p className="text-xl font-black text-white text-[#8a8f98] uppercase">Deployed</p>
              </div>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardBody>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#8a8f98] mb-6">Request Timeline</h3>
            <div className="space-y-6 pl-2">
              {(request.timeline || []).length > 0 ? request.timeline.map((step, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`size-3 rounded-full ${step.done ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-[#1a1d23]'}`} />
                  <span className="text-sm font-bold text-white text-[#8a8f98]">{step.label}</span>
                  <span className="text-xs text-[#8a8f98] font-medium ml-auto group-hover:text-white group-hover:text-white transition-colors">{step.time}</span>
                </div>
              )) : (
                <div className="flex items-center gap-4">
                  <div className="size-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm font-bold text-white text-[#8a8f98]">Request Received</span>
                  <span className="text-xs text-[#8a8f98] ml-auto font-medium">
                    {new Date(request.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Right: Worker Selection Sidebar ── */}
      <aside className="w-full lg:w-[450px] shrink-0">
        <Card className="sticky top-4 h-[calc(100vh-9rem)] flex flex-col">
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Assign Professional</h2>
              <button className="size-10 rounded-xl bg-[#1a1d23] flex items-center justify-center text-[#8a8f98] hover:text-[#1241a1] transition-colors border-none">
                <Filter className="size-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#8a8f98]" />
              <input 
                type="text" 
                placeholder="Search by name or skill..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a1d23] rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#1241a1] outline-none transition-all text-white border-none"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Available', 'On Job', 'Away'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border-none ${
                    filter === s 
                      ? 'bg-[#1241a1] text-white shadow-lg shadow-[#1241a1]/20' 
                      : 'bg-[#1a1d23] text-[#8a8f98] hover:bg-[#1a1d23] hover:bg-[#2a2d33]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-thumb-[#2a2d33]">
            {filteredWorkers.length === 0 ? (
              <EmptyState 
                icon={User}
                title="No workers found"
                description="No matching workers found. Adjust your search or filters."
              />
            ) : filteredWorkers.map((worker, index) => {
              const isAvailable = worker.status === 'Available' || worker.status?.toLowerCase() === 'available';
              const isRequestPending = request.status === 'Pending' || request.status?.toLowerCase() === 'pending';
              
              return (
                <div 
                  key={worker._id || worker.id || `worker-${index}`}
                  className={`group relative bg-[#1a1d23] rounded-2xl p-5 transition-all hover:shadow-xl hover:shadow-[#1241a1]/5 ${
                    !isAvailable ? 'opacity-70 grayscale-[0.5]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-14 rounded-2xl bg-[#1241a1] text-white flex items-center justify-center text-lg font-black shadow-lg shadow-[#1241a1]/20">
                      {worker.avatar ? (
                        <img src={worker.avatar} alt="" className="size-full object-cover rounded-2xl" />
                      ) : (
                        getWorkerInitials(worker.name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white group-hover:text-[#1241a1] transition-colors truncate">{worker.name}</h4>
                      <p className="text-xs text-[#8a8f98] font-medium truncate">{worker.title || worker.category || 'Professional'}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 mb-0.5 justify-end">
                        <Star className="size-3 fill-current" />
                        <span className="text-xs font-bold text-white text-[#8a8f98]">{worker.rating || '5.0'}</span>
                      </div>
                    <button 
                      onClick={() => handleAssign(worker)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 border-none ${
                        isRequestPending 
                          ? 'bg-[#1241a1] text-white hover:brightness-110 shadow-lg shadow-[#1241a1]/20 cursor-pointer' 
                          : 'bg-[#1a1d23] text-[#8a8f98] cursor-not-allowed opacity-50'
                      }`}
                    >
                      {isAssigning ? 'Deploying...' : 'Deploy Now'}
                      <ChevronRight className="size-3" />
                    </button>                  </div>
                  </div>


                </div>
              );
            })}
          </div>
        </Card>
      </aside>
      </div>
    </div>
  );
}