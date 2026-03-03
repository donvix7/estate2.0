import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { CreditCard } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Other Payments"
            description="The other payments feature is currently under development. Check back soon!"
            icon={CreditCard}
        />
    </div>
  )
}

export default page
