'use client'

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Calendar, Shield, Wrench, Info, Users, Bell, ChevronLeft, ChevronRight, BellRing } from 'lucide-react';
import AnnouncementModal from '@/components/admin/AnnouncementModal';
import ViewAnnouncementModal from '@/components/admin/ViewAnnouncementModal';
import { getAnnouncements } from '@/lib/service';
import { readAnnouncement, removeAnnouncement } from '@/lib/action';
import MetricCard from '@/components/MetricCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Pagination from '@/components/pagination';


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
      const data = await getAnnouncements(currentPage);
      const result = data.data || data;
      setAnnouncements(result.docs || []);
      setPaginatedAnnouncements(result);
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
        return 'bg-orange-100 text-orange-700 bg-orange-900/30 text-orange-400';
      case 'security': 
        return 'bg-red-100 text-red-700 bg-red-900/30 text-red-400';
      case 'community': 
        return 'bg-green-100 text-green-700 bg-green-900/30 text-green-400';
      default: 
        return 'bg-blue-100 text-blue-700 bg-blue-900/30 text-blue-400';
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
    <div className="flex flex-col gap-6 lg:gap-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-12">
      {/* Top Navigation / Search Header */}
      <PageHeader
        title="Announcements"
        description="Stay updated with the latest community news and system updates."
        icon={Megaphone}
      >
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search announcements..."
            className="min-w-[220px] md:min-w-[300px]"
          />
          <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Create Announcement
          </Button>
        </div>
      </PageHeader>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <MetricCard
          icon={<Megaphone className="size-5" />}
          label="Total Posts"
          value={announcements.length}
          trend="Live"
          trendColor="text-blue-500"
          tone="blue"
        />
        <MetricCard
          icon={<Wrench className="size-5" />}
          label="Maintenance"
          value={announcements.filter(a => a.type?.toLowerCase() === 'maintenance').length}
          trend="Active"
          trendColor="text-emerald-500"
          tone="emerald"
        />
        <MetricCard
          icon={<Shield className="size-5" />}
          label="Security"
          value={announcements.filter(a => a.type?.toLowerCase() === 'security').length}
          trend="Monitored"
          trendColor="text-rose-500"
          tone="rose"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#1a1d23] p-1 rounded-md">
            <Calendar className="size-4 ml-2 text-[#8a8f98]" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent border-none text-[10px] font-semibold text-[#8a8f98] outline-none pr-6 uppercase tracking-wider cursor-pointer"
            >
              <option>All time</option>
              <option>Today</option>
              <option>Past Week</option>
              <option>Past Month</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#1a1d23] p-1 rounded-md">
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              className="bg-transparent border-none text-[10px] font-bold text-[#8a8f98] outline-none pr-6 uppercase tracking-wider cursor-pointer"
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#1a1d23] p-1 rounded-md w-fit">
          {['All', 'Maintenance', 'Security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === tab
                  ? 'bg-[#1241a1] text-white'
                  : 'text-[#8a8f98] hover:bg-[#1241a1]/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive List Container */}
      <Card>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-[#1a1d23]">
              {["Title", "Category", "Date", "Read By", ""].map((item) => (
                <th key={item} className="px-6 py-4 text-xs font-semibold text-[#8a8f98] uppercase tracking-wider">{item}</th>
              ))}
              </tr>
            </thead>
            <tbody className="divide-y-0">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#8a8f98]">
                      <LoadingState message="Broadcasting Community Updates..." />
                    </td>
                  </tr>
                ) : filteredAnnouncements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#8a8f98]">
                      <div className="flex flex-col items-center gap-3">
                        <BellRing className="size-12 opacity-20" />
                        <p className="text-sm font-semibold">No announcements found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  announcements.map((ann, idx) => (
                    <tr key={ann._id || ann.id || idx} className="group hover:bg-[#2a2d33] transition-all cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-md bg-[#1a1d23] shrink-0 flex items-center justify-center transition-colors group-hover:bg-[#1241a1] group-hover:text-white">
                            {ann.type?.toLowerCase() === 'maintenance' ? <Wrench className="w-5 h-5" /> : 
                             ann.type?.toLowerCase() === 'security' ? <Shield className="w-5 h-5" /> : 
                             ann.type?.toLowerCase() === 'community' ? <Users className="w-5 h-5" /> : 
                             <Info className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-white transition-colors">{ann.title}</h4>
                            <p className="text-xs text-[#8a8f98] truncate max-w-sm font-medium">{ann.message}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryBadge(ann.type)}`}>
                          {ann.type || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-[#8a8f98] font-semibold">
                          {new Date(ann.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryBadge(ann.type)}`}>
                          {ann.readBy?.length || '0'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleReadMore(ann)}
                          className="text-[#1241a1] text-xs font-semibold hover:underline"
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
          <div className="md:hidden divide-y divide-[#2a2d33] border-[#2a2d33]">
            {isLoading ? (
              <div className="p-8 text-center">
                <LoadingState message="Broadcasting..." />
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="p-8 text-center text-[#8a8f98]">
                <BellRing className="size-12 opacity-20 mx-auto mb-3" />
                <p className="text-sm font-semibold">No announcements found.</p>
              </div>
            ) : (
              announcements.map((ann, idx) => (
                <div key={ann._id || ann.id || idx} className="group p-4 space-y-3 bg-[#1a1d23] transition-all mb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-md bg-[#1a1d23] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#1241a1] group-hover:text-white">
                        {ann.type?.toLowerCase() === 'maintenance' ? <Wrench className="w-5 h-5" /> : 
                         ann.type?.toLowerCase() === 'security' ? <Shield className="w-5 h-5" /> : 
                         ann.type?.toLowerCase() === 'community' ? <Users className="w-5 h-5" /> : 
                         <Info className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white line-clamp-1">{ann.title}</h4>
                        <span className="text-[10px] text-[#8a8f98] font-semibold font-mono uppercase">
                          {new Date(ann.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${getCategoryBadge(ann.type)}`}>
                      {ann.type || 'General'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed font-medium">
                    {ann.message}
                  </p>
               <div className="flex justify-end w-full">
                   <button 
                    onClick={() => handleReadMore(ann)}
                    className="px-4 py-2 hover:cursor-pointer bg-[#1a1d23] text-[#1241a1] text-xs font-semibold rounded-md hover:bg-[#1241a1] hover:text-white transition-all"
                  >
                    View Details
                  </button>
               </div>
                </div>
              ))
            )}
          </div>
         
          <Pagination 
            page={currentPage}
            totalPages={paginatedAnnouncements.totalPages || 1}
            handlePageChange={(p) => setCurrentPage(p)}
          />
      </Card>

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