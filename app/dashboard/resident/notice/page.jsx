import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Megaphone } from 'lucide-react'

export default function NoticeBoardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">Notice Board</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Read vital announcements and rules published by estate management.</p>
        </div>
      </div>
      
      <ComingSoon 
        title="Notice Board" 
        description="The estate communication center is being developed. Check back soon for official announcements." 
        icon={Megaphone} 
      />
    </div>
  )
}
