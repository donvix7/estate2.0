import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Bell } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Notices"
            description="The notices feature is currently under development. Check back soon!"
            icon={Bell}
        />
    </div>
  )
}

export default page
