import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Megaphone } from 'lucide-react'

const AnnouncementsPage = () => {
  return (
    <ComingSoon 
      title="Announcements Hub" 
      description="The global announcements broadcasting system is currently under construction. Check back soon for updates!"
      icon={Megaphone}
    />
  )
}

export default AnnouncementsPage