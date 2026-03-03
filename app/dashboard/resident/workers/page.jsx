'use client'

import React, { useState } from 'react'
import { HardHat, Plus } from 'lucide-react'
import AddStaffForm from '@/components/resident/AddStaffForm'

export default function ResidentWorkersPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [workersList, setWorkersList] = useState([]) // Empty for now

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">External Workers</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage registration for your contractors, artisans, and temporary workers.</p>
            </div>
            {!showAddForm && (
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Register Worker
                </button>
            )}
        </div>

        {/* Content Area */}
        {showAddForm ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AddStaffForm 
                    type="worker"
                    onCancel={() => setShowAddForm(false)} 
                    onSuccess={(data) => {
                        console.log('Worker added:', data);
                        setShowAddForm(false);
                        // In a real app, you would add the data to the list here
                    }} 
                />
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgb(0,0,0,0.2)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6">
                    <HardHat className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-2">No Workers Registered</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                    You haven't registered any external workers yet. Register your contractors to grant them proper access to the estate.
                </p>
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Register Your First Worker
                </button>
            </div>
        )}
    </div>
  )
}
