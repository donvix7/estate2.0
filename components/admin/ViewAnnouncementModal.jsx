'use client'

import React from 'react';
import { X, Calendar, User, Tag, Megaphone, Wrench, Shield, Users, Info, Subject } from 'lucide-react';

export default function ViewAnnouncementModal({ isOpen, onClose, announcement }) {
  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              announcement.type?.toLowerCase() === 'maintenance' ? 'bg-amber-500/10 text-amber-600' : 
              announcement.type?.toLowerCase() === 'security' ? 'bg-rose-500/10 text-rose-600' : 
              announcement.type?.toLowerCase() === 'community' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'
            }`}>
              {announcement.type?.toLowerCase() === 'maintenance' ? <Wrench className="w-7 h-7" /> : 
               announcement.type?.toLowerCase() === 'security' ? <Shield className="w-7 h-7" /> : 
               announcement.type?.toLowerCase() === 'community' ? <Users className="w-7 h-7" /> : 
               <Megaphone className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  announcement.type?.toLowerCase() === 'maintenance' ? 'bg-amber-500/10 text-amber-600' : 
                  announcement.type?.toLowerCase() === 'security' ? 'bg-rose-500/10 text-rose-600' : 
                  announcement.type?.toLowerCase() === 'community' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                }`}>
                  {announcement.type || 'General'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {announcement.title}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-primary/5 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Date Posted</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {new Date(announcement.timestamp || Date.now()).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-primary/5 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <User className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Posted By</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {announcement.author || 'Administrative Team'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="text-primary w-5 h-5" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 m-0">Full Announcement</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {announcement.message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 flex justify-end gap-3 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
