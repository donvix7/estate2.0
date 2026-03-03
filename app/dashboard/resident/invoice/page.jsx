import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Receipt } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Invoice"
            description="The invoice management feature is currently under development. Check back soon!"
            icon={Receipt}
        />
    </div>
  )
}

export default page
