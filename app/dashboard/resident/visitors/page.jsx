import VisitorsTab from '@/components/resident/VisitorsTab'
import React from 'react'
import { BackButton } from '@/components/ui/BackButton'

const page = () => {
  return (
    <div className="p-6">
        <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
        <VisitorsTab />
    </div>
  )
}

export default page