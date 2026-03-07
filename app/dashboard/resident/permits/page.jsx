import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { FileBadge2 } from 'lucide-react'
import { BackButton } from '@/components/ui/BackButton'

const page = () => {
  return (
    <div className="p-6">
        <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
        <ComingSoon 
            title="Permits"
            description="The permits application and tracking feature is currently under development. Check back soon!"
            icon={FileBadge2}
        />
    </div>
  )
}

export default page
