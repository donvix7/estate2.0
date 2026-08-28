'use client'

import React, { useState, useEffect } from 'react';
import { Megaphone, Shield, Wrench, Info, Users, ChevronRight, BellRing, Clock, Eye, MoreHorizontal, CheckCircle2, Circle } from 'lucide-react';
import ViewAnnouncementModal from '@/components/admin/ViewAnnouncementModal';
import { getAnnouncements, getResidentData } from '@/lib/service';
import { readAnnouncement } from '@/lib/action';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Pagination from '@/components/pagination';

// Trading-style stat card component
const StatCard = ({ label, value, icon, change }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className="bg-[#1a1d23]/40 bg-[#12131C] backdrop-blur-md rounded-2xl border-none p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#8a8f98] text-[#8a8f98] uppercase tracking-wider">{label}</span>
        <span className="text-[#8a8f98]">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-extrabold text-white text-white">{value}</span>
        {change !== undefined && change !== null && (
          <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-[#8a8f98]'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ isRead }) => {
  return (
    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider ${isRead ? 'text-[#8a8f98]' : 'text-emerald-500'}`}>
      {isRead ? (
        <>
          <CheckCircle2 className="size-3 mr-1.5" />
          Read
        </>
      ) : (
        <>
          <Circle className="size-2 mr-1.5 fill-emerald-500 animate-pulse" />
          Unread
        </>
      )}
    </span>
  );
};

// Category badge component
const CategoryBadge = ({ category }) => {
  const styles = {
    maintenance: 'bg-amber-500/10 text-amber-600 text-amber-400 border-none',
    security: 'bg-rose-500/10 text-rose-600 text-rose-400 border-none',
    community: 'bg-emerald-500/10 text-emerald-600 text-emerald-400 border-none',
    general: 'bg-[#1241a1]/10 text-[#1241a1] text-blue-400 border-none'
  };
  
  const getStyle = () => {
    switch(category?.toLowerCase()) {
      case 'maintenance': return styles.maintenance;
      case 'security': return styles.security;
      case 'community': return styles.community;
      default: return styles.general;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStyle()}`}>
      {category || 'General'}
    </span>
  );
};

// Category icon mapping
const getCategoryIcon = (category) => {
  switch(category?.toLowerCase()) {
    case 'maintenance': return <Wrench className="w-5 h-5" />;
    case 'security': return <Shield className="w-5 h-5" />;
    case 'community': return <Users className="w-5 h-5" />;
    default: return <Info className="w-5 h-5" />;
  }
};

// Trading-style table component
const Table = ({ headers, data, onRowClick, renderStatus, renderBadge }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#1a1d23]/50 bg-[#0B0C11] border-none">
            {headers.map((header, idx) => (
              <th key={idx} className={`px-5 py-3 text-left font-bold text-[#8a8f98] text-[10px] uppercase tracking-wider ${header.align || 'text-left'}`}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {data.length > 0 ? (
            data.map((item, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-[#1a1d23]/40 hover:bg-[#151622] transition-colors cursor-pointer border-none"
                onClick={() => onRowClick && onRowClick(item)}
              >

                {headers.map((header, hIdx) => (
                  <td key={hIdx} className="px-4 py-3">
                    {header.key === 'status' && renderStatus ? (
                      renderStatus(item)
                    ) : header.key === 'category' && renderBadge ? (
                      renderBadge(item)
                    ) : header.key === 'announcement' ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1241a1]/10 flex items-center justify-center shrink-0">
                          <span className="text-[#1241a1]">
                            {getCategoryIcon(item.type)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-[#1241a1] transition-colors truncate max-w-[200px]">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#8a8f98] truncate max-w-[300px]">{item.message}</p>
                        </div>
                      </div>
                    ) : header.key === 'date' ? (
                      <span className="text-xs text-[#8a8f98] font-medium">
                        {new Date(item.timestamp || Date.now()).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    ) : header.key === 'action' ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRowClick && onRowClick(item); }}
                        className="text-[#8a8f98] hover:text-[#1241a1] text-xs font-semibold transition-colors border-none bg-transparent"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-white font-medium">
                        {item[header.key] || '—'}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <BellRing className="size-12 text-[#8a8f98] opacity-30" />
                  <p className="font-medium text-white">No announcements found</p>
                  <p className="text-xs text-[#8a8f98]">No announcements matching your criteria</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

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
    const fetchUserData = async () => {
      try {
        const resData = await getResidentData();
        if (resData) setUserId(resData?._id || resData?.id);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const annData = await getAnnouncements(currentPage);
        setAnnouncements(annData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements(currentPage);
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  };

  const handleReadMore = async (ann) => {
    if (userId) {
      await readAnnouncement(ann._id, userId);
      loadAnnouncements();
    }
    setSelectedAnnouncement(ann);
    setIsViewModalOpen(true);
  };

  const filteredAnnouncements = (Array.isArray(announcements?.docs) ? announcements.docs : [])
    .filter(ann => 
      (activeTab === 'All' || ann.type?.toLowerCase() === activeTab.toLowerCase()) &&
      (ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       ann.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const totalPages = announcements?.totalPages;
  
  // Stats
  const totalAnnouncements = announcements?.totalDocs || 0;
  const unreadCount = filteredAnnouncements.filter(ann => !ann.readBy?.includes(userId)).length;
  const readCount = filteredAnnouncements.filter(ann => ann.readBy?.includes(userId)).length;

  return (
    <div className="min-h-screen bg-[#0d0f13] p-6 animate-in fade-in duration-700 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-white">Announcements</span>
          <p className="text-[#8a8f98] text-sm font-medium">Stay updated with the latest community news and system updates.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#1a1d23] border border-[#2a2d33] rounded-xl p-1.5 flex gap-1">
            {['All', 'Maintenance', 'Security', 'Community'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border-none ${
                  activeTab === tab 
                    ? 'bg-[#1241a1] text-white' 
                    : 'text-[#8a8f98] hover:text-white hover:bg-[#2a2d33]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard 
          label="Total Announcements" 
          value={totalAnnouncements} 
          icon={<Megaphone className="size-4" />}
          change={12.5}
        />
        <StatCard 
          label="Unread" 
          value={unreadCount} 
          icon={<BellRing className="size-4" />}
          change={-5.2}
        />
        <StatCard 
          label="Read" 
          value={readCount} 
          icon={<Eye className="size-4" />}
          change={8.7}
        />
        <StatCard 
          label="Categories" 
          value="4" 
          icon={<Users className="size-4" />}
          change={0}
        />
      </div>

      {/* Announcements Table */}
      <div className="bg-[#1a1d23] rounded-xl border border-[#2a2d33] overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-[#2a2d33]">
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <Megaphone className="size-5 text-[#1241a1]" />
              Announcements
            </h2>
            <p className="text-xs text-[#8a8f98] font-medium">{filteredAnnouncements.length} total announcements</p>
          </div>
          <button className="p-2 hover:bg-[#2a2d33] rounded-lg transition-colors border-none bg-transparent">
            <MoreHorizontal className="size-4 text-[#8a8f98]" />
          </button>
        </div>

        {isLoading ? (
          <div className="px-4 py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-8 border-2 border-[#1241a1]/20 border-t-[#1241a1] rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-[#8a8f98]">Fetching updates...</p>
            </div>
          </div>
        ) : (
          <Table 
            headers={[
              { key: 'announcement', label: 'Announcement' },
              { key: 'category', label: 'Category' },
              { key: 'date', label: 'Date' },
              { key: 'status', label: 'Status' },
              { key: 'action', label: '', align: 'text-right' }
            ]}
            data={filteredAnnouncements}
            onRowClick={(item) => handleReadMore(item)}
            renderBadge={(item) => <CategoryBadge category={item.type} />}
            renderStatus={(item) => <StatusBadge isRead={item.readBy?.includes(userId)} />}
          />
        )}

        {!isLoading && filteredAnnouncements.length > 0 && (
          <div className="px-4 py-3 bg-[#2a2d33]/30 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2a2d33]">
            <p className="text-sm text-[#8a8f98]">
              Showing <span className="font-bold text-white">{announcements?.pagingCounter || 0} to {((announcements?.pagingCounter || 1) + (announcements?.docs?.length || 0) - 1)}</span> of <span className="font-bold text-white">{announcements?.totalDocs || 0}</span> announcements
            </p>
            <Pagination 
              page={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
            />
          </div>
        )}
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