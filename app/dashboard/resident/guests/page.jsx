import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { UsersRound } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Guests"
            description="The guest management feature is currently under development. Check back soon!"
            icon={UsersRound}
        />
    </div>
  )
}

export default page
