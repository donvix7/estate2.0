import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { HardHat } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Workers"
            description="The external workers and contractors tracking feature is currently under development. Check back soon!"
            icon={HardHat}
        />
    </div>
  )
}

export default page
