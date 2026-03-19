'use client'

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Search, Calendar, Shield, Wrench, Info, Users } from 'lucide-react';
import { api } from '@/services/api';
import ViewAnnouncementModal from '@/components/admin/ViewAnnouncementModal';

const dummyAnnouncements = [
  { 
    id: '1', 
    title: 'Scheduled Database Migration', 
    message: 'We will be performing a critical database migration to improve query speeds across all regional servers...', 
    type: 'Maintenance', 
    timestamp: '2023-10-24T10:00:00Z',
    author: 'Systems Admin'
  },
  { 
    id: '2', 
    title: 'Updated 2FA Protocols', 
    message: 'Mandatory biometric authentication is now available for all enterprise accounts to enhance security...', 
    type: 'Security', 
    timestamp: '2023-10-22T08:30:00Z',
    author: 'Security Team'
  },
  { 
    id: '3', 
    title: 'Annual Developers Meetup 2024', 
    message: 'Registration is now open for our flagship annual community event. Join us for a weekend of networking...', 
    type: 'Community', 
    timestamp: '2023-10-20T14:15:00Z',
    author: 'Community Lead'
  },
  { 
    id: '4', 
    title: 'Legacy API Deprecation Notice', 
    message: 'The v1.0 API will be officially deprecated by end of Q4. Please update your integration to v2.5...', 
    type: 'Maintenance', 
    timestamp: '2023-10-18T11:00:00Z',
    author: 'API Team'
  },
  { 
    id: '5', 
    title: 'Bi-weekly Security Audit Results', 
    message: 'Our latest independent audit confirms 99.9% compliance with GDPR and HIPAA standards...', 
    type: 'Security', 
    timestamp: '2023-10-15T09:45:00Z',
    author: 'Audit Dept'
  }
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(dummyAnnouncements);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  // Modal state
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    // loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadMore = (ann) => {
    setSelectedAnnouncement(ann);
    setIsViewModalOpen(true);
  };

  const getCategoryBadge = (category) => {
    switch(category?.toLowerCase()) {
      case 'maintenance': 
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'security': 
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'community': 
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: 
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const filteredAnnouncements = announcements
    .filter(ann => 
      (activeTab === 'All' || ann.type?.toLowerCase() === activeTab.toLowerCase()) &&
      (ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       ann.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden animate-in fade-in duration-700">
      {/* Top Navigation / Search Header */}
      <header className="h-16 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md flex items-center justify-between px-8">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm transition-all outline-none" 
              placeholder="Search announcements, tags, or authors..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-primary/10 text-slate-500 relative transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-background-dark"></span>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Page Title & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Announcements</h1>
            <p className="text-slate-500 mt-1">Stay updated with the latest community news and system updates.</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/5 p-1 rounded-xl">
            {['All', 'Maintenance', 'Security', 'Community'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-primary/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* High-Density List Container */}
        <div className="bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full hidden md:table">
              <thead>
                <tr className="text-left bg-slate-50 dark:bg-primary/5">
                  {['Announcement', 'Category', 'Date', 'Action'].map((header) => (
                    <th key={header} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-0">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm font-medium">Fetching updates...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredAnnouncements.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <span className="material-symbols-outlined text-4xl opacity-20">campaign</span>
                        <p className="text-sm font-medium">No announcements found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAnnouncements.map((ann) => (
                    <tr key={ann.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center">
                            {ann.type?.toLowerCase() === 'maintenance' ? <Wrench className="w-5 h-5 text-primary" /> : 
                             ann.type?.toLowerCase() === 'security' ? <Shield className="w-5 h-5 text-primary" /> : 
                             ann.type?.toLowerCase() === 'community' ? <Users className="w-5 h-5 text-primary" /> : 
                             <Info className="w-5 h-5 text-primary" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{ann.title}</h4>
                            <p className="text-xs text-slate-500 truncate max-w-sm">{ann.message}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getCategoryBadge(ann.type)}`}>
                          {ann.type || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(ann.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleReadMore(ann)}
                          className="text-primary text-xs font-bold hover:underline"
                        >
                          Read More
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden ">
              {isLoading ? (
                <div className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Fetching updates...</p>
                  </div>
                </div>
              ) : filteredAnnouncements.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl opacity-20">campaign</span>
                    <p className="text-sm font-medium">No announcements found.</p>
                  </div>
                </div>
              ) : (
                filteredAnnouncements.map((ann) => (
                  <div key={ann.id} className="p-4 space-y-4 hover:bg-primary/5 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center">
                        {ann.type?.toLowerCase() === 'maintenance' ? <Wrench className="w-4 h-4 text-primary" /> : 
                         ann.type?.toLowerCase() === 'security' ? <Shield className="w-4 h-4 text-primary" /> : 
                         ann.type?.toLowerCase() === 'community' ? <Users className="w-4 h-4 text-primary" /> : 
                         <Info className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getCategoryBadge(ann.type)}`}>
                            {ann.type || 'General'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(ann.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{ann.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ann.message}</p>
                    <div className="flex justify-end pt-1">
                      <button 
                        onClick={() => handleReadMore(ann)}
                        className="text-primary text-xs font-bold flex items-center gap-1"
                      >
                        Read More
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Pagination Footer */}
          {!isLoading && filteredAnnouncements.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-primary/5 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing <span className="font-bold text-slate-900 dark:text-white">1 to {filteredAnnouncements.length}</span> of {announcements.length} announcements
              </p>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-xs font-bold" disabled>2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Detail Modal */}
      <ViewAnnouncementModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        announcement={selectedAnnouncement}
      />
    </div>
  );
}