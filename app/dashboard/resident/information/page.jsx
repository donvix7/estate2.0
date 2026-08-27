import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Info } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function InformationPage() {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
      <PageHeader
        title="Information"
        description="Access estate resources, guides, and important documents."
        icon={Info}
        iconColor="blue"
      />

      <ComingSoon 
        title="Information Center" 
        description="We are compiling all the important estate information and guides. They will be available here soon." 
        icon={Info} 
      />
    </div>
  )
}
