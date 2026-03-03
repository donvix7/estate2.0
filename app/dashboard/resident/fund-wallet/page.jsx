import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Wallet } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Fund Wallet"
            description="The wallet funding feature is currently under development. Check back soon!"
            icon={Wallet}
        />
    </div>
  )
}

export default page
