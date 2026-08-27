import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Bell } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

const page = () => {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
        <PageHeader
          title="Notices"
          description="Stay updated with estate announcements and community notices."
          icon={Bell}
          iconColor="amber"
        />
        <ComingSoon 
            title="Notices"
            description="The notices feature is currently under development. Check back soon!"
            icon={Bell}
        />
    </div>
  )
}

export default page
