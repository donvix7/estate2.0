import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Headset } from 'lucide-react'

export default function ContactUsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">Contact Us</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get in touch with the estate administrative and support teams.</p>
        </div>
      </div>
      
      <ComingSoon 
        title="Contact Support" 
        description="The support directory and messaging system will be available shortly." 
        icon={Headset} 
      />
    </div>
  )
}
