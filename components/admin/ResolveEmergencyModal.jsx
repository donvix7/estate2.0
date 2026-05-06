'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Phone, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  Calendar, 
  User, 
  History,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'react-toastify';

export default function ResolveEmergencyModal({ emergency, onClose, onResolve }) {
  const [contacts, setContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  const isResolved = emergency?.status === 'resolved';

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await api.getEmergencyContacts();
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts', err);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleResolveSubmit = async () => {
    if (isResolving) return;
    if (!resolutionNote.trim()) {
      toast.error('Please provide a resolution note.');
      return;
    }
    setIsResolving(true);
    try {
      await api.updateEmergencyStatus(emergency._id || emergency.id, { 
        status: 'resolved', 
        resolvedBy: 'Admin / Security Team', 
        resolvedAt: new Date().toISOString(),
        resolutionNote: resolutionNote
      });
      onResolve();
      toast.success('Emergency resolved successfully.');
    } catch (err) {
      console.error('Failed to resolve', err);
      toast.error('Failed to resolve emergency.');
    } finally {
      setIsResolving(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase() === emergency?.type.toLowerCase()
  ).sort((a, b) => {
      if (a.type.toLowerCase() === emergency?.type.toLowerCase()) return -1;
      if (b.type.toLowerCase() === emergency?.type.toLowerCase()) return 1;
      return 0;
  });

  const formatReportDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatReportTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!emergency) return null;

  const incidentTimestamp = emergency.createdAt || emergency.date;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-7 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
              isResolved ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' : 'bg-red-50 dark:bg-red-500/10 text-red-500'
            }`}>
               {isResolved ? <CheckCircle2 className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {isResolved ? 'Incident Resolved' : 'Emergency Response'}
              </h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 uppercase tracking-widest">
                ID: {emergency._id || emergency.id}
                <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                {emergency.type} Alert
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 no-scrollbar bg-slate-50/30 dark:bg-slate-900/30">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Alert Summary Box */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800/80 p-8 rounded-[1.5rem] shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldAlert className="w-24 h-24" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Incident Description</h3>
                  </div>
                  
                  <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed font-medium">
                    {emergency.description || emergency.desc}
                  </p>
                  
                  <div className="mt-8  grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                          <User className="w-3 h-3" /> Reported By
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-base">{emergency.residentName}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                          <MapPin className="w-3 h-3" /> Location
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-base">{emergency.unit}</span>
                      </div>
                  </div>
                </div>

                {/* Resolution Info (If Resolved) */}
                {isResolved && (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 p-8 rounded-[1.5rem]">
                    <div className="flex items-center gap-2 mb-6">
                      <History className="w-4 h-4 text-emerald-500" />
                      <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-600/70">Resolution Details</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                          "{emergency.resolutionNote || 'The incident was successfully handled by the response team.'}"
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-12 gap-y-4">
                        <div className="space-y-1">
                          <span className="text-emerald-600/70 text-[9px] uppercase tracking-widest font-black">Resolved By</span>
                          <span className="block font-bold text-slate-900 dark:text-white text-sm">{emergency.resolvedBy || 'Admin Team'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-emerald-600/70 text-[9px] uppercase tracking-widest font-black">Resolved At</span>
                          <span className="block font-bold text-slate-900 dark:text-white text-sm">{formatReportDate(emergency.resolvedAt)} • {formatReportTime(emergency.resolvedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resolution Input (If Active) */}
                {!isResolved && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-primary" />
                      <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Final Resolution Note</h3>
                    </div>
                    <textarea 
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="Detail the response actions taken..."
                      className="w-full p-6 bg-slate-100 dark:bg-slate-800/80 border-none rounded-[1.5rem] text-base text-slate-900 dark:text-white focus:outline-none focus:ring-0 transition-all min-h-[160px] resize-none shadow-sm placeholder:text-slate-400"
                    />
                  </div>
                )}
              </div>

              {/* Side Info */}
              <div className="space-y-6">
                {/* Timeline Box */}
                <div className="bg-slate-100 dark:bg-slate-800/40 p-6 rounded-[1.5rem]">
                   <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Date Reported</span>
                          <span className="block font-bold text-sm text-slate-900 dark:text-white">{formatReportDate(incidentTimestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Time Reported</span>
                          <span className="block font-bold text-sm text-slate-900 dark:text-white">{formatReportTime(incidentTimestamp)}</span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Contacts Section */}
                <div className="space-y-4">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Quick Dispatch
                    </h3>
                    
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border-none text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-0 transition-all shadow-sm"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                        {isLoadingContacts ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                        ) : filteredContacts.length > 0 ? (
                            filteredContacts.map(contact => {
                                const isRecommended = contact.type.toLowerCase() === emergency?.type.toLowerCase();
                                return (
                                <div key={contact.id} className={`p-4 rounded-2xl transition-all ${
                                  isRecommended 
                                    ? 'bg-primary/5' 
                                    : 'bg-white dark:bg-slate-800'
                                }`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                                                {contact.name}
                                                {isRecommended && <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-black uppercase">Reco</span>}
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium">{contact.role}</div>
                                        </div>
                                    </div>
                                    <a 
                                        href={`tel:${contact.phone}`}
                                        className={`w-full py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${
                                          isRecommended 
                                            ? 'bg-red-500/90 hover:bg-red-500 text-red-50 ' 
                                            : 'bg-primary/90 hover:bg-red-500 text-red-500 hover:text-red-50'
                                        }`}
                                    >
                                        <Phone className="w-3 h-3" />
                                        {contact.phone}
                                    </a>
                                </div>
                            )})
                        ) : (
                            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No services found</p>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-red-300 dark:bg-slate-800/80 flex justify-between items-center ">
          <button 
            onClick={onClose}
            className="px-8 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors"
          >
            Close Window
          </button>
          
          {!isResolved && (
            <button 
              onClick={handleResolveSubmit}
              disabled={isResolving}
              className="flex items-center gap-3 px-10 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-95 disabled:opacity-50"
            >
              {isResolving ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                  <>
                      <CheckCircle2 className="w-5 h-5" />
                      Complete Incident
                  </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
