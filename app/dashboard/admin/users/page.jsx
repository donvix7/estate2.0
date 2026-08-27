'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Plus } from 'lucide-react';
import ProfileList from '@/components/admin/ProfileList';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';

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
          <Button
            variant="secondary"
            icon={UserPlus}
            onClick={() => router.push('/dashboard/admin/users/requests')}
          >
            View Requests
          </Button>
          <Button
            icon={Plus}
            onClick={() => router.push('/dashboard/admin/users/add')}
          >
            Add New Profile
          </Button>
        </div>
      </PageHeader>        
         
      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6">
        <ProfileList />
      </div>
    </div>
  )
}