'use client'

import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { saveAnnouncement } from '@/lib/action';
import { toast } from 'react-toastify';

export default function AnnouncementModal({ isOpen, onClose, onAnnouncementCreated }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'General'
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
      const response = await saveAnnouncement(formData);
      if (response.success) {
        onAnnouncementCreated(response.data);
        toast.success('Announcement broadcast successfully');
        
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: 'General'
        });
        onClose();
      } else {
        toast.error(response.message || 'Failed to broadcast announcement');
      }
    } catch (error) {
      console.error('Failed to save announcement:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 rounded-[2rem] border-none">
        
        {/* Premium Header */}
        <div className="flex items-center justify-between p-8 bg-white dark:bg-slate-900 border-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#1241a1] to-transparent opacity-20"></div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              <div className="p-2.5 rounded-2xl bg-[#1241a1]/10 text-[#1241a1]">
                <Megaphone className="size-6" />
              </div>
              Broadcast Announcement
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5 ml-1">Community Outreach</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
            disabled={isSubmitting}
          >
            <X className="size-6" />
          </button>
        </div>
        
        <div className="p-8 pt-0 overflow-y-auto">
          <form id="announcement-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Announcement Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="E.g., Infrastructure Maintenance Update"
                className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all shadow-inner placeholder:text-slate-300 placeholder:font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Category / Classification
              </label>
              <div className="relative group">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full appearance-none px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-black focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all shadow-inner cursor-pointer"
                >
                  <option value="General">General Information</option>
                  <option value="Maintenance">Maintenance & Utilities</option>
                  <option value="Security">Security Advisory</option>
                  <option value="Event">Community Event</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400 group-hover:text-[#1241a1] transition-colors">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Detailed Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="6"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Compose your message to the residents..."
                className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all resize-none shadow-inner placeholder:text-slate-300 placeholder:font-medium leading-relaxed"
              ></textarea>
            </div>
          </form>
        </div>
        
        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end gap-4 border-none">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-2xl text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="submit"
            form="announcement-form"
            disabled={isSubmitting || !formData.title || !formData.message}
            className="flex items-center justify-center gap-3 bg-[#1241a1] hover:brightness-110 text-white px-10 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#1241a1]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Broadcasting...
              </>
            ) : (
              <>
                <Megaphone className="size-4" />
                Publish Now
              </>
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}
