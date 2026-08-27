import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { FileBadge2 } from 'lucide-react'
import { BackButton } from '@/components/ui/BackButton'
import { PageHeader } from '@/components/ui/PageHeader'

const page = () => {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
        <PageHeader 
          title="Permits" 
          description="The permits application and tracking feature is currently under development."
          icon={FileBadge2}
          iconColor="blue"
        >
          <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
        </PageHeader>
        <ComingSoon 
            title="Permits"
            description="The permits application and tracking feature is currently under development. Check back soon!"
            icon={FileBadge2}
        />
    </div>
  )
}

export default page
