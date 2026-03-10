'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageSquare, ShieldCheck, UserPlus } from 'lucide-react';

export const PromptModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  placeholder = "Type here...", 
  confirmText = "Submit",
  cancelText = "Cancel",
  onConfirm,
  defaultValue = "",
  type = "text"
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) setValue(defaultValue);
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(value);
    onClose();
  };

  const getIcon = () => {
    if (title?.toLowerCase().includes('pin')) return <ShieldCheck className="w-6 h-6 text-primary" />;
    if (title?.toLowerCase().includes('blacklist')) return <UserPlus className="w-6 h-6 text-red-500" />;
    return <MessageSquare className="w-6 h-6 text-slate-500" />;
  };

  const getBgColor = () => {
    if (title?.toLowerCase().includes('blacklist')) return 'bg-red-50 dark:bg-red-500/10';
    return 'bg-primary/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className={`w-14 h-14 rounded-full ${getBgColor()} flex items-center justify-center mb-4`}>
              {getIcon()}
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px]">
              {message}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                autoFocus
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                disabled={!value.trim()}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white bg-primary hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {confirmText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
