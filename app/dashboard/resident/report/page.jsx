import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { TriangleAlert } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function ReportIssuePage() {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
      <PageHeader 
        title="Report an Issue" 
        description="Log maintenance tickets and report concerns to the estate facility management."
        icon={TriangleAlert}
        iconColor="blue"
      />
      
      <ComingSoon 
        title="Issue Reporting" 
        description="The facility reporting system is being refined to ensure your issues are resolved quickly. Coming soon." 
        icon={TriangleAlert} 
      />
    </div>
  )
}
