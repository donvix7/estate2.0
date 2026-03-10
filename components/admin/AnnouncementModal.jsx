'use client'

import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { api } from '@/services/api';

export default function AnnouncementModal({ isOpen, onClose, onAnnouncementCreated }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'normal'
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.saveAnnouncement(formData);
      if (response.success) {
        onAnnouncementCreated(response.data);
        
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: 'general',
          priority: 'normal'
        });
        onClose();
      }
    } catch (error) {
      console.error('Failed to save announcement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-500" />
            New Announcement
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="announcement-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="E.g., Scheduled Power Outage"
                className="w-full px-4 py-3 rounded-xl border-none bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full appearance-none px-4 py-3 rounded-xl border-none bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-sm"
                  >
                    <option value="general">🟢 General Info</option>
                    <option value="maintenance">🟠 Maintenance</option>
                    <option value="security">🔴 Security Alert</option>
                    <option value="event">🟣 Community Event</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="priority" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Priority Level
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full appearance-none px-4 py-3 rounded-xl border-none bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-sm"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Message Body <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter the full details of your announcement here..."
                className="w-full px-4 py-3 rounded-xl border-none bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none shadow-sm"
              ></textarea>
            </div>
            
          </form>
        </div>
        
        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/80 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="announcement-form"
            disabled={isSubmitting || !formData.title || !formData.message}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Broadcasting...
              </>
            ) : (
              <>
                <Megaphone className="w-4 h-4" />
                Broadcast Now
              </>
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}
