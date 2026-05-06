import VisitorsTab from '@/components/resident/VisitorsTab'
import React from 'react'
import { BackButton } from '@/components/ui/BackButton'
import { PageHeader } from '@/components/ui/PageHeader'
import { QrCode } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
        <PageHeader 
          title="Visitor Access" 
          description="Generate access codes and manage your guest list."
          icon={QrCode}
          iconColor="blue"
        >
          <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
        </PageHeader>
        <VisitorsTab />
    </div>
  )
}

export default page