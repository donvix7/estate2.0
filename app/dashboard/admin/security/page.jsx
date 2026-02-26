import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { ShieldAlert } from 'lucide-react'

const SecurityPage = () => {
  return (
    <ComingSoon 
      title="Security Headquarters" 
      description="The security monitoring and incident logging module is currently undergoing maintenance and upgrades."
      icon={ShieldAlert}
    />
  )
}

export default SecurityPage