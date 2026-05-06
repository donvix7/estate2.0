import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { FileText } from 'lucide-react'
import { BackButton } from '@/components/ui/BackButton'
import { PageHeader } from '@/components/ui/PageHeader'

const page = () => {
  return (
    <div className="p-6">
        <PageHeader 
          title="Estate Dues" 
          description="Track and pay your recurring estate maintenance dues."
          icon={FileText}
          iconColor="blue"
        >
          <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
        </PageHeader>
        <ComingSoon 
            title="Dues"
            description="The dues management feature is currently under development. Check back soon!"
            icon={FileText}
        />
    </div>
  )
}

export default page
