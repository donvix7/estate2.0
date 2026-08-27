'use client'

import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { saveAnnouncement } from '@/lib/action';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0f13]/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1a1d23] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 rounded-md border-none">
        
        {/* Premium Header */}
        <div className="flex items-center justify-between p-8 bg-[#1a1d23] border-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#1241a1] opacity-10"></div>
          <div>
            <h2 className="text-2xl font-semibold text-white text-white flex items-center gap-3 tracking-tight">
              <div className="p-2.5 rounded-md bg-[#1a1d23] text-[#1241a1]">
                <Megaphone className="size-6" />
              </div>
              Broadcast Announcement
            </h2>
            <p className="text-xs font-semibold text-[#8a8f98] uppercase tracking-widest mt-1.5 ml-1">Community Outreach</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8a8f98] hover:text-white hover:text-white p-2 rounded-md hover:bg-[#2a2d33]  transition-all active:scale-90"
            disabled={isSubmitting}
          >
            <X className="size-6" />
          </button>
        </div>
        
        <div className="p-8 pt-0 overflow-y-auto">
          <form id="announcement-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-[0.2em] ml-1">
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
                className="w-full px-5 py-4 rounded-md border-none bg-[#1a1d23] bg-[#1a1d23]/50 text-white text-white text-sm font-semibold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all placeholder:text-[#8a8f98] placeholder:font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-[0.2em] ml-1">
                Category / Classification
              </label>
              <div className="relative group">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full appearance-none px-5 py-4 rounded-md border-none bg-[#1a1d23] bg-[#1a1d23]/50 text-white text-white text-sm font-semibold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all cursor-pointer"
                >
                  <option value="General">General Information</option>
                  <option value="Maintenance">Maintenance & Utilities</option>
                  <option value="Security">Security Advisory</option>
                  <option value="Event">Community Event</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-[#8a8f98] group-hover:text-[#1241a1] transition-colors">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-[10px] font-semibold text-[#8a8f98] uppercase tracking-[0.2em] ml-1">
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
                className="w-full px-5 py-4 rounded-md border-none bg-[#1a1d23] bg-[#1a1d23]/50 text-white text-white text-sm font-semibold focus:ring-2 focus:ring-[#1241a1]/20 outline-none transition-all resize-none placeholder:text-[#8a8f98] placeholder:font-medium leading-relaxed"
              ></textarea>
            </div>
          </form>
        </div>
        
        <div className="p-8 bg-[#1a1d23] bg-[#1a1d23]/30 flex justify-end gap-4 border-none">
          <Button
            variant="ghost"
            size="lg"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Discard
          </Button>
          <Button
            variant="primary"
            size="lg"
            icon={Megaphone}
            type="submit"
            form="announcement-form"
            disabled={isSubmitting || !formData.title || !formData.message}
          >
            {isSubmitting ? 'Broadcasting...' : 'Publish Now'}
          </Button>
        </div>
        
      </div>
    </div>
  );
}
