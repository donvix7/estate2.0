'use client';

import React from 'react';
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', 
  confirmText = 'OK', 
  cancelText = 'Cancel',
  showCancel = false,
  onConfirm 
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
          bg: 'bg-emerald-50 dark:bg-emerald-500/10',
          button: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-6 h-6 text-red-500" />,
          bg: 'bg-red-50 dark:bg-red-500/10',
          button: 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
          bg: 'bg-amber-50 dark:bg-amber-500/10',
          button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
        };
      case 'question':
        return {
          icon: <Info className="w-6 h-6 text-primary" />,
          bg: 'bg-primary/10',
          button: 'bg-primary hover:brightness-110 shadow-primary/20'
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-primary" />,
          bg: 'bg-primary/10',
          button: 'bg-primary hover:brightness-110 shadow-primary/20'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full ${styles.bg} flex items-center justify-center mb-6`}>
            {styles.icon}
          </div>
          
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            {title}
          </h3>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px]">
            {message}
          </p>
          
          <div className={`mt-8 w-full flex ${showCancel ? 'flex-row gap-3' : 'flex-col'}`}>
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`flex-1 py-3.5 rounded-2xl text-sm font-black text-white shadow-lg transition-all active:scale-95 ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
