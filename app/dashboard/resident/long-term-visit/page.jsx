import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { CalendarRange } from 'lucide-react'

const page = () => {
  return (
    <div className="p-6">
        <ComingSoon 
            title="Long Term Visit"
            description="The long term visitor management feature is currently under development. Check back soon!"
            icon={CalendarRange}
        />
    </div>
  )
}

export default page
