import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { BackButton } from '@/components/ui/BackButton'

const page = () => {
  return (
    <div className="p-6">
        <PageHeader 
          title="Guests" 
          description="The guest management feature is currently under development."
          icon={UsersRound}
          iconColor="blue"
        >
          <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
        </PageHeader>
        <ComingSoon 
            title="Guests"
            description="The guest management feature is currently under development. Check back soon!"
            icon={UsersRound}
        />
    </div>
  )
}

export default page
