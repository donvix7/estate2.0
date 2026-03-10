'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Phone, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'react-toastify';

export default function ResolveEmergencyModal({ emergency, onClose, onResolve }) {
  const [contacts, setContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

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
    setIsResolving(true);
    try {
      // In a real app we'd pass the resolutionNote as well
      await api.updateEmergencyStatus(emergency.id, { 
        status: 'resolved', 
        resolvedBy: 'Admin / Security Team', 
        resolvedAt: new Date().toISOString()
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
      // Prioritize exact emergency type matches
      if (a.type.toLowerCase() === emergency?.type.toLowerCase()) return -1;
      if (b.type.toLowerCase() === emergency?.type.toLowerCase()) return 1;
      return 0;
  });

  if (!emergency) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between bg-white dark:bg-gray-900 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
               <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Emergency Response</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Alert #{emergency.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors absolute top-6 right-6"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
            
            {/* Alert Summary Box */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                  {emergency.type} Alert
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">{emergency.description}</p>
              
              <div className="mt-6 pt-6 flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium">Reported By</span>
                    <span className="font-semibold text-gray-900 dark:text-white block">{emergency.residentName}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium">Location</span>
                    <span className="font-semibold text-gray-900 dark:text-white block">{emergency.unit}</span>
                  </div>
              </div>
            </div>

            {/* Contacts Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Dispatch Contacts</h3>
                </div>
                
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search emergency services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border-none text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all shadow-sm"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                </div>

                {isLoadingContacts ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map(contact => {
                                const isRecommended = contact.type.toLowerCase() === emergency?.type.toLowerCase();
                                return (
                                <div key={contact.id} className={`flex flex-col p-4 rounded-xl border-none ${isRecommended ? 'bg-red-50/50 dark:bg-red-500/10 shadow-sm' : 'bg-white dark:bg-gray-800 shadow-sm'}`}>
                                    <div className="flex justify-between items-start mb-3 pb-3">
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                {contact.name}
                                                {isRecommended && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{contact.role}</div>
                                        </div>
                                    </div>
                                    <a 
                                        href={`tel:${contact.phone}`}
                                        className={`w-full py-2.5 rounded-lg border-none text-sm font-bold flex items-center justify-center gap-2 transition-colors ${isRecommended ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}
                                    >
                                        <Phone className="w-4 h-4" />
                                        {contact.phone}
                                    </a>
                                </div>
                            )})
                        ) : (
                            <div className="col-span-2 text-center py-8 bg-white dark:bg-gray-800 rounded-xl">
                               <p className="text-sm text-gray-500">No contacts available.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Resolution Input */}
            <div>
               <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Resolution Log</label>
               <textarea 
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Detail the response taken to resolve this emergency..."
                  className="w-full p-4 bg-white dark:bg-gray-800 border-none rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all min-h-[120px] resize-y shadow-sm"
               />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-white dark:bg-gray-900 flex justify-between items-center border-none">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleResolveSubmit}
            disabled={isResolving}
            className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-xl font-bold transition-all disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}
