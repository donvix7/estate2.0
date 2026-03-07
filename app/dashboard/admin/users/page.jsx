'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import ProfileList from '@/components/admin/ProfileList';

export default function UsersPage() {
  const router = useRouter();

  return (
    <div className="animate-fadeIn p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">People Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage Residents, Staff & Security personnel for the estate.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/admin/users/add')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>        
         
      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6">
        <ProfileList />
      </div>
    </div>
  )
}