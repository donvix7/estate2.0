import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Wallet } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

const page = () => {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 space-y-6">
        <PageHeader
          title="Fund Wallet"
          description="Add funds to your estate wallet to pay for services and utilities."
          icon={Wallet}
          iconColor="green"
        />
        <ComingSoon 
            title="Fund Wallet"
            description="The wallet funding feature is currently under development. Check back soon!"
            icon={Wallet}
        />
    </div>
  )
}

export default page
