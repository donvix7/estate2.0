import React, { use } from 'react'
import EmergencyForm from '@/components/resident/EmergencyForm'

export default function EmergencyReportPage({ params }) {
  const unwrappedParams = use(params)
  const caseType = unwrappedParams?.case || 'other'

  return (
    <EmergencyForm caseType={caseType} />
  );
}