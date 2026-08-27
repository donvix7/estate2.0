import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { PartyPopper, CalendarDays } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

const page = () => {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
        <PageHeader
          title="Host Events"
          description="Organize and manage community events within the estate."
          icon={CalendarDays}
          iconColor="indigo"
        />
        <ComingSoon 
            title="Host Events"
            description="The event hosting and management feature is currently under development. Check back soon!"
            icon={PartyPopper}
        />
    </div>
  )
}

export default page
