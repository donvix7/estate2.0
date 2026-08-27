'use client';
import React, { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import AddStaffForm from '@/components/resident/AddStaffForm'
import { BackButton } from '@/components/ui/BackButton'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'

export default function ResidentStaffPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [staffList, setStaffList] = useState([]) // Empty for now

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
        <PageHeader 
          title="Domestic Staff" 
          description="Manage registration for your maids, drivers, and other household staff."
          icon={Users}
          iconColor="blue"
        >
          {!showAddForm && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddForm(true)}
            >
              Add New Staff
            </Button>
          )}
          <BackButton fallbackRoute="/dashboard/resident" label="Back" />
        </PageHeader>

        {/* Content Area */}
        {showAddForm ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AddStaffForm 
                    onCancel={() => setShowAddForm(false)} 
                    onSuccess={(data) => {
                        console.log('Staff added:', data);
                        setShowAddForm(false);
                        // In a real app, you would add the data to the list here
                    }} 
                />
            </div>
        ) : (
            <div className="bg-[#1a1d23] rounded-[24px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] shadow-[0_4px_30px_rgb(0,0,0,0.2)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-blue-50 bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-[#1241a1]" />
                </div>
                <h3 className="text-xl font-bold text-white text-white font-heading mb-2">No Staff Registered</h3>
                <p className="text-sm text-[#8a8f98] text-[#8a8f98] max-w-sm mb-8">
                    You haven't registered any domestic staff yet. Register your staff to grant them proper access to the estate.
                </p>
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 bg-[#1241a1]/10 hover:bg-[#1241a1]/20 text-[#1241a1] text-blue-400 px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Register Your First Staff
                </button>
            </div>
        )}
    </div>
  )
}
