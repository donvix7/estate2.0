import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { TriangleAlert } from 'lucide-react'

export default function ReportIssuePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">Report an Issue</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Log maintenance tickets and report concerns to the estate facility management.</p>
        </div>
      </div>
      
      <ComingSoon 
        title="Issue Reporting" 
        description="The facility reporting system is being refined to ensure your issues are resolved quickly. Coming soon." 
        icon={TriangleAlert} 
      />
    </div>
  )
}
