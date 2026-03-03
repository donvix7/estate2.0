import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { FileText } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Dues"
            description="The dues management feature is currently under development. Check back soon!"
            icon={FileText}
        />
    </div>
  )
}

export default page
