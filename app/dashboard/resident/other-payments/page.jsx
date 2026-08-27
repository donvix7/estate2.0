import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

const page = () => {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
        <PageHeader
          title="Other Payments"
          description="Make one-off payments for estate services and fees."
          icon={CreditCard}
          iconColor="blue"
        />
        <ComingSoon 
            title="Other Payments"
            description="The other payments feature is currently under development. Check back soon!"
            icon={CreditCard}
        />
    </div>
  )
}

export default page
