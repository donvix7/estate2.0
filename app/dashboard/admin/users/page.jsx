'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Plus } from 'lucide-react';
import ProfileList from '@/components/admin/ProfileList';
import { PageHeader } from '@/components/ui/PageHeader';

export default function UsersPage() {
  const router = useRouter();

  return (
    <div className="animate-in fade-in duration-700 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <PageHeader 
        title="People Management" 
        description="Centralized directory for Residents, Estate Staff & Security personnel."
        icon={Users}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/admin/users/requests')}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold uppercase tracking-widest rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 active:scale-95 border-none"
          >
            <UserPlus className="w-5 h-5" />
            View Requests
          </button>
          <button
            onClick={() => router.push('/dashboard/admin/users/add')}
            className="px-6 py-2.5 bg-[#1241a1] text-white text-[11px] font-semibold uppercase tracking-widest rounded-md hover:brightness-110 transition-all flex items-center gap-2 active:scale-95 border-none"
          >
            <Plus className="w-5 h-5" />
            Add New Profile
          </button>
        </div>
      </PageHeader>        
         
      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6">
        <ProfileList />
      </div>
    </div>
  )
}