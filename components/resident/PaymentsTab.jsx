import React from 'react'
import { TechCard } from '@/components/ui/TechCard'
import PaystackPayment from '@/components/payment'

export default function PaymentsTab() {
  return (
    <TechCard>
       <h3 className="font-bold text-gray-900 dark:text-gray-100 font-heading mb-6">Payments & Billing</h3>
      <PaystackPayment />

    </TechCard>
  )
}
