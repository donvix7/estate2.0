'use client'

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Search, Calendar, Shield, Wrench, Info, Users, Bell, ChevronLeft, ChevronRight, BellRing } from 'lucide-react';
import AnnouncementModal from '@/components/admin/AnnouncementModal';
import ViewAnnouncementModal from '@/components/admin/ViewAnnouncementModal';
import { getAnnouncements } from '@/lib/service';
import { readAnnouncement, removeAnnouncement } from '@/lib/action';
import MetricCard from '@/components/MetricCard';


export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [dateFilter, setDateFilter] = useState('All time');
  const [dateSort, setDateSort] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAnnouncements, setPaginatedAnnouncements] = useState([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, [currentPage, searchTerm, activeTab, dateFilter, dateSort]);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await getAnnouncements();

      setAnnouncements(data.docs || []);
      setPaginatedAnnouncements(data || []);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnouncementCreated = (newAnnouncement) => {
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const handleReadMore = async(ann) => {
    setSelectedAnnouncement(ann);
    setIsViewModalOpen(true);
    await readAnnouncement(ann._id || ann.id);
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      const result = await removeAnnouncement(id);
      if (result) {
        setIsViewModalOpen(false);
        loadAnnouncements();
      }
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      alert('Failed to delete announcement. Please try again.');
    }
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
    .filter(ann => {
      const matchSearch = ((ann.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                           (ann.message?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
      const matchTab = (activeTab === 'All' || ann.type?.toLowerCase() === activeTab.toLowerCase());
      
      let matchDate = true;
      const annDate = new Date(ann.timestamp);
      const now = new Date();
      
      if (dateFilter === 'Today') {
        matchDate = annDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'Past Week') {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchDate = annDate >= lastWeek;
      } else if (dateFilter === 'Past Month') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        matchDate = annDate >= lastMonth;
      }

      return matchSearch && matchTab && matchDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateSort === 'Newest' ? dateB - dateA : dateA - dateB;
    });

  const totalPages = paginatedAnnouncements.totalPages;
  const startIndex = paginatedAnnouncements.page;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden animate-in fade-in duration-700">
      {/* Top Navigation / Search Header */}
      <header className="h-16 flex items-center justify-between px-8">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-primary transition-colors" />
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary dark:bg-primary/90 dark:text-blue-500 hover:text-blue-500 dark:hover:text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Plus className="size-5" />
            Create Announcement
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Announcements</h1>
            <p className="text-slate-500 mt-1">Stay updated with the latest community news and system updates.</p>
          </div>
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            icon={<Megaphone className="size-5" />} 
            label="Total Posts" 
            value={announcements.length} 
            trend="Live" 
            trendColor="text-blue-500" 
            bgColor="bg-blue-100 dark:bg-blue-900/30" 
            iconColor="text-blue-600" 
          />
          <MetricCard 
            icon={<Wrench className="size-5" />} 
            label="Maintenance" 
            value={announcements.filter(a => a.type?.toLowerCase() === 'maintenance').length} 
            trend="Active" 
            trendColor="text-emerald-500" 
            bgColor="bg-emerald-100 dark:bg-emerald-900/30" 
            iconColor="text-emerald-600" 
          />
          <MetricCard 
            icon={<Shield className="size-5" />} 
            label="Security" 
            value={announcements.filter(a => a.type?.toLowerCase() === 'security').length} 
            trend="Monitored" 
            trendColor="text-rose-500" 
            bgColor="bg-rose-100 dark:bg-rose-900/30" 
            iconColor="text-rose-600" 
          />
          <MetricCard 
            icon={<Users className="size-5" />} 
            label="Community" 
            value={announcements.filter(a => a.type?.toLowerCase() === 'community').length} 
            trend="Social" 
            trendColor="text-blue-500" 
            bgColor="bg-indigo-100 dark:bg-indigo-900/30" 
            iconColor="text-indigo-600" 
          />
        </div>

        {/* Page Title & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-primary/5 p-1 rounded-xl">
              <Calendar className="size-4 ml-2 text-slate-400" />
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold text-slate-500 outline-none pr-6 uppercase tracking-wider cursor-pointer"
              >
                <option>All time</option>
                <option>Today</option>
                <option>Past Week</option>
                <option>Past Month</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-primary/5 p-1 rounded-xl">
              <select 
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold text-slate-500 outline-none pr-6 uppercase tracking-wider cursor-pointer"
              >
                <option>Newest</option>
                <option>Oldest</option>
              </select>
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
        </div>

        {/* Responsive List Container */}
        <div className="bg-white dark:bg-slate-900/50 rounded-xl overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-slate-50 dark:bg-primary/5">
                {["Title", "Category", "Date", "Read By", ""].map((item) => (
                  <th key={item} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{item}</th>
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
                  announcements.map((ann, idx) => (
                    <tr key={ann._id || ann.id || idx} className="hover:bg-primary/5 transition-colors group">
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
                          {new Date(ann.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getCategoryBadge(ann.type)}`}>
                          {ann.readBy?.length || '0'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleReadMore(ann)}
                          className="text-primary text-xs font-bold hover:underline"
                        >
                         View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-500 dark:divide-slate-800">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-slate-400">Fetching updates...</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <BellRing className="size-12 opacity-20 mx-auto mb-3" />
                <p className="text-sm font-medium">No announcements found.</p>
              </div>
            ) : (
              announcements.map((ann, idx) => (
                <div key={ann._id || ann.id || idx} className="p-4 space-y-3 active:bg-slate-50 dark:active:bg-primary/5 transition-colors mb-5 ">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {ann.type?.toLowerCase() === 'maintenance' ? <Wrench className="w-5 h-5 text-primary" /> : 
                         ann.type?.toLowerCase() === 'security' ? <Shield className="w-5 h-5 text-primary" /> : 
                         ann.type?.toLowerCase() === 'community' ? <Users className="w-5 h-5 text-primary" /> : 
                         <Info className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{ann.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium font-mono uppercase">
                          {new Date(ann.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${getCategoryBadge(ann.type)}`}>
                      {ann.type || 'General'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {ann.message}
                  </p>
               <div className="flex  flex-end justify-end w-full">
                   <button 
                    onClick={() => handleReadMore(ann)}
                    className=" w-fit py-2.5 hover:cursor-pointer bg-slate-50 dark:bg-primary/5 text-primary text-xs font-bold rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    View Details
                  </button>
               </div>
                </div>
              ))
            )}
          </div>
          {!isLoading && filteredAnnouncements.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-900">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-700 dark:text-slate-300">{paginatedAnnouncements.pagingCounter}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{paginatedAnnouncements.totalDocs}</span> &nbsp; announcements
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
        isAdmin={true}
        onDelete={handleDeleteAnnouncement}
      />

      {/* Create Modal */}
      <AnnouncementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAnnouncementCreated={handleAnnouncementCreated} 
      />
    </div>
  );
}