import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Info } from 'lucide-react'

export default function InformationPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">Information</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Access estate resources, guides, and important documents.</p>
        </div>
      </div>
      
      <ComingSoon 
        title="Information Center" 
        description="We are compiling all the important estate information and guides. They will be available here soon." 
        icon={Info} 
      />
    </div>
  )
}
