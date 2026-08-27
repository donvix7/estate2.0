'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  Lock, 
  PhoneCall, 
  Layers,
  Navigation,
  Activity,
  MessageSquare,
  Send,
  Stethoscope,
  Shield
} from 'lucide-react';
import ResolveEmergencyModal from '@/components/admin/ResolveEmergencyModal';
import { DataStateLayout } from '@/components/ui/DataStateLayout';
import ResourceItem from '@/components/ResourceItem';
import { getEmergencies } from '@/lib/service';
import AnnouncementModal from '@/components/admin/AnnouncementModal';
import { toast } from 'react-toastify';
import Pagination from '@/components/pagination';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { StatusBadge } from '@/components/ui/StatusBadge';

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
    {name:"Patrol Beta", status:"On Break • Base", color:"text-[#8a8f98] bg-[#1a1d23]", icon:<Shield className="w-4 h-4" />}
  ]
  useEffect(() => {
    loadEmergencies();
  }, [currentPage]);

  const loadEmergencies = async () => {
    setIsLoading(true);
    try {
      const data = await getEmergencies(currentPage);
      const result = data.data || data;
      const docs = result.docs || [];
      setEmergencies(docs);
      setTotalPages(result.totalPages || 1);
      setPaginatedEmergencies(result);
    } catch (error) {
      console.error('Failed to load emergencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeEmergencies = emergencies.filter(e => e.status === 'Pending');
  const securityCount = emergencies.filter(e => e.type?.toLowerCase() === 'security').length;
  const medicalCount = emergencies.filter(e => e.type?.toLowerCase() === 'medical').length;
  const fireCount = emergencies.filter(e => e.type?.toLowerCase() === 'fire').length;
  const otherCount = emergencies.filter(e => e.type?.toLowerCase() === 'other').length;

  const filteredEmergencies = (emergencies || []).filter(emg => {
    return emg.type?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           emg.residentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           emg.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           emg.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getAlertStyle = (type, status) => {
    if (status === 'resolved') return 'bg-[#0d0f13]/40 opacity-75';
    if (type?.toLowerCase() === 'fire' || type?.toLowerCase() === 'medical') return 'bg-red-50';
    return 'bg-amber-50';
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
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      <PageHeader
        title="Emergency Management"
        description="Coordinate emergency response and estate-wide alerts."
        icon={AlertTriangle}
        iconColor="red"
      >
        <Button variant="danger" size="md" icon={Radio} onClick={() => setIsBroadcastModalOpen(true)}>
          Broadcast Alert
        </Button>
        <Button variant="amber" size="md" icon={Lock}>
          Initiate Lockdown
        </Button>
        <Button variant="primary" size="md" icon={PhoneCall}>
          Contact Services
        </Button>
      </PageHeader>

      {/* Active Alerts Overview */}
      <Card className="mb-6 lg:mb-8">
        <div className="p-5 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-[10px] text-[#8a8f98] uppercase tracking-widest font-black">Active Alerts</p>
            <p className="text-3xl font-black text-red-500">{activeEmergencies.length < 10 ? `0${activeEmergencies.length}` : activeEmergencies.length}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4">
              <p className="text-[10px] text-[#8a8f98] uppercase font-bold">Security</p>
              <p className="font-black text-lg">{securityCount}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-[10px] text-[#8a8f98] uppercase font-bold">Medical</p>
              <p className="font-black text-lg">{medicalCount}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-[10px] text-[#8a8f98] uppercase font-bold">Fire</p>
              <p className="font-black text-lg">{fireCount}</p>
            </div>
          
          </div>
        </div>
      </Card>

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
          
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Filter incidents..."
            className="mb-4"
          />

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 no-scrollbar">
            <DataStateLayout 
              isLoading={isLoading} 
              hasData={filteredEmergencies.length > 0}
              emptyStateMessage="No incidents found."
            >
              {filteredEmergencies.map((emg) => (
                <div 
                  key={emg._id || emg.id} 
                  onClick={() => setSelectedEmergency(emg)}
                  className={`p-4 rounded-xl transition-all shadow-sm flex flex-col cursor-pointer hover:translate-x-1 ${getAlertStyle(emg.type, emg.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <StatusBadge status={emg.type || 'Emergency'} tone={emg.status === 'resolved' ? 'slate' : 'red'} />
                    <span className="text-[10px] text-[#8a8f98] font-bold">{getTimeAgo(new Date(emg.createdAt).getTime())}</span>
                  </div>
                  <h4 className="font-black text-sm">{emg.residentName} - Unit {emg.unit}</h4>
                  <p className="text-xs text-[#8a8f98] mt-1 line-clamp-2">{emg.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-[#8a8f98] font-bold uppercase tracking-wider">
                      <Navigation className="w-3 h-3" />
                      Sector {emg.unit?.charAt(0) || 'A'}
                    </div>
                   <div className="flex flex-col items-center gap-4">
                     <StatusBadge status={emg.status} tone={emg.status === 'active' ? 'red' : 'green'} />
                    <Button 
                      variant="amber"
                      size="sm"
                      className="flex-1 w-fit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmergency(emg);
                      }}
                    >
                      View Details
                    </Button>
                   </div>
                  </div>
                </div>
              ))}
            </DataStateLayout>
          </div>
          
          <Pagination 
            page={currentPage}
            totalPages={totalPages}
            handlePageChange={(p) => setCurrentPage(p)}
          />
        </div>

    

        {/* Right Column: Resources & Comms */}
        <div className="lg:col-span-3 space-y-8">
          {/* Resource Tracking */}
          <div className="space-y-4">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Resource Status
            </h3>
            <Card className="space-y-1">
              {resources.map((item, index) => (
                <ResourceItem 
                key={index}
                icon={item.icon}
                name={item.name}
                status={item.status}
                color={item.color}
              />
              ))}
            
            </Card>
          </div>

          {/* Communication Hub */}
          <div className="space-y-4">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Response Teams
            </h3>
            <Card className="flex flex-col h-[350px]">
              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin min-h-0">
                <div className="text-[10px] text-center font-black text-[#8a8f98] uppercase tracking-widest">Channel: EMERGENCY-A1</div>
                <div className="flex flex-col items-start max-w-[85%]">
                  <p className="text-[10px] font-black text-[#8a8f98] mb-1">Patrol Alpha</p>
                  <div className="bg-[#1a1d23] p-2.5 rounded-2xl rounded-tl-none text-[11px] font-medium">
                    Zone 12 perimeter secure. No breach found.
                  </div>
                </div>
                <div className="flex flex-col items-end max-w-[85%] ml-auto">
                  <p className="text-[10px] font-black text-[#8a8f98] mb-1 text-right">Dispatch (You)</p>
                  <div className="bg-primary text-white p-2.5 rounded-2xl rounded-tr-none text-[11px] font-medium shadow-md">
                    Acknowledged. Redirecting Patrol Beta to support.
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#1a1d23]">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Send orders..." 
                    className="w-full bg-[#0d0f13] border-none rounded-xl text-xs py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
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
