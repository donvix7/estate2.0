"use client"
import React from 'react'
import InvoiceList from '@/components/resident/InvoiceList'
import { Receipt } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { BackButton } from '@/components/ui/BackButton'

const page = () => {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
      <PageHeader
        title="My Invoices"
        description="View, download, and manage your billing history and service charges."
        icon={Receipt}
        iconColor="blue"
      >
        <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
      </PageHeader>

      <InvoiceList />
    </div>
  )
}

export default page
