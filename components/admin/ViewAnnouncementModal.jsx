'use client'

import React from 'react';
import { X, Calendar, User, Tag, Megaphone, Wrench, Shield, Users, Info, Subject, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ViewAnnouncementModal({ isOpen, onClose, announcement, isAdmin, onDelete }) {
  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0f13]/40 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-[#1a1d23] w-full max-w-2xl rounded-md overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Header */}
        <div className="p-10 pb-6 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#1241a1] opacity-10"></div>
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-md flex items-center justify-center shrink-0 ${
              announcement.type?.toLowerCase() === 'maintenance' ? 'bg-amber-50 text-amber-600' : 
              announcement.type?.toLowerCase() === 'security' ? 'bg-rose-50 text-rose-600' : 
              announcement.type?.toLowerCase() === 'community' ? 'bg-[#1241a1]/10 text-[#1241a1]' : 'bg-[#1a1d23] text-[#8a8f98]'
            }`}>
              {announcement.type?.toLowerCase() === 'maintenance' ? <Wrench className="size-8" /> : 
               announcement.type?.toLowerCase() === 'security' ? <Shield className="size-8" /> : 
               announcement.type?.toLowerCase() === 'community' ? <Users className="size-8" /> : 
               <Megaphone className="size-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] ${
                  announcement.type?.toLowerCase() === 'maintenance' ? 'bg-amber-100 text-amber-700 font-bold' : 
                  announcement.type?.toLowerCase() === 'security' ? 'bg-rose-100 text-rose-700 font-bold' : 
                  announcement.type?.toLowerCase() === 'community' ? 'bg-[#1241a1] text-white' : 'bg-[#1a1d23] text-white0'
                }`}>
                  {announcement.type || 'General'}
                </span>
              </div>
              <h2 className="text-3xl font-semibold text-white text-white leading-tight tracking-tight">
                {announcement.title}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-[#2a2d33]  text-[#8a8f98] hover:text-white hover:text-white transition-all active:scale-90"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto px-10 py-6 space-y-10">
          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#1a1d23] bg-[#1a1d23]/50 p-5 rounded-md border-none">
              <div className="flex items-center gap-2 text-[#8a8f98] mb-2">
                <Calendar className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Broadcast Date</span>
              </div>
              <p className="text-sm font-semibold text-white text-white">
                {new Date(announcement.createdAt || Date.now()).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="bg-[#1a1d23] bg-[#1a1d23]/50 p-5 rounded-md border-none">
              <div className="flex items-center gap-2 text-[#8a8f98] mb-2">
                <User className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Authorized By</span>
              </div>
              <p className="text-sm font-semibold text-white text-white">
                {announcement.author || 'Administrative Team'}
              </p>
            </div>
          </div>

          {/* Announcement Message Body */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#1241a1] rounded-full"></div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8a8f98]">Communication Details</h3>
            </div>
            <div className="bg-[#1a1d23] rounded-md border-none">
              <p className="text-[#8a8f98]  text-xl leading-relaxed whitespace-pre-wrap font-semibold">
                {announcement.message}
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-10 pt-6 flex justify-end items-center gap-4 bg-[#1a1d23] border-none">
          {isAdmin && (
            <Button
              variant="danger"
              size="lg"
              icon={Trash2}
              className="mr-auto"
              onClick={() => {
                if (window.confirm('Secure Action: Are you sure you want to delete this broadcast?')) {
                  onDelete(announcement.id || announcement._id);
                }
              }}
            >
              Remove Broadcast
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
          >
            Acknowledge
          </Button>
        </div>
      </div>
    </div>
  );
}
