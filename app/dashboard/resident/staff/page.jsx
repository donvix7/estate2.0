import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { ShieldCheck } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Staff"
            description="The domestic staff management feature is currently under development. Check back soon!"
            icon={ShieldCheck}
        />
    </div>
  )
}

export default page
