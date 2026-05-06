import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Headset } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function ContactUsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Contact Us" 
        description="Get in touch with the estate administrative and support teams."
        icon={Headset}
        iconColor="blue"
      />
      
      <ComingSoon 
        title="Contact Support" 
        description="The support directory and messaging system will be available shortly." 
        icon={Headset} 
      />
    </div>
  )
}
