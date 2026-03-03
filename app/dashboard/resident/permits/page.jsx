import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { FileBadge2 } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Permits"
            description="The permits application and tracking feature is currently under development. Check back soon!"
            icon={FileBadge2}
        />
    </div>
  )
}

export default page
