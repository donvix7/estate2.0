'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import ProfileList from '@/components/admin/ProfileList';

export default function UsersPage() {
  const router = useRouter();

  return (
    <div className="animate-in fade-in duration-700 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">People Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm font-medium">
            Centralized directory for Residents, Estate Staff & Security personnel.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/admin/users/add')}
          className="px-6 py-2.5 bg-[#1241a1] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-xl shadow-[#1241a1]/20 flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Profile
        </button>
      </div>        
         
      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6">
        <ProfileList />
      </div>
    </div>
  )
}