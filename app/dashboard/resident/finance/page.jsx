import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Landmark } from 'lucide-react'
import PaymentsTab from '@/components/resident/PaymentsTab'
import { WalletCard } from '@/components/resident/WalletCard'

export default function FinancePage() {
  return (
    <div className='p-4 flex flex-col gap-4 max-w-7xl mx-auto'>
        <WalletCard />

      <PaymentsTab />
    </div>
  )
}
