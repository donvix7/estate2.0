'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import ProfileList from '@/components/admin/ProfileList';
import { PageHeader } from '@/components/ui/PageHeader';
import { Users } from 'lucide-react';

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
        <button
          onClick={() => router.push('/dashboard/admin/users/add')}
          className="px-6 py-2.5 bg-[#1241a1] text-white text-[11px] font-semibold uppercase tracking-widest rounded-md hover:brightness-110 transition-all flex items-center gap-2 active:scale-95 border-none"
        >
          <Plus className="w-5 h-5" />
          Add New Profile
        </button>
      </PageHeader>        
         
      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6">
        <ProfileList />
      </div>
    </div>
  )
}