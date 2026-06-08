'use client'

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  User, 
  Mail, 
  Phone, 
  Star, 
  Briefcase, 
  ShieldCheck, 
  ShieldAlert,
  Clock,
  ChevronRight,
  BadgeCheck,
  CheckCircle2,
  Calendar,
  Zap,
  MapPin,
  History,
  Wallet
} from 'lucide-react';
import { getWorkerById } from '@/lib/service';
import { BackButton } from '@/components/ui/BackButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { toast } from 'react-toastify';

export default function ServiceWorkerDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getWorkerById(params.id);
        if (data) {
          setWorker(data);
        } else {
          toast.error('Worker not found');
        }
      } catch (error) {
        console.error('Failed to load worker details:', error);
        toast.error('Failed to load worker details');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  if (isLoading) return <LoadingState message="Fetching Professional Profile..." />;
  if (!worker) return (
    <div className="p-20 text-center space-y-4">
      <ShieldAlert className="size-12 text-slate-300 mx-auto" />
      <p className="text-slate-500 font-medium">Worker profile not found.</p>
      <BackButton fallbackRoute="/dashboard/admin/service_workers" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12 p-6 md:p-10">
      <BackButton fallbackRoute="/dashboard/admin/service_workers" label="Back to Staff List" />

      {/* Profile Header Card - Glassmorphism style */}
      <div className="bg-slate-100 dark:bg-slate-800/30 p-8 md:p-10 overflow-hidden relative group rounded-2xl">
        <div className={`absolute top-0 right-0 w-64 h-64 ${worker.color || 'bg-[#1241a1]'}/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110`}></div>
        <div className="relative flex flex-col md:flex-row gap-8 items-center">
          <div className="relative">
            <div 
              className={`h-32 w-32 rounded-3xl flex items-center justify-center text-3xl font-black shadow-2xl shadow-slate-200/50 dark:shadow-none ${worker.color || 'bg-[#1241a1]'} text-white`}
            >
              {worker.image ? (
                <img src={worker.image} alt="" className="h-full w-full object-cover rounded-3xl" />
              ) : (
                worker.initials || worker.name?.charAt(0)
              )}
            </div>
            {worker.verified && (
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-none">
                <BadgeCheck className="size-5" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-3xl font-black dark:text-white tracking-tight uppercase">
                {worker.name}
              </h2>
              <span className="text-[10px] bg-white dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-lg font-black tracking-widest uppercase shadow-sm">
                {worker._id || worker.id}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <p className="text-[#1241a1] dark:text-blue-400 flex items-center justify-center md:justify-start gap-2 text-sm font-black uppercase tracking-widest">
                <Wrench className="size-4" /> 
                {worker.title}
              </p>
              <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm font-bold">
                <MapPin className="size-4 text-slate-400" /> 
                {worker.estateID || 'Main Estate'}
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              <button 
                onClick={() => toast.info('Edit functionality coming soon')}
                className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all active:scale-95 border-none shadow-xl shadow-slate-900/10"
              >
                Edit Professional Info
              </button>
              <a 
                href={`tel:${worker.phone}`}
                className="px-8 py-3 bg-white dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
              >
                <Phone className="size-3.5" />
                Contact Staff
              </a>
            </div>
          </div>
          
          {/* Quick Stats in Header */}
          <div className="hidden lg:flex gap-4">
             <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl text-center min-w-[100px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="size-4 text-amber-500 fill-amber-500" />
                  <p className="text-xl font-black text-slate-900 dark:text-white">{worker.rating || '5.0'}</p>
                </div>
             </div>
             <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl text-center min-w-[100px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jobs Done</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{worker.jobs || '0'}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info Sections */}
        <div className="lg:col-span-1 space-y-8">
          {/* Professional Details */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                <Briefcase className="size-5" />
              </div>
              Professional Info
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Category', value: worker.category, icon: Zap },
                { label: 'Hourly Rate', value: worker.rate, icon: Wallet },
                { label: 'Email', value: worker.email, icon: Mail },
                { label: 'Phone', value: worker.phone, icon: Phone }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <item.icon className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{item.value || 'Not provided'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills & Expertise */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600">
                <Star className="size-5" />
              </div>
              Skills & Expertise
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {(worker.skills || []).length > 0 ? worker.skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl shadow-sm">
                  {skill}
                </span>
              )) : (
                <p className="text-xs text-slate-400 italic">No specific skills listed.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right: Job History/Activity */}
        <div className="lg:col-span-2">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm min-h-[500px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
                  <History className="size-5" />
                </div>
                Assignment History
              </h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {(worker.assignedJobs || []).length} Active
                </span>
                <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {worker.completedJobs || 0} Done
                </span>
              </div>
            </div>
            
            <div className="space-y-8 relative">
              {(worker.assignedJobs || []).length > 0 ? worker.assignedJobs.map((job, idx) => (
                <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="size-12 rounded-xl bg-[#1241a1]/10 text-[#1241a1] flex items-center justify-center font-black">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">
                        Request ID: {job.requestId?.substring(0, 12) || 'N/A'}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                          <Calendar className="size-3" /> {new Date(job.assignedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                          <Clock className="size-3" /> {new Date(job.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      job.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {job.status || 'Assigned'}
                    </span>
                    <button 
                      onClick={() => router.push(`/dashboard/admin/service-request/${job.requestId}`)}
                      className="ml-4 p-2 text-slate-300 hover:text-[#1241a1] transition-colors"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <Briefcase className="size-10 text-slate-200" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Assignments</p>
                    <p className="text-xs text-slate-400 mt-1">This worker has no pending service requests.</p>
                  </div>
                  <button 
                    onClick={() => router.push('/dashboard/admin/service-request')}
                    className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border-none mt-4"
                  >
                    Browse Requests
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}