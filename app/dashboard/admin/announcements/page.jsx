'use client'

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Search, Calendar, Shield, Wrench, Info } from 'lucide-react';
import { api } from '@/services/api';
import AnnouncementModal from '@/components/admin/AnnouncementModal';

const dummyAnnouncements = [
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(dummyAnnouncements);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAnnouncementCreated = (newAnnouncement) => {
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'security': return <Shield className="w-5 h-5 text-red-500" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-orange-500" />;
      case 'event': return <Calendar className="w-5 h-5 text-purple-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-50/50 dark:bg-red-900/10 text-red-900 dark:text-red-100';
      case 'normal': return 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-100';
      case 'low': return 'bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100';
      default: return 'bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100';
    }
  };

  const filteredAnnouncements = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ann.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Announcements
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and broadcast messages to residents and staff.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Announcement
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 flex justify-center items-center shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-blue-400 dark:text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Announcements</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              There are currently no announcements. Create a new one to broadcast a message to the estate.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden ${getPriorityColor(announcement.priority)}`}
            >
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="shrink-0 mt-1 bg-white/50 dark:bg-black/20 p-3 rounded-full">
                  {getTypeIcon(announcement.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white pr-8">
                      {announcement.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium opacity-70 whitespace-nowrap bg-black/5 dark:bg-white/5 px-3 py-1 rounded-md">
                        {new Date(announcement.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="opacity-80 leading-relaxed mb-4">
                    {announcement.message}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm font-medium opacity-70">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center text-[10px]">
                        {announcement.author ? announcement.author.charAt(0) : 'A'}
                      </span>
                      By {announcement.author || 'Admin'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <AnnouncementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAnnouncementCreated={handleAnnouncementCreated} 
      />
    </div>
  );
}