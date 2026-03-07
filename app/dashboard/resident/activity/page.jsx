import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Activity } from 'lucide-react'
import { BackButton } from '@/components/ui/BackButton'

export default function ActivityPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">Activity Log</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your recent actions, payments, and interactions within the estate.</p>
        </div>
      </div>
      
      <ComingSoon 
        title="Activity Log" 
        description="Your comprehensive activity log is currently under construction. Stay tuned." 
        icon={Activity} 
      />
    </div>
  )
}
