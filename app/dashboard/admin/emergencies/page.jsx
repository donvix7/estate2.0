'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Lock, 
  PhoneCall, 
  Map as MapIcon, 
  Users, 
  Wrench, 
  Info,
  Layers,
  Monitor,
  Navigation,
  Activity,
  MessageSquare,
  Send,
  MoreVertical,
  Stethoscope,
  Shield
} from 'lucide-react';
import { api } from '@/services/api';
import ResolveEmergencyModal from '@/components/admin/ResolveEmergencyModal';
import { DataStateLayout } from '@/components/ui/DataStateLayout';
import ResourceItem from '@/components/ResourceItem';
import { getEmergencies } from '@/lib/service';
import AnnouncementModal from '@/components/admin/AnnouncementModal';
import { toast } from 'react-toastify';

export default function EmergenciesPage() {
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginatedEmergencies, setPaginatedEmergencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  // Modal State
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  const resources = [
    {name:"Patrol Alpha", status:"Active • South Gate", color:"text-emerald-500 bg-emerald-500/10", icon:<Shield className="w-4 h-4" />},
    {name:"Medic 1", status:"Deploying • Wing 4", color:"text-red-500 bg-red-500/10", icon:<Stethoscope className="w-4 h-4" />}, 
    {name:"Patrol Beta", status:"On Break • Base", color:"text-slate-400 bg-slate-100 dark:bg-slate-800", icon:<Shield className="w-4 h-4" />}
  ]
  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    setIsLoading(true);
    try {
      const data = await getEmergencies();
      setEmergencies(data.docs);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
      setPaginatedEmergencies(data);
    } catch (error) {
      console.error('Failed to load emergencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeEmergencies = emergencies.filter(e => e.status === 'active');
  const securityCount = emergencies.filter(e => e.type?.toLowerCase() === 'security').length;
  const medicalCount = emergencies.filter(e => e.type?.toLowerCase() === 'medical').length;

  const filteredEmergencies = emergencies.filter(emg => {
    return emg.type?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           emg.residentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           emg.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           emg.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getAlertStyle = (type, status) => {
    if (status === 'resolved') return 'bg-white dark:bg-slate-900/40 opacity-75';
    if (type?.toLowerCase() === 'fire' || type?.toLowerCase() === 'medical') return 'bg-red-50 dark:bg-red-500/10';
    return 'bg-amber-50 dark:bg-amber-500/10';
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 animate-in fade-in duration-700">
      {/* Action Buttons & Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 lg:mb-8">
        <div className="xl:col-span-2 flex flex-wrap gap-4">
          <button 
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex-1 min-w-[200px] h-16 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-red-500/20 hover:brightness-110 transition-all active:scale-95"
          >
            <Radio className="w-6 h-6" />
            Broadcast Estate Alert
          </button>
          <button className="flex-1 min-w-[200px] h-16 bg-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all active:scale-95">
            <Lock className="w-6 h-6" />
            Initiate Lockdown
          </button>
          <button className="flex-1 min-w-[200px] h-16 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95">
            <PhoneCall className="w-6 h-6" />
            Contact Services
          </button>
        </div>
        <div className="bg-white dark:bg-primary/5 rounded-xl p-4 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Active Alerts</p>
            <p className="text-3xl font-black text-red-500">{activeEmergencies.length < 10 ? `0${activeEmergencies.length}` : activeEmergencies.length}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Security</p>
              <p className="font-black text-lg">{securityCount}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Medical</p>
              <p className="font-black text-lg">{medicalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {/* Left Column: Real-time Feed */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Real-time Feed
            </h3>
            <span className="text-[10px] text-red-500 font-black animate-pulse flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-red-500"></span>
              LIVE UPDATE
            </span>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Filter incidents..."
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-primary/5 border-none rounded-xl text-xs focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 no-scrollbar">
            <DataStateLayout 
              isLoading={isLoading} 
              hasData={filteredEmergencies.length > 0}
              emptyStateMessage="No incidents found."
            >
              {filteredEmergencies.map((emg) => (
                <div 
                  key={emg.id} 
                  onClick={() => emg.status === 'active' && setSelectedEmergency(emg)}
                  className={`p-4 rounded-xl transition-all shadow-sm flex flex-col cursor-pointer hover:translate-x-1 ${getAlertStyle(emg.type, emg.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                      emg.status === 'resolved' ? 'bg-slate-500' : 'bg-red-500'
                    } text-white`}>
                      {emg.type || 'Emergency'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{getTimeAgo(emg.date)}</span>
                  </div>
                  <h4 className="font-black text-sm">{emg.residentName} - Unit {emg.unit}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{emg.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <Navigation className="w-3 h-3" />
                      Sector {emg.unit?.charAt(0) || 'A'}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      emg.status === 'active' ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {emg.status}
                    </span>
                  </div>
                </div>
              ))}
            </DataStateLayout>
          </div>
        </div>

    

        {/* Right Column: Resources & Comms */}
        <div className="lg:col-span-3 space-y-8">
          {/* Resource Tracking */}
          <div className="space-y-4">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Resource Status
            </h3>
            <div className="bg-white dark:bg-primary/5 rounded-xl space-y-1 overflow-hidden shadow-sm">
              {resources.map((item, index) => (
                <ResourceItem 
                key={index}
                icon={item.icon}
                name={item.name}
                status={item.status}
                color={item.color}
              />
              ))}
            
            </div>
          </div>

          {/* Communication Hub */}
          <div className="space-y-4">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Response Teams
            </h3>
            <div className="bg-white dark:bg-primary/5 rounded-xl flex flex-col h-[350px] shadow-sm">
              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
                <div className="text-[10px] text-center font-black text-slate-400 uppercase tracking-widest">Channel: EMERGENCY-A1</div>
                <div className="flex flex-col items-start max-w-[85%]">
                  <p className="text-[10px] font-black text-slate-500 mb-1">Patrol Alpha</p>
                  <div className="bg-slate-100 dark:bg-primary/20 p-2.5 rounded-2xl rounded-tl-none text-[11px] font-medium">
                    Zone 12 perimeter secure. No breach found.
                  </div>
                </div>
                <div className="flex flex-col items-end max-w-[85%] ml-auto">
                  <p className="text-[10px] font-black text-slate-500 mb-1 text-right">Dispatch (You)</p>
                  <div className="bg-primary text-white p-2.5 rounded-2xl rounded-tr-none text-[11px] font-medium shadow-md">
                    Acknowledged. Redirecting Patrol Beta to support.
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Send orders..." 
                    className="w-full bg-white dark:bg-slate-900 border-none rounded-xl text-xs py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {selectedEmergency && (
         <ResolveEmergencyModal 
            emergency={selectedEmergency}
            onClose={() => setSelectedEmergency(null)}
            onResolve={() => {
              setSelectedEmergency(null);
              loadEmergencies(); 
            }}
         />
      )}

      {/* Broadcast Modal */}
      <AnnouncementModal 
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onAnnouncementCreated={(newAnn) => {
          setIsBroadcastModalOpen(false);
          toast.success('Emergency alert broadcasted successfully!');
        }}
      />
    </div>
  );
}
