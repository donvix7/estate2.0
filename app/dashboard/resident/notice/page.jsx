import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Megaphone, BellRing } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function NoticeBoardPage() {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
      <PageHeader
        title="Notice Board"
        description="Read vital announcements and rules published by estate management."
        icon={BellRing}
        iconColor="amber"
      />

      <ComingSoon 
        title="Notice Board" 
        description="The estate communication center is being developed. Check back soon for official announcements." 
        icon={Megaphone} 
      />
    </div>
  )
}
