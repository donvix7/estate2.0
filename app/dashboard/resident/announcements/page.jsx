'use client'

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Search, Calendar, Shield, Wrench, Info, Users, ChevronRight, ChevronLeft, BellRing } from 'lucide-react';
import { api } from '@/services/api';
import ViewAnnouncementModal from '@/components/admin/ViewAnnouncementModal';
import { getAnnouncements, getResidentData } from '@/lib/service';
import { readAnnouncement } from '@/lib/action';


export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Modal state
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [annData, resData] = await Promise.all([
          getAnnouncements(),
          getResidentData()
        ]);
        setAnnouncements(annData);
        if (resData) setUserId(resData?._id || resData?.id);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  };

  const handleReadMore = async (ann) => {
    if (userId) {
      await readAnnouncement(ann._id, userId);
      loadAnnouncements(); // Refresh list to update stay status
    }
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

  const filteredAnnouncements = (Array.isArray(announcements?.docs) ? announcements.docs : [])
    .filter(ann => 
      (activeTab === 'All' || ann.type?.toLowerCase() === activeTab.toLowerCase()) &&
      (ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       ann.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const totalPages = announcements?.totalPages;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden animate-in fade-in duration-700">
      

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
                  {['Announcement', 'Category', 'Date','status', ''].map((header) => (
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
                        <BellRing className="size-12 opacity-20" />
                        <p className="text-sm font-medium">No announcements found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  announcements?.docs.map((ann) => (
                    <tr key={ann._id || ann.id} className="hover:bg-primary/5 transition-colors group">
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
                      <td className={`px-6 py-4 whitespace-nowrap  text-slate-500`}>
                        {ann.readBy?.includes(userId) ? 'Read' : 'Unread'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleReadMore(ann)}
                          className="text-primary text-xs font-bold hover:underline hover:cursor-pointer hover:text-blue-500"
                        >
                          View
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
                    <BellRing className="size-12 opacity-20" />
                    <p className="text-sm font-medium">No announcements found.</p>
                  </div>
                </div>
              ) : (
                announcements?.docs.map((ann) => (
                  <div key={ann._id || ann.id} className="p-4 space-y-4 hover:bg-primary/5 transition-colors">
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
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {!isLoading && filteredAnnouncements.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-900">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-700 dark:text-slate-300">{announcements?.pagingCounter} to {announcements?.docs.length}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{announcements?.totalDocs}</span> announcements
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button 
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`size-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        currentPage === p 
                          ? 'bg-[#1241a1] text-white shadow-xl shadow-[#1241a1]/20' 
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View Detail Modal */}
      <ViewAnnouncementModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        announcement={selectedAnnouncement}
        isAdmin={false}
      />
    </div>
  );
}