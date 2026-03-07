import React, { use } from 'react'
import EmergencyForm from '@/components/resident/EmergencyForm'
import { BackButton } from '@/components/ui/BackButton'

export default function EmergencyReportPage({ params }) {
  const unwrappedParams = use(params)
  const caseType = unwrappedParams?.case || 'other'

  return (
    <div className="p-6">
      <BackButton fallbackRoute="/dashboard/resident/emergency" label="Back to Types" />
      <EmergencyForm caseType={caseType} />
    </div>
  );
}