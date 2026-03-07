import AnnouncementsTab from '@/components/resident/AnnouncementsTab'
import React from 'react'
import { BackButton } from '@/components/ui/BackButton'

const page = () => {
  return (
    <div className="p-6">
        <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
        <AnnouncementsTab />
    </div>
  )
}

export default page