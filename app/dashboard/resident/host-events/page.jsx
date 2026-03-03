import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { PartyPopper } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Host Events"
            description="The event hosting and management feature is currently under development. Check back soon!"
            icon={PartyPopper}
        />
    </div>
  )
}

export default page
